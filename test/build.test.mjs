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

await build({ silent: true });

const [source, html, styles, emittedSource, favicon, distFiles, devSource] =
  await Promise.all([
  readFile(path.join(rootDirectory, "content.md"), "utf8"),
  readFile(path.join(rootDirectory, "dist/index.html"), "utf8"),
  readFile(path.join(rootDirectory, "dist/styles.css"), "utf8"),
  readFile(path.join(rootDirectory, "dist/index.md"), "utf8"),
  readFile(path.join(rootDirectory, "dist/favicon.svg"), "utf8"),
  readdir(path.join(rootDirectory, "dist")),
  readFile(path.join(rootDirectory, "scripts/dev.mjs"), "utf8"),
  ]);

test("builds the production page from the current Markdown source", () => {
  assert.ok(html.includes(renderMarkdown(source).trimEnd()));
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
  const fixture = renderMarkdown("[Notes](/notes)\n");

  assert.match(
    fixture,
    /<span class="md-link" data-href="\/notes"><a href="\/notes">Notes<\/a><\/span>/,
  );
  assert.doesNotMatch(fixture, /target="_blank"/);
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
  assert.match(styles, /h2::before\s*{\s*content: "## " \/ "";/);
  assert.match(styles, /ul > li::before\s*{[^}]*content: "- " \/ "";/s);
  assert.match(
    styles,
    /\.md-link::after\s*{\s*content: "\]\(" attr\(data-href\) "\)" \/ "";/,
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
});

test("emits the exact Markdown source as a standalone file", () => {
  assert.equal(emittedSource, source);
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
  assert.equal(
    distFiles.some((file) => file.endsWith(".js")),
    false,
  );
  assert.doesNotMatch(devSource, /EventSource|__reload|<script\b/i);
});

test("uses only the new metadata and content", () => {
  assert.match(html, /<title>Etienne Martin<\/title>/);
  assert.match(
    html,
    /<meta name="description" content="Software engineer and architect focused on distributed systems, based in Lisbon, Portugal\.">/,
  );
  assert.match(
    html,
    /<link rel="canonical" href="https:\/\/etiennemartin\.ca\/">/,
  );
  assert.match(
    html,
    /<meta property="og:url" content="https:\/\/etiennemartin\.ca\/">/,
  );
  assert.doesNotMatch(html, /property="og:image"/);
  assert.match(html, /based in Lisbon, Portugal/);
  assert.match(
    html,
    /software engineer and architect based in Lisbon, Portugal/,
  );
  assert.match(
    html,
    /build distributed systems for large-scale video delivery/,
  );
  assert.match(
    html,
    /worked in technology since 2007, starting out with a mix of creative and technical work/,
  );
  assert.match(
    html,
    /<a href="https:\/\/sudden\.network\/" target="_blank" rel="noopener noreferrer">Sudden Technologies<\/a>/,
  );
  assert.match(html, /https:\/\/sudden\.network\//);
  assert.doesNotMatch(html, /https:\/\/www\.sudden\.network\//);
  assert.match(html, /Sudden’s GitHub/);
  assert.match(html, /<h2>Links<\/h2>/);
  assert.doesNotMatch(html, /<h2>Elsewhere<\/h2>/);
  assert.match(html, /href="https:\/\/x\.com\/_etiennemartin"/);
  assert.match(html, />X<\/a>/);
  assert.doesNotMatch(html, /Thinking out Loud|let-the-browser-do-it-for-you/i);
});
