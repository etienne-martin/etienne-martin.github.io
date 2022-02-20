import React, { FC } from "react";
import { styles } from "./ArticleHead.style";
import { Heading } from "../../components/Heading/Heading";

interface ArticleMetadataProps {
  metadata: {
    title: string;
    date: string;
  };
}

export const ArticleHead: FC<ArticleMetadataProps> = ({ metadata }) => {
  const humanReadableDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
  }).format(new Date(metadata.date));

  return (
    <header>
      <Heading.h1 className={styles.title}>{metadata.title}</Heading.h1>
      <p className={styles.date}>{humanReadableDate}</p>
    </header>
  );
};
