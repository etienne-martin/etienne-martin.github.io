import React, { FC } from "react";
import { Image } from "../../components/Image";
import { Heading } from "../../components/Heading/Heading";
import { styles } from "./Post.style";
import { MarkdownContent } from "../../components/MarkdownContent/MarkdownContent";
import { formatDate } from "../../utils/date";
import { PageMetadata } from "../PageMetadata/PageMetadata";
import { Post as PostEntity } from "./Post.types";

export interface PostPageProps {
  path: string;
  readingTime: string;
}

const getPost = (
  path: string
): { Markdown: FC; metadata: PostEntity["metadata"] } => {
  const {
    default: Markdown,
    metadata,
  } = require(`../../pages/posts/${path}/index.mdx`);

  return { Markdown, metadata };
};

export const Post: FC<PostPageProps> = ({ path, readingTime }) => {
  const { Markdown, metadata } = getPost(path);

  return (
    <>
      <PageMetadata
        title={metadata.title}
        description={metadata.description}
        image={metadata.image}
        imageAlt={metadata.imageAlt}
        publishedTime={new Date(metadata.date)}
        type="article"
      />
      <MarkdownContent>
        <div>
          <Heading.h1 className={styles.title}>{metadata.title}</Heading.h1>
          <p className={styles.small}>
            {formatDate(new Date(metadata.date))} • {readingTime}
          </p>
        </div>
        <Image alt={metadata.imageAlt} src={metadata.image} />
        <Markdown />
      </MarkdownContent>
    </>
  );
};
