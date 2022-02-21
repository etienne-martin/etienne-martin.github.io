import { GetStaticProps, NextPage } from "next";
import React from "react";
import { listPosts } from "../modules/Post/Post.service";
import { Post } from "../modules/Post/Post.types";
import { PostCard } from "../modules/PostCard/PostCard";
import { PostList } from "../modules/PostList/PostList";

interface HomepageProps {
  posts: Post[];
}

const Homepage: NextPage<HomepageProps> = ({ posts }) => {
  return (
    <PostList>
      {posts.map((post) => (
        <PostCard key={post.path} post={post} />
      ))}
    </PostList>
  );
};

export const getStaticProps: GetStaticProps<HomepageProps> = async () => {
  return {
    props: {
      posts: await listPosts(),
    },
  };
};

export default Homepage;
