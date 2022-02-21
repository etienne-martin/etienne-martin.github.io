import { css } from "linaria";

const title = css`
  transition: color 0.25s;
  margin-bottom: 5px;
`;

export const styles = {
  card: css`
    a {
      display: flex;
      color: var(--foreground);
      text-decoration: none;
      align-items: center;

      &:hover,
      &:focus {
        .${title} {
          color: var(--primary-color);
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
  title,
  date: css`
    font-size: var(--font-size-s);
    opacity: 0.5;
  `,
};
