import React, { FC } from "react";
import { Image } from "../../components/Image";
import { Heading } from "../../components/Heading/Heading";
import { styles } from "./Post.style";
import { MarkdownContent } from "../../components/MarkdownContent/MarkdownContent";
import { formatDate } from "../../utils/date";

export interface PostPageProps {
  path: string;
}

export const Post: FC<PostPageProps> = (props) => {
  const {
    default: Markdown,
    metadata,
  } = require(`../../pages/posts/${props.path}/index.mdx`);

  return (
    <MarkdownContent>
      <div>
        <Heading.h1 className={styles.title}>{metadata.title}</Heading.h1>
        <p className={styles.date}>{formatDate(new Date(metadata.date))}</p>
      </div>
      <Image alt="A browser browser lifting weights" src={metadata.image} />
      <Markdown />
    </MarkdownContent>
  );
};
