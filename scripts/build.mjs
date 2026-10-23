import {
  copyFile,
  mkdir,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import hljs from "highlight.js";
import MarkdownIt from "markdown-it";

const scriptPath = fileURLToPath(import.meta.url);
const rootDirectory = path.resolve(path.dirname(scriptPath), "..");
const contentDirectory = path.join(rootDirectory, "content");
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
        const title = token.attrGet("title");
        const titleAttribute = title
          ? ` title="${escapeAttribute(title)}"`
          : "";
        const escapedSource = escapeAttribute(source);
        const escapedAlt = escapeAttribute(alt);
        output += `<span class="md-image" data-alt="${escapedAlt}" data-src="${escapedSource}"><img src="${escapedSource}" alt="${escapedAlt}"${titleAttribute}></span>`;
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
  const language = info.split(/\s+/u, 1)[0]?.toLowerCase() || "";
  const canHighlight =
    /^[a-z0-9_+-]+$/u.test(language) && hljs.getLanguage(language);
  const code = canHighlight
    ? hljs.highlight(token.content, { language, ignoreIllegals: true }).value
    : markdown.utils.escapeHtml(token.content);
  const classAttribute = canHighlight
    ? ` class="hljs language-${escapeAttribute(language)}"`
    : "";

  return `<pre class="md-code-block" data-open="${escapeAttribute(openingMarker)}" data-close="${escapeAttribute(fence)}"><code${classAttribute}>${code}</code></pre>\n`;
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

function getPageTitle(source, fallbackTitle) {
  const tokens = markdown.parse(source, {});

  for (let index = 0; index < tokens.length - 1; index += 1) {
    if (tokens[index].type === "heading_open" && tokens[index].tag === "h1") {
      const inlineToken = tokens[index + 1];

      if (inlineToken?.type === "inline") {
        const title = inlineText(inlineToken.children ?? []).trim();

        if (title) {
          return title;
        }
      }
    }
  }

  return fallbackTitle;
}

function getPageDescription(source, fallbackDescription) {
  const tokens = markdown.parse(source, {});

  for (let index = 0; index < tokens.length - 1; index += 1) {
    if (tokens[index].type !== "paragraph_open") {
      continue;
    }

    const inlineToken = tokens[index + 1];

    if (inlineToken?.type !== "inline") {
      continue;
    }

    const children = inlineToken.children ?? [];

    if (children.some((token) => token.type === "image")) {
      continue;
    }

    const description = inlineText(children).trim().replace(/\s+/g, " ");

    if (description.length >= 40) {
      return description.length > 160
        ? `${description.slice(0, 157).trimEnd()}…`
        : description;
    }
  }

  return fallbackDescription;
}

function renderHtml(config, page, content, copyrightYear) {
  const pageTitle = getPageTitle(page.source, config.title);
  const documentTitle =
    page.route === "/" ? pageTitle : `${pageTitle} — ${config.title}`;
  const description = escapeAttribute(
    page.route === "/"
      ? config.description
      : getPageDescription(page.source, config.description),
  );
  const title = escapeAttribute(documentTitle);
  const socialTitle = escapeAttribute(pageTitle);
  const lang = escapeAttribute(config.lang);
  const siteTitle = escapeAttribute(config.title);
  const pageUrl = escapeAttribute(new URL(page.route, config.url).href);
  const socialType = page.route.startsWith("/writing/")
    ? "article"
    : "website";

  return `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="${description}">
    <meta name="color-scheme" content="dark">
    <meta name="theme-color" content="#151516">
    <meta property="og:type" content="${socialType}">
    <meta property="og:title" content="${socialTitle}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="${pageUrl}">
    <meta property="og:site_name" content="${siteTitle}">
    <title>${title}</title>
    <link rel="canonical" href="${pageUrl}">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="/styles.css">
  </head>
  <body>
    <main>
      <article>
${content.trimEnd()}
      </article>
    </main>
    <footer class="site-footer">
      <hr>
      <p>© ${copyrightYear} ${siteTitle}</p>
    </footer>
  </body>
</html>
`;
}

async function collectContentFiles(directory = contentDirectory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries.sort((left, right) =>
    left.name.localeCompare(right.name),
  )) {
    const filePath = path.join(directory, entry.name);

    if (entry.isSymbolicLink()) {
      throw new Error(`Content symlinks are not supported: ${filePath}`);
    }

    if (entry.isDirectory()) {
      files.push(...(await collectContentFiles(filePath)));
    } else if (entry.isFile()) {
      files.push(filePath);
    }
  }

  return files;
}

function pageFromSourcePath(sourcePath, source) {
  const relativePath = path.relative(contentDirectory, sourcePath);
  const relativeDirectory = path.dirname(relativePath);
  const routeDirectory = relativeDirectory === "." ? "" : relativeDirectory;
  const route = routeDirectory
    ? `/${routeDirectory.split(path.sep).join("/")}/`
    : "/";

  return {
    outputDirectory: path.join(outputDirectory, routeDirectory),
    route,
    source,
    sourcePath,
  };
}

export async function build({ silent = false } = {}) {
  const copyrightYear = new Date().getUTCFullYear();
  const [contentFiles, configSource, styles, favicon] = await Promise.all([
    collectContentFiles(),
    readFile(path.join(rootDirectory, "site.config.json"), "utf8"),
    readFile(path.join(rootDirectory, "src/styles.css"), "utf8"),
    readFile(path.join(rootDirectory, "public/favicon.svg"), "utf8"),
  ]);

  const config = JSON.parse(configSource);
  validateConfig(config);

  const pageSourcePaths = contentFiles.filter(
    (filePath) => path.basename(filePath) === "index.md",
  );

  if (!pageSourcePaths.includes(path.join(contentDirectory, "index.md"))) {
    throw new Error("content/index.md is required");
  }

  const pages = await Promise.all(
    pageSourcePaths.map(async (sourcePath) =>
      pageFromSourcePath(sourcePath, await readFile(sourcePath, "utf8")),
    ),
  );

  await rm(outputDirectory, { recursive: true, force: true });
  await mkdir(outputDirectory, { recursive: true });
  await Promise.all(
    contentFiles
      .filter((filePath) => path.basename(filePath) !== "index.md")
      .map(async (sourcePath) => {
        const relativePath = path.relative(contentDirectory, sourcePath);
        const destinationPath = path.join(outputDirectory, relativePath);
        await mkdir(path.dirname(destinationPath), { recursive: true });
        await copyFile(sourcePath, destinationPath);
      }),
  );
  await Promise.all(
    pages.map(async (page) => {
      const content = renderMarkdown(page.source);
      const html = renderHtml(config, page, content, copyrightYear);

      await mkdir(page.outputDirectory, { recursive: true });
      await Promise.all([
        writeFile(path.join(page.outputDirectory, "index.html"), html),
        writeFile(path.join(page.outputDirectory, "index.md"), page.source),
      ]);
    }),
  );
  await Promise.all([
    writeFile(path.join(outputDirectory, "styles.css"), styles),
    writeFile(path.join(outputDirectory, "favicon.svg"), favicon),
  ]);

  if (!silent) {
    const label = pages.length === 1 ? "page" : "pages";
    console.log(`Built ${pages.length} ${label} from content/`);
  }

  return { outputDirectory, pages };
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  build().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
