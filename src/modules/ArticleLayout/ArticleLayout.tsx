import React, { FC } from "react";
import { styles } from "./ArticleLayout.style";
import { MarkdownContent } from "../../components/MarkdownContent/MarkdownContent";

export const ArticleLayout: FC = ({ children }) => {
  return (
    <div className={styles.layout}>
      <MarkdownContent>{children}</MarkdownContent>
    </div>
  );
};
