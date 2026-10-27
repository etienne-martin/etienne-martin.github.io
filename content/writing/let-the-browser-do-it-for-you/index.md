# Let the Browser Do It for You

*February 18, 2022*

![Four abstract geometric studies in off-white, gray, and coral](./browser.png)

Browsers are an incredible feat of engineering. Chromium alone contains [tens of millions of lines of source code](<https://en.wikipedia.org/wiki/Chromium_(web_browser)>), and I still find it remarkable that browsers work at all.

Choosing `border-radius` over background sprites may seem obvious today, but it wasn't always. Once I've found a way to do something, I tend to stick with it. I keep reaching into the same old bag of tricks without checking whether the browser has caught up.

So this post is mostly a reminder to myself: before I write another helper or install another package, check whether the browser already does the job.

_A quick caveat: some examples below rely on the DOM and only work in a browser. The broader principle still applies elsewhere: use the platform you actually run on._

## URLs

Let's start with the basics. Dealing with URLs is common when developing web applications, and it's surprisingly hard to get right. This is exactly the kind of thing the browser should do for us.

### Parsing URLs

I think we've all been there before. We need to extract data from a URL, so we put together a little function:

```javascript
// 🚫 Don't do this (keep reading)

const getQueryString = (url) => {
  return url.slice(url.indexOf("?"));
};

console.log(getQueryString("https://example.com/?test=1"));
```

We start testing our code and realize we forgot to handle the case where the query string is missing.

Undeterred, we go back to our function and add a bit of code to handle that case. We do a little more testing and we're confident we nailed it this time.
But a couple of days later, our feature starts to break in production because someone, somewhere, decided to put [a fragment](https://en.wikipedia.org/wiki/URI_fragment) at the end of their URL.

**Parsing URLs is hard**, and doing it by hand is rarely a good idea.

Luckily for us, browsers ship with the [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL) API. With a single line of code, it reliably parses absolute URLs as well as relative URLs when we provide a base:

```javascript
const url = new URL("https://example.com:3000/path?test=1#hash");

console.log(url.protocol);
console.log(url.hostname);
console.log(url.pathname);
console.log(url.search);
console.log(url.hash);
// And many others…
```

The `URL` object also exposes [properties](https://developer.mozilla.org/en-US/docs/Web/API/URL#instance_properties) for the port, username, password, origin, and more.

### Resolving Relative URLs

The `URL` constructor can also resolve a relative URL against a base URL:

```javascript
const toAbsoluteUrl = (base, relativeUrl) => {
  return new URL(relativeUrl, base).toString();
};

const BASE_URL = "https://base-url/path/";

console.log(toAbsoluteUrl(BASE_URL, "/absolute-path"));
console.log(toAbsoluteUrl(BASE_URL, "relative-path"));
console.log(toAbsoluteUrl(BASE_URL, "../relative-path"));
```

### Parsing Query Strings

Browsers can parse query strings too. The [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) API gives us most of what we need for straightforward query parameters.

This example shows how we can extract parameters from a query string:

```javascript
const params = new URLSearchParams("?query=1&test=Hello%20world");

console.log(params.get("query"));
console.log(params.get("test"));
```

When each key appears only once, we can combine `URLSearchParams` with [`Object.fromEntries`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries) to turn a query string into a plain JavaScript object:

```javascript
const parseQueryString = (queryString) => {
  return Object.fromEntries(new URLSearchParams(queryString));
};

console.log(parseQueryString("?query=1&test=Hello%20World"));
```

If a key appears more than once, only its last value survives the conversion. Keep the `URLSearchParams` object and use [`getAll`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/getAll) when repeated values matter.

### Building Query Strings

Great, we can parse query strings. But what about the opposite? What if we have a bunch of values we want to turn into a query string?

I've lost count of the number of times I've seen API calls like the one below (**disclaimer:** I'm guilty of having done this several times).

```javascript
// 🚫 Don't do this (keep reading)

const fetchProducts = ({ brand, inStock, limit }) => {
  return fetch(
    `https://api.example.com/products?brand=${encodeURIComponent(
      brand
    )}&inStock=${inStock}&limit=${limit}`
  );
};

await fetchProducts({
  brand: "Bang & Olufsen",
  inStock: true,
  limit: 10,
});
```

While this works, it has a few problems:

- It's hard to read, especially with Prettier doing its best to keep the line length under control.
- It's fragile. We're one bad keystroke away from messing up our URL.
- We have to manually encode string parameters with `encodeURIComponent`.

I've used the [qs](https://www.npmjs.com/package/qs) package in the past to address these issues. For flat query parameters like these, however, we don't need another package. We can once again rely on `URLSearchParams`.

The result is much easier to read, and URL encoding comes for free:

```javascript
const fetchProducts = ({ brand, inStock, limit }) => {
  return fetch(
    `https://api.example.com/products?${new URLSearchParams({
      brand,
      inStock,
      limit,
    })}`
  );
};

await fetchProducts({
  brand: "Bang & Olufsen",
  inStock: true,
  limit: 10,
});
```

## Strings

Checks such as `value.indexOf(...) !== -1` should mostly be a thing of the past. Modern JavaScript gives us clearer methods such as [`includes`, `startsWith`, and `endsWith`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#instance_methods).

```javascript
const startsWith = "Hello world".startsWith("Hello");
const endsWith = "Hello world".endsWith("world");
const includes = "Hello world".includes("world");

console.log(startsWith, endsWith, includes);
```

### Removing Diacritics

Removing diacritics from a string is definitely not something I want to do by hand. I've previously relied on Lodash's [`deburr`](https://lodash.com/docs/4.17.15#deburr) function, but for many Latin-script strings, Unicode normalization gets us most of the way there:

```javascript
const removeDiacritics = (value) => {
  return value.normalize("NFD").replace(/\p{M}/gu, "");
};

console.log(removeDiacritics("Hétérogénéité"));
```

This is useful, but it isn't general-purpose transliteration and won't cover every writing system.

## HTML

### Escaping Text for HTML

When untrusted content is meant to be text rather than markup, the safest approach is to let the DOM treat it as text. If we're inserting it into an element, we can assign it directly to [`textContent`](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent).

Sometimes, however, we need the escaped string itself. Personally, the farther I can stay away from regular expressions, the better. That is especially true in security-sensitive code. If there's one thing browsers are good at, it's HTML, so we can still let the browser do the work:

```javascript
const escapeHtml = (value) => {
  const element = document.createElement("div");

  element.textContent = value;

  return element.innerHTML;
};

console.log(escapeHtml(`<img src="" onerror="alert('xss')" />`));
```

When `innerHTML` serializes the element's text, characters that could be interpreted as markup are escaped for an HTML text context. Escaping is context-specific, and this is not a sanitizer for HTML we intend to preserve. For that, we need a dedicated HTML sanitizer.

### Extracting Text from HTML

Data gets messy. We might be pulling it from an old API built by someone who thought storing HTML in a database was a good idea.

The [`DOMParser`](https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString) API lets us parse that string into a separate document:

```javascript
const stripHtml = (html) => {
  const document = new DOMParser().parseFromString(html, "text/html");

  return document.body.textContent ?? "";
};

console.log(stripHtml(`<p>This is some text</p>`));
console.log(stripHtml(`<img src="" onerror="alert('xss')" />`));
```

This is coarse text extraction: `textContent` can include text from elements such as `script` and `style`, and it doesn't preserve visual layout. Parsing HTML can also fetch subresources, and it does not make the parsed nodes safe to reinsert into the current document.

I sincerely hope you never have to, but `DOMParser` can also parse XML documents.

## Client-Side Validation

Client-side validation can be a pain, and debates about it often devolve into arguments over the least-wrong regular expression. When possible, I prefer to sit that one out and let the browser validate the input.

### Validating Email Addresses

Browsers don't expose a standalone email parser, but an `<input type="email">` already knows how to apply the HTML email-address syntax. We can reach that behavior through the [Constraint Validation API](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Constraint_validation):

```javascript
const isValidEmailSyntax = (email) => {
  const input = document.createElement("input");

  input.type = "email";
  input.required = true;
  input.value = email;

  return input.checkValidity();
};

console.log(isValidEmailSyntax("test@example.com"));
console.log(isValidEmailSyntax("test@localhost"));
console.log(isValidEmailSyntax("not-an-email"));
```

This checks only whether the value matches the browser's email syntax. The second example passes because that syntax allows local hostnames. It can't tell us whether the address exists, and client-side validation is never a substitute for validating untrusted input on the server.

### Validating URLs

The `URL` constructor turns out to be useful once again. It throws when it can't parse an absolute URL; after parsing, we can separately enforce the protocols we allow:

```javascript
const isAllowedHttpUrl = (url) => {
  try {
    return ["http:", "https:"].includes(new URL(url).protocol);
  } catch {
    return false;
  }
};

console.log(isAllowedHttpUrl(`https://example.com/path/`));
console.log(isAllowedHttpUrl(`wss://example.com/path/`));
console.log(isAllowedHttpUrl(`javascript:alert("XSS")`));
console.log(isAllowedHttpUrl(`not-a-url`));
```

This answers a narrow question: is the value a parseable, absolute HTTP or HTTPS URL? It doesn't tell us whether the URL is reachable or trustworthy.

## Wrapping Up

The point isn't that a built-in API is always the best tool. It's that it deserves to be the first thing we check. Platform APIs have already absorbed years of edge cases, and using them often means less code to ship and maintain.

Check browser support, understand the API's semantics, and add a dependency when it genuinely earns its place.

**Stay safe**
