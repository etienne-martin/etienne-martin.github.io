# etienne-martin.github.io

A small static website authored in [`content.md`](./content.md).

## Local development

```sh
pnpm install
pnpm dev
```

Editing `content.md`, `site.config.json`, or anything in `public/` or `src/`
rebuilds the site. Refresh the browser to see the result. The generated site is
written to `dist/`.

## Commands

```sh
pnpm build
pnpm test
pnpm check
```

The HTML uses semantic elements but displays Markdown punctuation with CSS.
There is no client-side JavaScript. Native copying treats the page as rendered
HTML: plain-text destinations receive readable text, while rich-text
destinations preserve links on their labels.

The production URL is `https://etiennemartin.ca/`. The build emits one SVG
favicon; there is intentionally no web app manifest, icon set, or social image.
