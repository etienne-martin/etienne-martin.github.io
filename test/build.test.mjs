import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  build,
  createPageAssetResolver,
  getFingerprintedFilename,
  renderMarkdown,
  validateAssetOutputPaths,
} from "../scripts/build.mjs";

const rootDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const articlePath = "writing/let-the-browser-do-it-for-you";
const sourceArticleDirectory = path.join(rootDirectory, "content", articlePath);
const outputArticleDirectory = path.join(rootDirectory, "dist", articlePath);

await build({ silent: true });

const [distFiles, articleDistFiles] = await Promise.all([
  readdir(path.join(rootDirectory, "dist")),
  readdir(outputArticleDirectory),
]);
const stylesheetFilename = distFiles.find((file) =>
  /^styles\.[a-f0-9]{12}\.css$/u.test(file),
);
const faviconFilename = distFiles.find((file) =>
  /^favicon\.[a-f0-9]{12}\.svg$/u.test(file),
);
const fingerprintedArticleImageFilename = articleDistFiles.find((file) =>
  /^browser\.[a-f0-9]{12}\.png$/u.test(file),
);

assert.ok(stylesheetFilename);
assert.ok(faviconFilename);
assert.ok(fingerprintedArticleImageFilename);

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
  emittedFingerprintedArticleImage,
  favicon,
  devSource,
] = await Promise.all([
  readFile(path.join(rootDirectory, "content/index.md"), "utf8"),
  readFile(path.join(sourceArticleDirectory, "index.md"), "utf8"),
  readFile(path.join(rootDirectory, "dist/index.html"), "utf8"),
  readFile(path.join(outputArticleDirectory, "index.html"), "utf8"),
  readFile(path.join(rootDirectory, "dist", stylesheetFilename), "utf8"),
  readFile(path.join(rootDirectory, "dist/index.md"), "utf8"),
  readFile(path.join(outputArticleDirectory, "index.md"), "utf8"),
  readFile(path.join(sourceArticleDirectory, "browser.png")),
  readFile(path.join(outputArticleDirectory, "browser.png")),
  readFile(
    path.join(outputArticleDirectory, fingerprintedArticleImageFilename),
  ),
  readFile(path.join(rootDirectory, "dist", faviconFilename), "utf8"),
  readFile(path.join(rootDirectory, "scripts/dev.mjs"), "utf8"),
]);

test("builds every page from its Markdown source", () => {
  assert.ok(html.includes(renderMarkdown(source).trimEnd()));
  assert.ok(
    articleHtml.includes(
      renderMarkdown(articleSource, {
        resolveAssetUrl: (url) =>
          url === "./browser.png"
            ? `./${fingerprintedArticleImageFilename}`
            : url,
      }).trimEnd(),
    ),
  );
});

test("adds an automated copyright footer to every page", () => {
  const copyrightYear = new Date().getUTCFullYear();
  const footer = new RegExp(
    `<footer class="site-footer">\\s*<hr>\\s*<br>\\s*<p>© ${copyrightYear} Etienne Martin<\\/p>\\s*<\\/footer>`,
  );

  for (const document of [html, articleHtml]) {
    assert.match(document, footer);
    assert.equal(document.match(/<footer class="site-footer">/g)?.length, 1);
  }

  assert.match(
    styles,
    /\.site-footer hr::before\s*{\s*content: "---" \/ "";/,
  );
  assert.match(styles, /\.site-footer hr\s*{[^}]*border: 0;/s);
  assert.match(styles, /\.site-footer\s*{[^}]*font: inherit;/s);
});

test("fingerprints generated assets from their contents", () => {
  assert.equal(
    stylesheetFilename,
    getFingerprintedFilename("styles.css", styles),
  );
  assert.equal(
    faviconFilename,
    getFingerprintedFilename("favicon.svg", favicon),
  );
  assert.equal(
    fingerprintedArticleImageFilename,
    getFingerprintedFilename("browser.png", sourceArticleImage),
  );
  assert.notEqual(
    getFingerprintedFilename("styles.css", `${styles}\n`),
    stylesheetFilename,
  );

  for (const document of [html, articleHtml]) {
    assert.ok(
      document.includes(
        `<link rel="stylesheet" href="/${stylesheetFilename}">`,
      ),
    );
    assert.ok(
      document.includes(
        `<link rel="icon" href="/${faviconFilename}" type="image/svg+xml">`,
      ),
    );
    assert.doesNotMatch(document, /href="\/(?:styles\.css|favicon\.svg)"/);
    assert.doesNotMatch(document, /styles\.css\?v=/);
  }

  assert.match(
    articleHtml,
    new RegExp(
      `<span class="md-image" data-alt="A little browser lifting weights" data-src="\\./browser\\.png"><br><img src="\\./${fingerprintedArticleImageFilename.replaceAll(".", "\\.")}"`,
    ),
  );
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
  assert.equal(fixture.match(/<br>/g)?.length, 4);
});

test("collapses authored blank lines into one top-level break", () => {
  const fixture = renderMarkdown(
    "# Title\n\n\n\n\nFirst paragraph.\n\n\n\n\nSecond paragraph.\n## Adjacent heading\n\n\n\n\n- One\n- Two\n\n\n\n\n---\n\n\n\n\nAfter.\n",
  );
  const compactFixture = renderMarkdown(
    "# Title\n\nFirst paragraph.\n\nSecond paragraph.\n## Adjacent heading\n\n- One\n- Two\n\n---\n\nAfter.\n",
  );

  assert.equal(fixture, compactFixture);
  assert.equal(
    renderMarkdown("   Trim me   \n"),
    "<p>Trim me</p>\n<br>\n",
  );
  assert.equal(fixture.match(/(?:^|\n)<br>\n/g)?.length, 7);
  assert.match(
    fixture,
    /<h1>Title<\/h1>\s*<br>\s*<p>First paragraph\.<\/p>/,
  );
  assert.match(
    fixture,
    /<p>First paragraph\.<\/p>\s*<br>\s*<p>Second paragraph\.<\/p>/,
  );
  assert.match(
    fixture,
    /<p>Second paragraph\.<\/p>\s*<br>\s*<h2>Adjacent heading<\/h2>/,
  );
  assert.doesNotMatch(
    fixture,
    /<li>One<\/li>\s*<br>\s*<li>Two<\/li>/,
  );
  assert.match(
    fixture,
    /<\/ul>\s*<br>\s*<hr>\s*<br>\s*<p>After\.<\/p>\s*<br>\s*$/,
  );
  assert.match(
    renderMarkdown("- Final item\n"),
    /<li>Final item<\/li>\s*<\/ul>\s*<br>\s*$/,
  );
});

test("keeps list items semantic without custom breaks", () => {
  const unordered = renderMarkdown("- One\n- Two\n- Three\n");
  const ordered = renderMarkdown("1. One\n2. Two\n3. Three\n");

  assert.match(unordered, /<li>One<\/li>\s*<li>Two<\/li>\s*<li>Three<\/li>/);
  assert.match(ordered, /<li>One<\/li>\s*<li>Two<\/li>\s*<li>Three<\/li>/);

  for (const rendered of [unordered, ordered]) {
    assert.doesNotMatch(rendered, /<li>[^<]*<br>/);
    assert.match(rendered, /<\/li>\s+<li>/);
  }
});

test("adds exactly one real break after every top-level block", () => {
  const blockquote = renderMarkdown("> Quoted paragraph.\n\nAfter.\n");
  const looseList = renderMarkdown(
    "- First paragraph.\n\n  Second paragraph.\n\nAfter.\n",
  );
  const tightList = renderMarkdown("- First item\n- Second item\n\nAfter.\n");

  assert.match(
    blockquote,
    /<\/blockquote>\s*<br>\s*<p>After\.<\/p>\s*<br>\s*$/,
  );
  assert.match(
    looseList,
    /<\/ul>\s*<br>\s*<p>After\.<\/p>\s*<br>\s*$/,
  );
  assert.match(
    tightList,
    /<\/ul>\s*<br>\s*<p>After\.<\/p>\s*<br>\s*$/,
  );

  for (const rendered of [blockquote, looseList, tightList]) {
    assert.equal(rendered.match(/(?:^|\n)<br>\n/g)?.length, 2);
  }
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
      '<a class="md-link" data-href="https://example.com/path?q=1&amp;ref=test" href="https://example.com/path?q=1&amp;ref=test" target="_blank" rel="noopener noreferrer"><span class="md-link-label">Example</span></a>',
    ),
  );
  assert.doesNotMatch(fixture, /<a[^>]*>https:\/\/example\.com/);
  assert.doesNotMatch(fixture, /<span class="md-link"/);
  assert.doesNotMatch(fixture, /data-external/);
});

test("keeps internal links in the current tab", () => {
  const fixture = renderMarkdown("[Notes](/notes/)\n");

  assert.match(
    fixture,
    /<a class="md-link" data-href="\/notes\/" href="\/notes\/"><span class="md-link-label">Notes<\/span><\/a>/,
  );
  assert.doesNotMatch(fixture, /target="_blank"/);
});

test("makes autolink syntax part of the link target", () => {
  const webFixture = renderMarkdown("<https://example.com/path>\n");
  const emailFixture = renderMarkdown("<hello@example.com>\n");

  assert.match(
    webFixture,
    /<a class="md-autolink" href="https:\/\/example\.com\/path" target="_blank" rel="noopener noreferrer"><span class="md-link-label">https:\/\/example\.com\/path<\/span><\/a>/,
  );
  assert.doesNotMatch(webFixture, /<span class="md-autolink"/);
  assert.match(
    emailFixture,
    /<a class="md-autolink" href="mailto:hello@example\.com"><span class="md-link-label">hello@example\.com<\/span><\/a>/,
  );
  assert.doesNotMatch(emailFixture, /target="_blank"/);
});

test("keeps link titles on the full link target", () => {
  const fixture = renderMarkdown('[Notes](/notes/ "Read more")\n');

  assert.match(
    fixture,
    /<a class="md-link" data-href="\/notes\/" data-title="Read more" href="\/notes\/" title="Read more"><span class="md-link-label">Notes<\/span><\/a>/,
  );
});

test("renders Markdown images as semantic images", () => {
  const fixture = renderMarkdown("![Diagram](./diagram.png)\n");

  assert.match(
    fixture,
    /<span class="md-image" data-alt="Diagram" data-src="\.\/diagram\.png"><br><img src="\.\/diagram\.png" alt="Diagram"><\/span>/,
  );
  assert.match(fixture, /<\/span><\/p>\s*<br>\s*$/);
});

test("resolves asset URLs without changing their Markdown decoration", () => {
  const fixture = renderMarkdown(
    "[![Diagram](./diagram.png)](./diagram.pdf)\n",
    {
      resolveAssetUrl: (url) =>
        ({
          "./diagram.pdf": "./diagram.222222222222.pdf",
          "./diagram.png": "./diagram.111111111111.png",
        })[url] ?? url,
    },
  );

  assert.ok(
    fixture.includes(
      '<a class="md-link" data-href="./diagram.pdf" href="./diagram.222222222222.pdf"><span class="md-link-label"><span class="md-image" data-alt="Diagram" data-src="./diagram.png"><br><img src="./diagram.111111111111.png" alt="Diagram"></span></span></a>',
    ),
  );
});

test("fingerprints root-relative content asset URLs", () => {
  const assetSourcePath = path.join(sourceArticleDirectory, "browser.png");
  const resolver = createPageAssetResolver(
    { sourcePath: path.join(sourceArticleDirectory, "index.md") },
    new Map([
      [
        assetSourcePath,
        {
          fingerprintedRelativePath: path.join(
            articlePath,
            fingerprintedArticleImageFilename,
          ),
          sourcePath: assetSourcePath,
        },
      ],
    ]),
  );
  const authoredUrl = `/${articlePath}/browser.png?download=1#preview`;
  const resolvedUrl = `/${articlePath}/${fingerprintedArticleImageFilename}?download=1#preview`;
  const fixture = renderMarkdown(`![Diagram](${authoredUrl})\n`, {
    resolveAssetUrl: resolver,
  });

  assert.equal(resolver(authoredUrl), resolvedUrl);
  assert.ok(
    fixture.includes(
      `<span class="md-image" data-alt="Diagram" data-src="${authoredUrl}"><br><img src="${resolvedUrl}" alt="Diagram"></span>`,
    ),
  );
});

test("rejects content assets that collide with reserved build outputs", () => {
  const asset = {
    fingerprintedRelativePath: path.join(
      articlePath,
      "demo.111111111111.html",
    ),
    relativePath: path.join(articlePath, "index.html"),
    sourcePath: path.join(sourceArticleDirectory, "index.html"),
  };
  const generatedPage = {
    relativePath: path.join(articlePath, "index.html"),
    sourcePath: `rendered HTML from ${path.join(sourceArticleDirectory, "index.md")}`,
  };

  assert.throws(
    () => validateAssetOutputPaths([asset], [generatedPage]),
    /Build output collision at .*index\.html/u,
  );

  assert.throws(
    () =>
      validateAssetOutputPaths(
        [
          {
            ...asset,
            relativePath: stylesheetFilename,
          },
        ],
        [
          {
            relativePath: stylesheetFilename,
            sourcePath: path.join(rootDirectory, "src/styles.css"),
          },
        ],
      ),
    /Build output collision at styles\.[a-f0-9]{12}\.css/u,
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
  const mainRule = styles.match(/^main\s*{[^}]*}/ms)?.[0];
  const headingRule = styles.match(/h1,[\s\S]*?h6\s*{[^}]*}/s)?.[0];
  const blockSpacingRule = styles.match(
    /p,\s*ul,\s*ol,\s*blockquote,\s*pre,\s*hr\s*{[^}]*}/s,
  )?.[0];
  const listItemRule = styles.match(/^li\s*{[^}]*}/ms)?.[0];
  const imageRule = styles.match(/\.md-image img\s*{[^}]*}/s)?.[0];
  const footerRule = styles.match(
    /^\.site-footer\s*{[^}]*}/ms,
  )?.[0];
  const footerParagraphRule = styles.match(/\.site-footer p\s*{[^}]*}/s)?.[0];

  assert.ok(htmlRule);
  assert.ok(codeFontRule);
  assert.ok(codeBlockRule);
  assert.ok(codeContentRule);
  assert.ok(bodyRule);
  assert.ok(mainRule);
  assert.ok(headingRule);
  assert.ok(blockSpacingRule);
  assert.ok(listItemRule);
  assert.ok(imageRule);
  assert.ok(footerRule);
  assert.ok(footerParagraphRule);
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
    /\.md-link,[\s\S]*\.md-autolink\s*{\s*font-weight: 400;\s*overflow-wrap: anywhere;/,
  );
  assert.match(
    styles,
    /\.md-link:is\(:hover, :focus-visible\) > \.md-link-label,[\s\S]*\.md-autolink:is\(:hover, :focus-visible\) > \.md-link-label\s*{[^}]*text-decoration: underline;[^}]*text-decoration-color: var\(--muted\);/s,
  );
  assert.match(
    styles,
    /\.md-link::before,[\s\S]*\.md-autolink::after\s*{\s*cursor: pointer;/,
  );
  assert.match(styles, /h1,[\s\S]*font: inherit;[\s\S]*font-weight: 700;/);
  assert.match(styles, /h1,[\s\S]*text-transform: uppercase;/);
  assert.match(styles, /\.md-link-label\s*{\s*font-weight: 600;/);
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
  assert.match(bodyRule, /padding-inline: var\(--page-gutter\);/);
  assert.match(mainRule, /width: 100%;/);
  assert.match(mainRule, /max-width: var\(--content-width\);/);
  assert.doesNotMatch(styles, /article\s*>/);
  assert.match(headingRule, /margin: 0;/);
  assert.doesNotMatch(headingRule, /padding-(?:top|block)/);
  assert.match(blockSpacingRule, /margin: 0;/);
  assert.doesNotMatch(listItemRule, /display:/);
  assert.doesNotMatch(listItemRule, /vertical-align:/);
  assert.match(imageRule, /margin: 0;/);
  assert.match(codeBlockRule, /width: 100vw;/);
  assert.match(codeBlockRule, /margin-block: 0;/);
  assert.match(
    codeBlockRule,
    /margin-inline-start: calc\(0px - var\(--page-gutter\)\);/,
  );
  assert.match(codeBlockRule, /margin-inline-end: 0;/);
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
  assert.doesNotMatch(
    footerRule,
    /padding-(?:block|top|bottom)/,
  );
  assert.match(footerRule, /margin-block: 0;/);
  assert.match(footerParagraphRule, /margin: 0;/);
  assert.match(styles, /\.site-footer hr\s*{[^}]*margin: 0;/s);
  assert.doesNotMatch(styles, /margin-(?:top|bottom):\s*20px;/);
  assert.doesNotMatch(styles, /padding-top:\s*20px;/);
});

test("owns the page gutter at the layout level", () => {
  const fixture = renderMarkdown(
    "| Column | Value |\n| --- | --- |\n| Table | Cell |\n\n> Quote\n",
  );
  const pageGutterSelectors = [
    ...styles.matchAll(
      /([^{}]+)\{([^{}]*var\(--page-gutter\)[^{}]*)\}/g,
    ),
  ].map(([, selector]) => selector.trim());

  assert.match(fixture, /<table>/);
  assert.match(fixture, /<blockquote>/);
  assert.deepEqual(pageGutterSelectors, [
    "body",
    ".md-code-block",
    ".md-code-block code",
  ]);
  assert.equal(styles.match(/width:\s*100vw;/g)?.length, 1);
  assert.equal(
    styles.match(
      /margin-inline-start:\s*calc\(0px - var\(--page-gutter\)\);/g,
    )?.length,
    1,
  );
  assert.doesNotMatch(styles, /article\s*>/);
});

test("emits exact Markdown sources and colocated assets", () => {
  assert.equal(emittedSource, source);
  assert.equal(emittedArticleSource, articleSource);
  assert.deepEqual(emittedArticleImage, sourceArticleImage);
  assert.deepEqual(emittedFingerprintedArticleImage, sourceArticleImage);
  assert.deepEqual(articleDistFiles.sort(), [
    fingerprintedArticleImageFilename,
    "browser.png",
    "index.html",
    "index.md",
  ].sort());
});

test("ships one minimal favicon", () => {
  assert.match(
    html,
    new RegExp(
      `<link rel="icon" href="/${faviconFilename.replaceAll(".", "\\.")}" type="image/svg\\+xml">`,
    ),
  );
  assert.match(favicon, /<svg[^>]*viewBox="0 0 64 64"/);
  assert.match(favicon, /<path[\s\S]*fill="#e9e9eb"/);
  assert.doesNotMatch(favicon, /<text\b|stroke=/i);
  assert.doesNotMatch(favicon, /#f3ef6d/i);
  assert.deepEqual(
    distFiles.filter((file) => /favicon|apple-touch|icon-\d/i.test(file)),
    [faviconFilename],
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
    /<a class="md-link" data-href="\/writing\/let-the-browser-do-it-for-you\/" href="\/writing\/let-the-browser-do-it-for-you\/"><span class="md-link-label">Let the Browser Do It for You<\/span><\/a>/,
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
  assert.match(
    articleHtml,
    new RegExp(
      `<img src="\\./${fingerprintedArticleImageFilename.replaceAll(".", "\\.")}" alt="A little browser lifting weights">`,
    ),
  );
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
