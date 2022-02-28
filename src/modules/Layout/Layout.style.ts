import { css } from "linaria";

export const styles = {
  layout: css`
    height: 100%;
    display: flex;
    flex-direction: column;
    max-width: 768px;
    margin: 0 auto;
  `,
  main: css`
    padding: 20px;
    flex-grow: 1;
  `,
};
