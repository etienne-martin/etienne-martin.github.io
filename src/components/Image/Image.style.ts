import { css } from "linaria";

export const styles = {
  image: css`
    width: 100%;
    height: auto;
    border-radius: var(--radius);
    box-shadow: rgba(0, 0, 0, 0.25) 0 50px 100px -50px;
    image-rendering: -webkit-optimize-contrast;
  `,
};
