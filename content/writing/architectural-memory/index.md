---
description: Coding agents now write every line across the platform. Output multiplied while my capacity to review the architecture stayed the same.
---

# Architectural Memory

*November 10, 2026*

![Nested code modules connected by a shared set of architectural rules](./architectural-memory.png)

## The Stakes of Shared Architecture

In late 2021, I began building the foundations of a shared application platform for one of Canada's largest telecommunications and media groups. It now supports ten independently deployed web applications and four TV applications across high-traffic news, video, and radio services.

The products share SDKs, reusable components, tooling, and architecture from a modular monorepo. Every shared decision has a wide blast radius.

I serve as the platform's architect and work as a hands-on senior engineer. I ship features and collaborate closely with every developer on the team, helping shape, implement, and review changes.

## Code Outran Review

I have not written a single line of code by hand since December 2025. Coding agents now produce every single line across the platform.

The timing came from a leap in model capability. Around the release of [Claude Opus 4.5](https://www.anthropic.com/news/claude-opus-4-5) and [GPT-5.2](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5-2_prompting_guide), coding agents became reliable enough to implement complete changes. Their use spread across the team over the months that followed.

My engineering work now consists of defining problems and constraints, deciding where behavior belongs, shaping how parts of the system interact, steering agents through implementation, and judging the results.

Agent-based development multiplied our output. My review capacity stayed fixed, and so did my responsibility for the architecture and long-term maintainability. A developer armed with a coding agent can now produce changes faster than a senior engineer can thoughtfully review them. Senior architectural judgment became the bottleneck.

That pressure has surfaced elsewhere. In March 2026, two articles presented conflicting accounts of a series of incidents at Amazon:

- [Amazon holds engineering meeting following AI-related outages](https://www.ft.com/content/7cab4ec7-4712-4137-b602-119a44f771de): The *Financial Times* reported that Amazon planned to require senior sign-off on AI-assisted changes from junior and mid-level engineers after a run of high-impact incidents.
- [Correcting the Financial Times report about recent Amazon.com service incidents and AI](https://www.aboutamazon.com/news/company-news/amazon-outage-ai-financial-times-correction): Amazon disputed the link to AI-written code and the new approval requirement.

The proposed response reveals the constraint: code generation scales instantly; senior attention scales one review at a time. A sign-off rule simply turns the senior engineer into the queue.

Unmanaged, that output becomes slop: code that looks reasonable in isolation and gradually erodes the architecture. I used to catch those decisions one pull request at a time. The volume of changes now exceeds what I can review with the same level of attention.

## The Team Was the Memory

Before agent-based development, we already had types, schemas, tests, and CI. Architectural review carried rules the repository did not encode:

- Which module should own a capability, its source of truth, and its lifecycle?
- Should a behavior be reusable, or should the application own its final form?
- Applications consume shared packages exclusively through public entry points.
- Dependencies flow from product applications toward shared packages.

At our old pace, code review was the only viable place to enforce these rules.

When I found a violation, I explained the rule. Then I explained it again on another pull request. Eventually the comments became less frequent because my colleagues had learned the boundaries and their rationale.

The team became the architecture's memory. The repository showed the resulting structure. The rationale behind it remained with the team, and new contributors learned it through code review.

## Review Agents Shared the Blind Spot

My first response to the growing volume of pull requests was to “fight agents with agents.” I started using agents to review pull requests before looking at them myself.

Their reviews covered bugs, edge cases, and code consistency. Architectural judgment remained outside their context.

The reviewing and implementing agents shared the same blind spot. Both could inspect the repository. Directories showed where code already lived. Ownership, lifecycle, and dependency rationale remained in the team's memory. An agent could place behavior in the nearest convenient module, expose an internal API, or introduce a dependency in the wrong direction.

Their apparent agreement could accelerate architectural drift.

Human feedback compounded because colleagues retained lessons and applied them to later work. Every new agent session began with the same architectural amnesia.

## Make the Repository Remember

Years of conversations and code reviews had produced a set of unwritten architectural rules held in the team's memory. Every coding agent begins with the repository, so we started putting those rules into it.

I started calling this approach Architectural Memory. It is just a fancy name for writing those rules down next to the code and automatically checking the ones a tool can recognize.

We store this memory in two forms:

- `AGENTS.md` carries contextual memory: principles and rules that require judgment.
- Linter rules carry executable memory: architectural constraints recognizable in source code.

Our JavaScript and TypeScript codebase implements the executable rules as custom ESLint rules.

Deciding which module should own a behavior requires understanding its consumers, lifecycle, and reason to change, so that judgment belongs in `AGENTS.md`.

The custom linter rules encode repository architecture: ownership, dependency direction, and public boundaries. One rule can restrict consumers to public entry points. Another can enforce dependency direction. Each error names the supported path and explains why it exists.

Each custom ESLint rule lives in its own file. We can add or delete rules independently, and the collection grows as a set of small, reviewable architectural checks.

`AGENTS.md` guides implementation with architectural judgment. Custom linter rules validate recognizable constraints deterministically.

Good guardrails reveal the supported path and reject recognizable violations.

## Memory Needs Coordinates

Clear module boundaries make Architectural Memory addressable. Our monorepo already separated applications, shared packages, reusable components, and tooling into recognizable homes. Those boundaries showed who owned each behavior, which code changed together, and how dependencies were allowed to flow. Each rule gained an address.

A root `AGENTS.md` contains repository-wide principles. Files below `apps/`, `packages/`, or an individual package add narrower instructions for that part of the tree. Coding agents discover the files hierarchically, and the closest instruction wins when rules conflict.

```text
AGENTS.md
apps/
  AGENTS.md
packages/
  AGENTS.md
  billing/
    AGENTS.md
  design-system/
    AGENTS.md
```

The applicable chain for `packages/billing/` includes the root, `packages/`, and `billing/` rules. Design-system guidance remains scoped to its own package. This keeps every instruction close to the code it governs.

Visible module boundaries are the prerequisite, and a monorepo is one effective way to provide them. In a codebase made of enormous files that mix presentation, business rules, and infrastructure, instructions become global and linter rules fill with exceptions.

Architectural Memory inherits the precision of the boundaries expressed in the codebase.

## Turn Every Review Into Memory

Boris Cherny, the creator of Claude Code at Anthropic, described a useful precedent. He used to tally recurring review comments in a spreadsheet and write a lint rule after the same issue appeared three or four times. Now, when he spots something “lintable,” he asks Claude Code to [write the rule in that pull request](https://www.youtube.com/watch?v=julbw1JuAz0&t=2718s).

Agents changed the economics. We can now write a rule, fix existing violations, and validate the result during the same review.

We now treat certain review findings as evidence of missing Architectural Memory:

1. Decide whether the finding is an isolated mistake or an architectural rule.
2. Put the judgment in the narrowest relevant `AGENTS.md`.
3. Add a linter rule when the violation is mechanically recognizable.
4. Fix existing violations before enabling the rule.

Each review corrects the current diff and improves the environment that will produce the next one.

## Memory Must Evolve

Every encoded rule compounds, including harmful ones.

Only consequential, durable judgments deserve to become Architectural Memory. Keep architectural linter rules narrowly scoped, make messages actionable, and document explicit exceptions. Stale rules create false positives and push developers and agents toward elaborate workarounds.

Architectural Memory should describe the current design clearly enough for the team to challenge and evolve it deliberately.

## Make Architectural Judgment Compound

Since we began encoding these rules, agent-written changes have followed the platform's architecture more consistently. Implementation agents start with more context. Review agents evaluate against the same expectations. Custom architectural rules catch recognizable violations before anyone reviews the pull request.

Agent throughput exposed a longstanding weakness. The architecture depended on a small team remembering years of decisions. Code generation quickly outpaced review as the way to transmit them.

Working through agents moved my leverage into maintaining that memory. I stay close to implementation by shipping features, supporting the team, and improving the instructions and constraints that shape every change.

I review each architectural decision once, then store it where every future agent can use it.
