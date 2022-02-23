import { css } from "linaria";

export const theme = css`
  :global() {
    :root {
      --background: white;
      --foreground: #2a2734;
      --radius: 8px;
      --primary-color: #9a86fd;

      --font-variable: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
        "Helvetica Neue", sans-serif;
      --font-mono: "JetBrains Mono", monospace;

      --font-size-xs: 14px;
      --font-size-s: 16px;
      --font-size-m: 18px;
      --font-size-l: 24px;
      --font-size-xl: 36px;
    }

    @media only screen and (max-width: 400px) {
      :root {
        --font-size-xs: 12px;
        --font-size-s: 14px;
        --font-size-m: 16px;
        --font-size-l: 18px;
        --font-size-xl: 24px;
      }
    }

    [data-theme="dark"] {
      --background: #2a2734;
      --foreground: white;
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
      background: var(--background);
      color: var(--foreground);
      transition: color 0.25s, background-color 0.25s;
    }
  }
`;
