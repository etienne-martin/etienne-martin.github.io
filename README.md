# etienne-martin.github.io

A small static website authored in [`content/`](./content/).

## Local development

```sh
pnpm install
pnpm dev
```

Editing anything in `content/`, `site.config.json`, `public/`, or `src/`
rebuilds the site. Refresh the browser to see the result. The generated site is
written to `dist/`.

Every `index.md` in `content/` becomes a page at the route matching its folder:

```text
content/
  index.md                              → /
  writing/
    article-slug/
      index.md                          → /writing/article-slug/
      image.png                         → /writing/article-slug/image.png
```

Keep article-specific images, audio, and other assets beside that article’s
`index.md`. The build copies them into the same generated route.

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
