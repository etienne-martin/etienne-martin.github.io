import { css } from "linaria";

export const styles = {
  heading: css`
    &:is(h1) {
      font-size: var(--font-size-xl);
    }
    &:is(h2) {
      font-size: var(--font-size-l);
    }
    &:is(h3) {
      font-size: var(--font-size-m);
    }
    &:is(h4) {
      font-size: var(--font-size-s);
    }
    &:is(h5) {
      font-size: var(--font-size-xs);
    }
  `,
};
