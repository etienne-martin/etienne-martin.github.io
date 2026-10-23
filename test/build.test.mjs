import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { build, renderMarkdown } from "../scripts/build.mjs";

const rootDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const articlePath = "writing/let-the-browser-do-it-for-you";
const sourceArticleDirectory = path.join(rootDirectory, "content", articlePath);
const outputArticleDirectory = path.join(rootDirectory, "dist", articlePath);

await build({ silent: true });

const [
  source,
  articleSource,
  html,
  articleHtml,
  styles,
  emittedSource,
  emittedArticleSource,
  sourceArticleImage,
  emittedArticleImage,
  favicon,
  distFiles,
  articleDistFiles,
  devSource,
] = await Promise.all([
  readFile(path.join(rootDirectory, "content/index.md"), "utf8"),
  readFile(path.join(sourceArticleDirectory, "index.md"), "utf8"),
  readFile(path.join(rootDirectory, "dist/index.html"), "utf8"),
  readFile(path.join(outputArticleDirectory, "index.html"), "utf8"),
  readFile(path.join(rootDirectory, "dist/styles.css"), "utf8"),
  readFile(path.join(rootDirectory, "dist/index.md"), "utf8"),
  readFile(path.join(outputArticleDirectory, "index.md"), "utf8"),
  readFile(path.join(sourceArticleDirectory, "browser.png")),
  readFile(path.join(outputArticleDirectory, "browser.png")),
  readFile(path.join(rootDirectory, "dist/favicon.svg"), "utf8"),
  readdir(path.join(rootDirectory, "dist")),
  readdir(outputArticleDirectory),
  readFile(path.join(rootDirectory, "scripts/dev.mjs"), "utf8"),
]);

test("builds every page from its Markdown source", () => {
  assert.ok(html.includes(renderMarkdown(source).trimEnd()));
  assert.ok(articleHtml.includes(renderMarkdown(articleSource).trimEnd()));
});

test("adds an automated copyright footer to every page", () => {
  const copyrightYear = new Date().getUTCFullYear();
  const footer = new RegExp(
    `<footer class="site-footer">\\s*<hr>\\s*<p>© ${copyrightYear} Etienne Martin<\\/p>\\s*<\\/footer>`,
  );

  for (const document of [html, articleHtml]) {
    assert.match(document, footer);
    assert.equal(document.match(/<footer class="site-footer">/g)?.length, 1);
  }

  assert.match(
    styles,
    /\.site-footer hr::before\s*{\s*content: "---" \/ "";/,
  );
  assert.match(styles, /\.site-footer\s*{[^}]*font: inherit;/s);
});

test("renders Markdown with semantic HTML", () => {
  const fixture = renderMarkdown(
    "# Name\n\n## Products\n\n*Italic* and **bold**.\n\n- Item\n",
  );

  assert.match(fixture, /<h1>Name<\/h1>/);
  assert.match(fixture, /<h2>Products<\/h2>/);
  assert.match(
    fixture,
    /<em class="md-em" data-marker="\*">Italic<\/em>/,
  );
  assert.match(
    fixture,
    /<strong class="md-strong" data-marker="\*\*">bold<\/strong>/,
  );
  assert.match(fixture, /<ul data-marker="-">\s*<li>/);
});

test("highlights fenced code during the build", () => {
  const fixture = renderMarkdown(
    '```javascript\nconst message = "Hello world";\n```\n',
  );

  assert.match(
    fixture,
    /<code class="hljs language-javascript">/,
  );
  assert.match(fixture, /<span class="hljs-keyword">const<\/span>/);
  assert.match(
    fixture,
    /<span class="hljs-string">&quot;Hello world&quot;<\/span>/,
  );
});

test("safely renders fenced code with an unknown language", () => {
  const fixture = renderMarkdown(
    "```not-a-language\n<script>alert('nope')</script>\n```\n",
  );

  assert.match(fixture, /data-open="```not-a-language"/);
  assert.match(
    fixture,
    /<code>&lt;script&gt;alert\('nope'\)&lt;\/script&gt;\n<\/code>/,
  );
  assert.doesNotMatch(fixture, /class="hljs/);
  assert.doesNotMatch(fixture, /<script>/);
});

test("renders raw-looking external links that open in a new tab", () => {
  const fixture = renderMarkdown(
    "## Products\n\n- [Example](https://example.com/path?q=1&ref=test)\n",
  );

  assert.match(fixture, /<h2>Products<\/h2>/);
  assert.ok(
    fixture.includes(
      '<span class="md-link" data-href="https://example.com/path?q=1&amp;ref=test"><a href="https://example.com/path?q=1&amp;ref=test" target="_blank" rel="noopener noreferrer">Example</a></span>',
    ),
  );
  assert.doesNotMatch(fixture, /<a[^>]*>https:\/\/example\.com/);
  assert.doesNotMatch(fixture, /data-external/);
});

test("keeps internal links in the current tab", () => {
  const fixture = renderMarkdown("[Notes](/notes/)\n");

  assert.match(
    fixture,
    /<span class="md-link" data-href="\/notes\/"><a href="\/notes\/">Notes<\/a><\/span>/,
  );
  assert.doesNotMatch(fixture, /target="_blank"/);
});

test("renders Markdown images as semantic images", () => {
  const fixture = renderMarkdown("![Diagram](./diagram.png)\n");

  assert.match(
    fixture,
    /<span class="md-image" data-alt="Diagram" data-src="\.\/diagram\.png"><img src="\.\/diagram\.png" alt="Diagram"><\/span>/,
  );
});

test("preserves authored unordered and ordered list markers", () => {
  const fixture = renderMarkdown("+ Plus\n\n3) Three\n4) Four\n");

  assert.match(fixture, /<ul data-marker="\+">/);
  assert.match(
    fixture,
    /<ol start="3" data-delimiter="\)" style="--markdown-list-start: 2">/,
  );
});

test("styles semantic elements as raw Markdown", () => {
  const htmlRule = styles.match(/html\s*{[^}]*}/s)?.[0];
  const codeFontRule = styles.match(
    /\.md-inline-code,\s*\.md-code-block,\s*\.md-code-block code\s*{[^}]*}/s,
  )?.[0];
  const codeBlockRule = styles.match(/\.md-code-block\s*{[^}]*}/s)?.[0];
  const codeContentRule = [
    ...styles.matchAll(/\.md-code-block code\s*{[^}]*}/gs),
  ]
    .map(([rule]) => rule)
    .find((rule) => rule.includes("width: max-content"));
  const bodyRule = styles.match(/body\s*{[^}]*}/s)?.[0];
  const contentRule = styles.match(
    /article > :not\(\.md-code-block\)\s*{[^}]*}/s,
  )?.[0];

  assert.ok(htmlRule);
  assert.ok(codeFontRule);
  assert.ok(codeBlockRule);
  assert.ok(codeContentRule);
  assert.ok(bodyRule);
  assert.ok(contentRule);
  assert.match(styles, /h2::before\s*{\s*content: "## " \/ "";/);
  assert.match(styles, /ul > li::before\s*{[^}]*content: "- " \/ "";/s);
  assert.match(
    styles,
    /\.md-link::after\s*{\s*content: "\]\(" attr\(data-href\) "\)" \/ "";/,
  );
  assert.match(
    styles,
    /\.md-image::before\s*{[^}]*content: "!\[" attr\(data-alt\) "\]\(" attr\(data-src\) "\)" \/ "";/s,
  );
  assert.match(styles, /user-select: none;/);
  assert.match(
    styles,
    /\.md-link,[\s\S]*\.md-autolink\s*{\s*overflow-wrap: anywhere;/,
  );
  assert.match(styles, /h1,[\s\S]*font: inherit;[\s\S]*font-weight: 700;/);
  assert.match(styles, /h1,[\s\S]*text-transform: uppercase;/);
  assert.match(
    styles,
    /a\s*{[^}]*font-weight: 600;[^}]*text-decoration: none;/s,
  );
  assert.match(styles, /--page-gutter: 40px;/);
  assert.match(styles, /--content-width: 560px;/);
  assert.match(htmlRule, /(?:^|\n)\s*-webkit-text-size-adjust:\s*100%;/);
  assert.match(htmlRule, /(?:^|\n)\s*text-size-adjust:\s*100%;/);
  assert.match(codeFontRule, /font:\s*inherit;/);
  assert.match(bodyRule, /padding-block: var\(--page-gutter\);/);
  assert.match(bodyRule, /padding-inline: 0;/);
  assert.match(contentRule, /var\(--content-width\)/);
  assert.match(contentRule, /margin-inline-start: var\(--page-gutter\);/);
  assert.match(codeBlockRule, /width: 100%;/);
  assert.match(codeBlockRule, /margin-inline: 0;/);
  assert.match(codeBlockRule, /padding-block: 0;/);
  assert.match(
    codeBlockRule,
    /padding-inline-start: var\(--page-gutter\);/,
  );
  assert.match(codeBlockRule, /padding-inline-end: 0;/);
  assert.match(codeContentRule, /display: block;/);
  assert.match(codeContentRule, /box-sizing: content-box;/);
  assert.match(codeContentRule, /width: max-content;/);
  assert.match(
    codeContentRule,
    /min-width: calc\(100% - var\(--page-gutter\)\);/,
  );
  assert.match(
    codeContentRule,
    /padding-inline-end: var\(--page-gutter\);/,
  );
  assert.match(codeContentRule, /color: var\(--syntax-default\);/);
  assert.match(codeBlockRule, /border-radius: 0;/);
  assert.doesNotMatch(codeBlockRule, /background(?:-color)?\s*:/);
  assert.doesNotMatch(codeContentRule, /background(?:-color)?\s*:/);
  assert.doesNotMatch(styles, /--code-background:/);
  assert.match(codeBlockRule, /white-space: pre;/);
  assert.match(codeBlockRule, /overflow-x: auto;/);
  assert.match(codeBlockRule, /overflow-wrap: normal;/);
  assert.doesNotMatch(codeBlockRule, /pre-wrap|anywhere/);
  assert.match(styles, /--syntax-default: #c9d1d9;/);
  assert.match(styles, /--syntax-keyword: #ff7b72;/);
  assert.match(styles, /--syntax-title: #d2a8ff;/);
  assert.match(styles, /--syntax-constant: #79c0ff;/);
  assert.match(styles, /--syntax-string: #a5d6ff;/);
  assert.match(styles, /--syntax-built-in: #ffa657;/);
  assert.match(
    styles,
    /\.hljs-keyword,[^}]*color: var\(--syntax-keyword\);/s,
  );
  assert.match(
    styles,
    /\.hljs-title,[^}]*color: var\(--syntax-title\);/s,
  );
  assert.match(
    styles,
    /\.hljs-name,[^}]*color: var\(--syntax-tag\);/s,
  );
  assert.doesNotMatch(
    styles,
    /\.hljs\s*{[^}]*background(?:-color)?\s*:/s,
  );
  assert.match(
    styles,
    /@media \(max-width: 600px\)\s*{\s*:root\s*{\s*--page-gutter: 24px;/s,
  );
});

test("emits exact Markdown sources and colocated assets", () => {
  assert.equal(emittedSource, source);
  assert.equal(emittedArticleSource, articleSource);
  assert.deepEqual(emittedArticleImage, sourceArticleImage);
  assert.deepEqual(articleDistFiles.sort(), [
    "browser.png",
    "index.html",
    "index.md",
  ]);
});

test("ships one minimal favicon", () => {
  assert.match(
    html,
    /<link rel="icon" href="\/favicon\.svg" type="image\/svg\+xml">/,
  );
  assert.match(favicon, /<svg[^>]*viewBox="0 0 64 64"/);
  assert.match(favicon, /<path[\s\S]*fill="#e9e9eb"/);
  assert.doesNotMatch(favicon, /<text\b|stroke=/i);
  assert.doesNotMatch(favicon, /#f3ef6d/i);
  assert.deepEqual(
    distFiles.filter((file) => /favicon|apple-touch|icon-\d/i.test(file)),
    ["favicon.svg"],
  );
});

test("ships no client-side JavaScript", () => {
  assert.doesNotMatch(html, /<script\b/i);
  assert.doesNotMatch(articleHtml, /<script\b/i);
  assert.equal(
    [...distFiles, ...articleDistFiles].some((file) => file.endsWith(".js")),
    false,
  );
  assert.doesNotMatch(devSource, /EventSource|__reload|<script\b/i);
});

test("builds the homepage Writing section and internal article link", () => {
  assert.match(html, /<title>Etienne Martin<\/title>/);
  assert.match(
    html,
    /<meta name="description" content="Software engineer and architect focused on distributed systems, based in Lisbon, Portugal\.">/,
  );
  assert.match(
    html,
    /<link rel="canonical" href="https:\/\/etiennemartin\.ca\/">/,
  );
  assert.match(html, /<h2>Writing<\/h2>/);
  assert.match(
    html,
    /<a href="\/writing\/let-the-browser-do-it-for-you\/">Let the Browser Do It for You<\/a>/,
  );
  assert.doesNotMatch(
    html,
    /href="\/writing\/let-the-browser-do-it-for-you\/"[^>]*target="_blank"/,
  );
  assert.match(html, /<h2>Links<\/h2>/);
  assert.match(html, /href="https:\/\/x\.com\/_etiennemartin"/);
  assert.doesNotMatch(html, /github\.com\/sudden-network|Sudden’s GitHub/);
  assert.doesNotMatch(html, /Thinking out Loud/);
});

test("builds the article at its folder-derived route", () => {
  assert.match(
    articleHtml,
    /<title>Let the Browser Do It for You — Etienne Martin<\/title>/,
  );
  assert.match(articleHtml, /<meta property="og:type" content="article">/);
  assert.match(
    articleHtml,
    /<link rel="canonical" href="https:\/\/etiennemartin\.ca\/writing\/let-the-browser-do-it-for-you\/">/,
  );
  assert.match(
    articleHtml,
    /<meta property="og:url" content="https:\/\/etiennemartin\.ca\/writing\/let-the-browser-do-it-for-you\/">/,
  );
  assert.match(articleHtml, /<h1>Let the Browser Do It for You<\/h1>/);
  assert.match(articleHtml, /<img src="\.\/browser\.png" alt="A little browser lifting weights">/);
  assert.match(articleHtml, /<h2>URLs<\/h2>/);
  assert.match(articleHtml, /data-open="```javascript"/);
  assert.doesNotMatch(articleSource, /export const metadata|require\(/);
});

test("keeps the article text free of em dashes", () => {
  const emDash = /—|&mdash;|&#8212;|&#x2014;/i;

  assert.doesNotMatch(articleSource, emDash);
  assert.doesNotMatch(renderMarkdown(articleSource), emDash);
});

test("the development server watches content and serves directory routes", () => {
  assert.match(devSource, /path\.join\(rootDirectory, "content"\)/);
  assert.match(devSource, /fileStats\.isDirectory\(\)/);
  assert.match(devSource, /Location: `\$\{pathname\}\//);
  assert.match(devSource, /\["\.png", "image\/png"\]/);
});
