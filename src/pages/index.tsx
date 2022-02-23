import React from "react";
import { GetStaticProps, NextPage } from "next";
import { listPosts } from "../modules/Post/Post.service";
import { Post } from "../modules/Post/Post.types";
import { PostList } from "../modules/PostList";
import { PageMetadata } from "../modules/PageMetadata";

interface HomepageProps {
  posts: Post[];
}

const Homepage: NextPage<HomepageProps> = ({ posts }) => {
  return (
    <>
      <PageMetadata />
      <PostList posts={posts} />
    </>
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
