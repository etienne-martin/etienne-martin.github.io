import { css } from "linaria";

export const styles = {
  container: css`
    display: block;
    background: #3f3764 !important;
    border-radius: var(--radius);
    width: 100%;
    overflow: auto;
    font-size: var(--font-size-s);
    line-height: 1.3em;
    box-shadow: rgba(0, 0, 0, 0.25) 0 50px 100px -50px;
    padding: 20px;

    & > div {
      float: left;
      min-width: 100%;
    }
  `,
};
