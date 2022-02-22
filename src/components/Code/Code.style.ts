import { css } from "linaria";

export const styles = {
  wrapper: css`
    position: relative;
    background: #3f3764;
    box-shadow: rgba(0, 0, 0, 0.25) 0 50px 100px -50px;
    border-radius: var(--radius);
    font-size: var(--font-size-s);
    line-height: 1.3em;
  `,
  clipboard: css`
    && {
      position: absolute;
      top: 15px;
      right: 15px;
    }
  `,
  container: css`
    overflow-x: auto;

    & > code {
      display: block;
      float: left;
      min-width: 100%;
      background: none !important;
      padding: 20px 60px 20px 20px;

      .bold {
        font-weight: bold;
      }

      .italic {
        font-style: italic;
      }

      .strike {
        text-decoration: line-through;
      }
    }
  `,
};
