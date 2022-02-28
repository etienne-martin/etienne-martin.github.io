import { css } from "linaria";

export const styles = {
  code: css`
    float: left;
    min-width: 100%;
    background: none !important;
    padding: 20px 0;
    font-family: var(--font-mono);

    .title,
    .bold {
      font-weight: bold;
    }

    .italic {
      font-style: italic;
    }

    .strike {
      text-decoration: line-through;
    }
  `,
  line: css`
    padding: 0 60px 0 20px;
  `,
  highlighted: css`
    background: #574e83;
    box-shadow: inset rgb(var(--color-primary)) 4px 0 0;
  `,
};
