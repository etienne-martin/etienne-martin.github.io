import { FC } from "react";
import { styles } from "./MarkdownContent.style";

export const MarkdownContent: FC = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};
