import React, { FC } from "react";
import { styles } from "./PostList.style";
import { Post } from "../Post/Post.types";
import { PostCard } from "../PostCard/PostCard";
import { Heading } from "../../components/Heading/Heading";

interface PostListProps {
  posts: Post[];
}

const groupPostsByYear = (posts: Post[]) => {
  return Object.entries(
    posts.reduce<Record<string, Post[]>>((acc, post) => {
      const year = new Date(post.metadata.date).getFullYear();

      acc[year] ??= [];
      acc[year].push(post);

      return acc;
    }, {})
  );
};

const sortPostsByDate = (posts: Post[]) => {
  return posts.sort(
    (a, b) => Date.parse(b.metadata.date) - Date.parse(a.metadata.date)
  );
};

const sortGroupsByYear = (groups: [string, Post[]][]) => {
  return groups.sort(([a], [b]) => Date.parse(b) - Date.parse(a));
};

export const PostList: FC<PostListProps> = ({ posts }) => {
  const sortedPosts = sortPostsByDate(posts);
  const sortedGroups = sortGroupsByYear(groupPostsByYear(sortedPosts));

  return (
    <div className={styles.list}>
      {sortedGroups.map(([year, posts]) => (
        <section key={year} className={styles.list}>
          <Heading.h2 className={styles.year}>{year}</Heading.h2>
          {posts.map((post) => (
            <PostCard key={post.path} post={post} />
          ))}
        </section>
      ))}
    </div>
  );
};
