import React, { FC } from "react";
import { Image } from "../../components/Image";
import { Heading } from "../../components/Heading";
import { styles } from "./Post.style";
import { MarkdownContent } from "../../components/MarkdownContent";
import { formatDate } from "../../utils/date";
import { PageMetadata } from "../PageMetadata";
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

  return {
    Markdown,
    metadata,
  };
};

export const Post: FC<PostPageProps> = ({ path, readingTime }) => {
  const { Markdown, metadata } = getPost(path);

  return (
    <>
      <PageMetadata
        title={metadata.title}
        description={metadata.description}
        image={metadata.image.src}
        imageAlt={metadata.imageAlt}
        publishedTime={new Date(metadata.date)}
        type="article"
      />
      <MarkdownContent>
        <header>
          <Heading.h1 className={styles.title}>{metadata.title}</Heading.h1>
          <p className={styles.small}>
            {formatDate(new Date(metadata.date))} • {readingTime}
          </p>
        </header>
        <Image
          alt={metadata.imageAlt}
          src={metadata.image.src}
          srcSet={metadata.image.srcSet}
          width={metadata.image.width}
          height={metadata.image.height}
          sizes="(max-width: 768px) 100vw, 768px"
        />
        <Markdown />
      </MarkdownContent>
    </>
  );
};
