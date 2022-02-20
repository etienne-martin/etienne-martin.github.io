import { css } from "linaria";

export const styles = {
  listItem: css`
    display: block;
    padding-left: 20px;
    position: relative;
    line-height: 1.5em;

    &:before {
      content: "";
      position: absolute;
      top: 0.6em;
      left: 0;
      width: 5px;
      height: 5px;
      transform: rotate(45deg);
      border-radius: 2px;
      border-top: solid var(--primary-color) 2px;
      border-right: solid var(--primary-color) 2px;
    }
  `,
};
