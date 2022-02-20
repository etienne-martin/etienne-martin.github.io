import { FC } from "react";
import { styles } from "./MarkdownContent.style";

export const MarkdownContent: FC = ({ children }) => {
  return <li className={styles.container}>{children}</li>;
};
