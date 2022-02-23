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
    color: rgb(var(--color-foreground));
    transition: color 0.25s;
    display: flex;
    align-items: center;

    &:hover,
    &:focus {
      strong {
        color: rgb(var(--color-primary));
      }
    }

    strong {
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
    color: rgb(var(--color-foreground));

    &:hover,
    &:focus {
      opacity: 1;
      color: rgb(var(--color-primary));
    }

    svg {
      width: 100%;
      height: auto;
      fill: currentColor;
    }
  `,
};
