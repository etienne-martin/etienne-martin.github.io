import React, { FC } from "react";
import { ArticleLayout } from "../ArticleLayout";

export interface ArticlePageProps {
  path: string;
}

export const ArticlePage: FC<ArticlePageProps> = (props) => {
  const {
    default: Article,
    // metadata,
  } = require(`../../pages/articles/${props.path}/index.mdx`);

  // console.log(metadata);

  return (
    <ArticleLayout>
      <Article />
    </ArticleLayout>
  );
};
