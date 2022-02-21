import React, { FC } from "react";
import Link from "next/link";
import { styles } from "./PostCard.style";
import { Post } from "../Post/Post.types";
import { Heading } from "../../components/Heading/Heading";
import { formatDate } from "../../utils/date";
import { Image } from "../../components/Image";
import { Paragraph } from "../../components/Paragraph/Paragraph";

interface PostCardProps {
  post: Post;
}

export const PostCard: FC<PostCardProps> = ({ post }) => {
  return (
    <article className={styles.card}>
      <Link href={`/posts/${post.path}`}>
        <a>
          <div className={styles.thumbnail}>
            <Image
              alt={post.metadata.imageAlt}
              src={post.metadata.image.src}
              srcSet={post.metadata.image.srcSet}
              width={post.metadata.image.width}
              height={post.metadata.image.height}
              sizes="150px"
            />
          </div>
          <div className={styles.body}>
            <Heading.h3 className={styles.title}>
              {post.metadata.title}
            </Heading.h3>
            <Paragraph className={styles.description}>
              {post.metadata.description}
            </Paragraph>
            <Paragraph className={styles.small}>
              {formatDate(new Date(post.metadata.date))} • {post.readingTime}
            </Paragraph>
          </div>
        </a>
      </Link>
    </article>
  );
};
