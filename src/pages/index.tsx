import { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import React from "react";
import { listPosts } from "../services/Post/Post.service";
import { Post } from "../services/Post/Post.types";

interface HomepageProps {
  posts: Post[];
}

const Homepage: NextPage<HomepageProps> = ({ posts }) => {
  return (
    <div>
      <h1>Posts</h1>

      <ul>
        {posts.map(({ path, metadata }) => (
          <li key={path}>
            <Link href={`/posts/${path}`}>
              <a>{metadata.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
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
