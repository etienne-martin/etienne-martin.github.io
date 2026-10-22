import { readFile, rm, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import MarkdownIt from "markdown-it";

const scriptPath = fileURLToPath(import.meta.url);
const rootDirectory = path.resolve(path.dirname(scriptPath), "..");
const outputDirectory = path.join(rootDirectory, "dist");

const markdown = new MarkdownIt({
  html: false,
  linkify: false,
  typographer: false,
});

function escapeAttribute(value) {
  return markdown.utils.escapeHtml(String(value));
}

function findClosingToken(tokens, openingIndex, openingType, closingType) {
  let depth = 0;

  for (let index = openingIndex; index < tokens.length; index += 1) {
    if (tokens[index].type === openingType) {
      depth += 1;
    } else if (tokens[index].type === closingType) {
      depth -= 1;

      if (depth === 0) {
        return index;
      }
    }
  }

  return -1;
}

function inlineText(tokens) {
  return tokens
    .map((token) => {
      if (token.type === "text" || token.type === "code_inline") {
        return token.content;
      }

      if (token.type === "image") {
        return token.content;
      }

      if (token.type === "softbreak" || token.type === "hardbreak") {
        return " ";
      }

      return "";
    })
    .join("");
}

function isExternalHref(href) {
  return /^(?:https?:)?\/\//i.test(href);
}

function renderLink(tokens, openingIndex) {
  const openingToken = tokens[openingIndex];
  const closingIndex = findClosingToken(
    tokens,
    openingIndex,
    "link_open",
    "link_close",
  );

  if (closingIndex === -1) {
    return { html: "", closingIndex: openingIndex };
  }

  const href = openingToken.attrGet("href") ?? "";
  const labelTokens = tokens.slice(openingIndex + 1, closingIndex);
  const label = inlineText(labelTokens) || href;
  const labelHtml = renderInline(labelTokens);
  const escapedHref = escapeAttribute(href);
  const title = openingToken.attrGet("title");
  const titleAttribute = title
    ? ` title="${escapeAttribute(title)}"`
    : "";
  const titleDataAttribute = title
    ? ` data-title="${escapeAttribute(title)}"`
    : "";
  const external = isExternalHref(href);
  const externalLinkAttributes = external
    ? ' target="_blank" rel="noopener noreferrer"'
    : "";

  if (openingToken.markup === "autolink") {
    const visibleHref = href.startsWith("mailto:") ? label : href;

    return {
      html: `<span class="md-autolink"><a href="${escapedHref}"${titleAttribute}${externalLinkAttributes}>${markdown.utils.escapeHtml(visibleHref)}</a></span>`,
      closingIndex,
    };
  }

  return {
    html: `<span class="md-link" data-href="${escapedHref}"${titleDataAttribute}><a href="${escapedHref}"${titleAttribute}${externalLinkAttributes}>${labelHtml}</a></span>`,
    closingIndex,
  };
}

function renderInline(tokens) {
  let output = "";

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];

    switch (token.type) {
      case "text":
        output += markdown.utils.escapeHtml(token.content);
        break;
      case "softbreak":
        output += "\n";
        break;
      case "hardbreak":
        output += "<br>\n";
        break;
      case "em_open":
        output += `<em class="md-em" data-marker="${escapeAttribute(token.markup || "*")}">`;
        break;
      case "em_close":
        output += "</em>";
        break;
      case "strong_open":
        output += `<strong class="md-strong" data-marker="${escapeAttribute(token.markup || "**")}">`;
        break;
      case "strong_close":
        output += "</strong>";
        break;
      case "s_open":
        output += `<s class="md-strike" data-marker="${escapeAttribute(token.markup || "~~")}">`;
        break;
      case "s_close":
        output += "</s>";
        break;
      case "code_inline":
        output += `<code class="md-inline-code" data-marker="${escapeAttribute(token.markup || "`")}">${markdown.utils.escapeHtml(token.content)}</code>`;
        break;
      case "link_open": {
        const renderedLink = renderLink(tokens, index);
        output += renderedLink.html;
        index = renderedLink.closingIndex;
        break;
      }
      case "image": {
        const source = token.attrGet("src") ?? "";
        const alt = token.content || source;
        const altHtml = renderInline(token.children ?? []);
        const title = token.attrGet("title");
        const titleAttribute = title
          ? ` title="${escapeAttribute(title)}"`
          : "";
        const titleDataAttribute = title
          ? ` data-title="${escapeAttribute(title)}"`
          : "";
        const escapedSource = escapeAttribute(source);
        const external = isExternalHref(source);
        const externalLinkAttributes = external
          ? ' target="_blank" rel="noopener noreferrer"'
          : "";
        output += `<span class="md-image-link" data-href="${escapedSource}"${titleDataAttribute}><a href="${escapedSource}"${titleAttribute}${externalLinkAttributes}>${altHtml || markdown.utils.escapeHtml(alt)}</a></span>`;
        break;
      }
      default:
        output += markdown.utils.escapeHtml(token.content || "");
    }
  }

  return output;
}

markdown.renderer.renderInline = (tokens) => renderInline(tokens);

markdown.renderer.rules.bullet_list_open = (tokens, index) => {
  const marker = tokens[index].markup || "-";
  return `<ul data-marker="${escapeAttribute(marker)}">\n`;
};

markdown.renderer.rules.ordered_list_open = (tokens, index) => {
  const token = tokens[index];
  const start = Number.parseInt(token.attrGet("start") || "1", 10);
  const safeStart = Number.isFinite(start) ? start : 1;
  const startAttribute = safeStart === 1 ? "" : ` start="${safeStart}"`;
  const delimiter = token.markup === ")" ? ")" : ".";

  return `<ol${startAttribute} data-delimiter="${delimiter}" style="--markdown-list-start: ${safeStart - 1}">\n`;
};

markdown.renderer.rules.fence = (tokens, index) => {
  const token = tokens[index];
  const fence = token.markup || "```";
  const info = token.info.trim();
  const openingMarker = info ? `${fence}${info}` : fence;

  return `<pre class="md-code-block" data-open="${escapeAttribute(openingMarker)}" data-close="${escapeAttribute(fence)}"><code>${markdown.utils.escapeHtml(token.content)}</code></pre>\n`;
};

markdown.renderer.rules.code_block = (tokens, index) =>
  `<pre class="md-indented-code"><code>${markdown.utils.escapeHtml(tokens[index].content)}</code></pre>\n`;

export function renderMarkdown(source) {
  return markdown.render(source);
}

function validateConfig(config) {
  for (const property of ["lang", "title", "description", "url"]) {
    if (typeof config[property] !== "string" || config[property].trim() === "") {
      throw new Error(`site.config.json must contain a non-empty ${property}`);
    }
  }

  const siteUrl = new URL(config.url);

  if (siteUrl.protocol !== "https:") {
    throw new Error("site.config.json url must use HTTPS");
  }
}

function renderHtml(config, content) {
  const title = escapeAttribute(config.title);
  const description = escapeAttribute(config.description);
  const lang = escapeAttribute(config.lang);
  const siteUrl = escapeAttribute(new URL(config.url).href);

  return `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="${description}">
    <meta name="color-scheme" content="dark">
    <meta name="theme-color" content="#151516">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="${siteUrl}">
    <meta property="og:site_name" content="${title}">
    <title>${title}</title>
    <link rel="canonical" href="${siteUrl}">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="/styles.css">
  </head>
  <body>
    <main>
      <article>
${content.trimEnd()}
      </article>
    </main>
  </body>
</html>
`;
}

export async function build({ silent = false } = {}) {
  const [source, configSource, styles, favicon] = await Promise.all([
    readFile(path.join(rootDirectory, "content.md"), "utf8"),
    readFile(path.join(rootDirectory, "site.config.json"), "utf8"),
    readFile(path.join(rootDirectory, "src/styles.css"), "utf8"),
    readFile(path.join(rootDirectory, "public/favicon.svg"), "utf8"),
  ]);

  const config = JSON.parse(configSource);
  validateConfig(config);

  const content = renderMarkdown(source);
  const html = renderHtml(config, content);

  await rm(outputDirectory, { recursive: true, force: true });
  await mkdir(outputDirectory, { recursive: true });
  await Promise.all([
    writeFile(path.join(outputDirectory, "index.html"), html),
    writeFile(path.join(outputDirectory, "styles.css"), styles),
    writeFile(path.join(outputDirectory, "index.md"), source),
    writeFile(path.join(outputDirectory, "favicon.svg"), favicon),
  ]);

  if (!silent) {
    console.log("Built dist/index.html from content.md");
  }

  return { outputDirectory, source };
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  build().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
