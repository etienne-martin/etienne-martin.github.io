import { FC } from "react";
import { styles } from "./MarkdownContent.style";

export const MarkdownContent: FC = ({ children }) => {
  return <article className={styles.container}>{children}</article>;
};
