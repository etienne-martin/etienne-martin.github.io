import { css } from "linaria";

export const theme = css`
  :global() {
    :root {
      --color-background: 255, 255, 255;
      --color-foreground: 42, 39, 52;
      --color-primary: 154, 134, 253;
      --radius: 8px;

      --font-variable: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
        "Helvetica Neue", sans-serif;
      --font-mono: "JetBrains Mono", monospace;

      --font-size-xs: 14px;
      --font-size-s: 16px;
      --font-size-m: 18px;
      --font-size-l: 24px;
      --font-size-xl: 32px;
      --font-size-xxl: 40px;
    }

    @media only screen and (max-width: 400px) {
      :root {
        --font-size-xs: 12px;
        --font-size-s: 14px;
        --font-size-m: 16px;
        --font-size-l: 18px;
        --font-size-xl: 24px;
        --font-size-xxl: 32px;
      }
    }

    [data-theme="dark"] {
      --color-background: 42, 39, 52;
      --color-foreground: 255, 255, 255;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    html {
      touch-action: manipulation;
      font-size: var(--font-size-m);
    }

    html,
    body,
    #__next {
      height: 100%;
    }

    body {
      font-family: var(--font-variable);
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      -webkit-text-size-adjust: none;
      background: rgb(var(--color-background));
      color: rgb(var(--color-foreground));
      transition: color 0.25s, background-color 0.25s;
    }
  }
`;
