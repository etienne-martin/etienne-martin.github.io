import React, { FC } from "react";
import { MarkdownContent } from "../../components/MarkdownContent/MarkdownContent";

export const ArticleLayout: FC = ({ children }) => {
  return <MarkdownContent>{children}</MarkdownContent>;
};
