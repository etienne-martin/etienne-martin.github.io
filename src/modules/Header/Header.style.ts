import { css } from "linaria";

export const styles = {
  header: css`
    display: flex;
    justify-content: space-between;
    padding: 60px 20px;
    align-items: center;

    @media only screen and (max-width: 400px) {
      padding: 40px 20px;
    }
  `,
  homeLink: css`
    text-decoration: none;
    color: var(--foreground);
    display: flex;
    align-items: center;

    &:hover,
    &:focus {
      strong {
        color: var(--primary-color);
      }
    }

    strong {
      transition: color 0.25s;
      font-weight: 800;
      display: block;
      margin-bottom: 5px;
    }

    em {
      opacity: 0.5;
      font-style: normal;
      font-size: var(--font-size-s);
    }
  `,
  photo: css`
    && {
      width: 60px;
      image-rendering: -webkit-optimize-contrast;
      margin-right: 20px;
      border-radius: 100px;
    }
  `,
  themeToggle: css`
    width: 30px;
    height: 30px;
    border: none;
    background: none;
    cursor: pointer;
    opacity: 0.75;
    transition: color 0.25s, opacity 0.25s;
    margin-left: 20px;

    &:hover,
    &:focus {
      opacity: 1;
      color: var(--primary-color);
    }

    svg {
      width: 100%;
      height: auto;
      fill: currentColor;
    }
  `,
};
