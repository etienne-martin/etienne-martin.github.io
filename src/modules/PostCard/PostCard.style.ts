import { css } from "linaria";

const title = css``;

export const styles = {
  card: css`
    a {
      display: flex;
      color: rgb(var(--color-foreground));
      transition: color 0.25s;
      text-decoration: none;
      align-items: center;

      &:hover,
      &:focus {
        .${title} {
          color: rgb(var(--color-primary));
        }
      }
    }
  `,
  thumbnail: css`
    width: 150px;
    height: 100px;
    margin-right: 30px;
    position: relative;
    flex-shrink: 0;

    @media only screen and (max-width: 400px) {
      width: 100px;
      height: 70px;
      margin-right: 20px;
    }

    img {
      object-fit: cover;
      width: 100%;
      height: 100%;
      display: block;
    }
  `,
  body: css`
    display: grid;
    grid-row-gap: 5px;
  `,
  title,
  description: css`
    font-size: var(--font-size-s);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  small: css`
    font-size: var(--font-size-xs);
    opacity: 0.5;
  `,
};
