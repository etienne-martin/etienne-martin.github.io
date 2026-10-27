# One Query Too Many

*October 26, 2026*

![Abstract geometric composition in off-white, gray, and coral](./abstract-study.svg)

## A Small Check on a Hot Path

Some B2B systems must check every request against a small set of customer-specific rules. A request might need a known client identifier and an allowed website origin. Engineers change those rules rarely, but the system checks them constantly.

We ran into this while building [Sudden](https://sudden.network/), a serverless video-delivery platform. The customer is the organization delivering the video, while its viewers generate the traffic. When a popular new release attracts a large audience, tens of thousands of concurrent viewers can turn one small check into thousands of checks per second.

## The Obvious Place to Start

Our first design was conventional: we stored each customer's configuration in a database, queried it when a request arrived, checked the request against those rules, and continued:

```
request ──► query database ──► verify customer rules ──► handle request
```

It worked. When the configuration grew from one rule set per customer to several independently managed rule sets, the logical model had to change. We added transition logic, migrated the existing records, and verified the backfill.

The database handled that work correctly. But it was our first clue that we were treating release-managed configuration as operational data.

The read path was the bigger problem. Every request incurred a database read and a network round trip before the customer check could finish. AWS reports [single-digit-millisecond average service latency](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TroubleshootingLatency.html) for most single-item DynamoDB operations, before application and network transport. PostgreSQL performance depends on the query and deployment, but the important part is the same: the request has to leave the process and wait for another system.

At the edge, that round trip defeats much of the point. Putting compute close to the viewer helps little if every request still has to travel back to an AWS Region for the configuration needed to make a decision.

Serverless functions are billed for elapsed execution time while they wait. Each lookup therefore costs us twice: once for the database read and again for the serverless compute spent waiting for it.

## The Next Obvious Step

We next cached each customer's configuration in module-level memory. A warm serverless execution environment could reuse its copy without querying the database.

That made warm requests faster, but it did not create one cache. It created one cache per execution environment. Every cold start still queried the database to fill its own cache, and a traffic spike created more environments and more cache misses just as load increased.

The caches also filled and expired at different times. After we changed a customer's configuration, one request could reach an environment with the new value and succeed. The next could reach an older environment and fail.

We had replaced one database lookup with a fleet of unrelated clocks.

## Back to the Drawing Board

The configuration was small, non-secret, changed by engineers, and its updates could wait for a deployment. Customers could not edit it themselves. The system needed infrequent, deliberate updates and extremely frequent reads.

The configuration had the shape of data but the lifecycle of code.

The key was not merely to keep that configuration in the codebase. It was to distribute it across the infrastructure. Instead of making every function travel to one centralized copy, we put a copy inside every function that consumes it.

### Before

```
function A ─┐
function B ─┼── network ──► customer configuration
function C ─┘
```

### After

```
                                           ┌──► function A [data copy]
customer configuration ──► build/package ──┼──► function B [data copy]
                                           └──► function C [data copy]
```

We created a private JavaScript package in the monorepo, with one JSON file per customer. The package validates every file against a schema, rejects duplicate identifiers, and builds in-memory lookup indexes once when a runtime starts. Many serverless functions import the same small interface for looking up customer configuration and checking a request.

The repository still has one authoritative source. During a build, the package and its JSON files are copied into every function that consumes them. Each deployed function therefore contains its code and a complete, versioned copy of the data it needs.

That duplication is intentional. The data lives inside the runtime, next to the code that reads it. There is no database query, cache lookup, connection pool, or network hop for the customer check. When the platform adds more execution environments to handle traffic, every new environment starts with its own copy. The data scales out with the compute.

This becomes especially valuable with edge computing. AWS replicates a [Lambda@Edge function](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/edge-functions.html) to locations around the world. When the customer configuration ships inside the same artifact, the data travels with the compute. Each edge runtime can make the decision locally instead of reaching back to a regional database.

## Updating the Data

Changing a customer's rules now follows the same path as a code change:

```
edit JSON ──► pull request ──► CI checks ──► deploy
```

Git is the source of truth, pull requests provide the review workflow, and the deployment pipeline distributes the new version. Each change has an author, review, timestamp, and diff. A malformed customer file or duplicate identifier fails before deployment.

This makes writes slower. A change takes a few minutes to move through CI and deployment. That is acceptable because adding or changing a customer is a deliberate process rather than a self-service action. In exchange, the far more frequent reads become in-memory lookups.

## Five Milliseconds at Video Scale

Take a popular release drawing 50,000 concurrent viewers. If each viewer produces one request that performs this check every five seconds, that is 10,000 checks per second on average, or 36 million per hour.

For a simple model, assume one blocking five-millisecond lookup per check, a 1 GB x86 serverless function at AWS Lambda's on-demand rate, and a strongly consistent DynamoDB read no larger than 4 KB. Free tiers and committed-use discounts are excluded; eventual consistency would halve only the database line.

Those requests accumulate 50 seconds of serverless function execution time every wall-clock second. Over an hour, the function spends 180,000 GB-seconds waiting for remote configuration reads.

At AWS's published `us-east-1` rates, that wait costs about $3 per hour in [serverless function duration](https://aws.amazon.com/lambda/pricing/). The 36 million strongly consistent DynamoDB reads add about $4.50 at [$0.125 per million read request units](https://aws.amazon.com/dynamodb/pricing/).

Cost is not the only limit. DynamoDB documents a maximum of [3,000 read units per second per partition](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-partition-key-design.html), so 10,000 strongly consistent reads per second to one customer item would throttle. The table isolates the unit economics; making that centralized design work for one concentrated traffic spike would require sharding, caching, or another layer.

| At 10,000 checks per second | Database lookup | Bundled configuration |
| --- | ---: | ---: |
| External configuration reads per hour | 36,000,000 | 0 |
| Database read cost per hour | $4.50 | $0 |
| Serverless function network-wait cost per hour | about $3 | $0 |
| Combined cost per hour | about $7.50 | $0 for those two line items |

Under this model, 30 days of sustained traffic turns that small lookup into about $5,400 in reads and serverless function wait time. It also adds five milliseconds to each request and makes this mandatory check depend on the database being available.

The package takes the 36 million external reads to zero. Each check still uses a small amount of local CPU, but it no longer waits on another system.

## Where It Fits

This pattern is a good fit when:

- the data is bounded and non-sensitive;
- engineers control the changes;
- reads vastly outnumber writes and lookups are simple;
- updates can wait for a deployment.

We use databases instead when:

- customers need self-service;
- writes are frequent or the dataset grows without a practical bound;
- updates must become globally visible immediately;
- queries are dynamic.

Shipping code and configuration together does not eliminate schema evolution. It lets the schema, data, and the code that reads them change in one reviewed artifact. Bundling does not make a rollout atomic: two versions can run briefly. Unlike independently expiring caches, that overlap is bounded by the deployment, and each artifact contains compatible code and configuration.

At our current scale, the complete dataset fits comfortably in every artifact and adds negligible bundle size and startup work. For larger datasets, packaging becomes runtime-specific: regional serverless functions can use a shared Lambda layer, while [Lambda@Edge does not support layers](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-at-edge-function-restrictions.html) and needs another distribution strategy. A layer changes packaging, not the amount of data loaded into the runtime.

## One Source, Many Copies

The database was doing its job. The mistake was treating release-managed configuration as operational data. Optimizing that mismatch led us from a database read to per-runtime caches and inconsistent expiry.

The answer was not a faster database. It was putting the data where it is read. One source in the repository becomes many copies across the infrastructure, each living next to the code that consumes it. New regional or edge compute arrives with the data already inside it.

For this workload, the rare write pays for a pull request and deployment. The millions of reads pay for a local memory lookup. Centralize the source of truth, then distribute the read path.
