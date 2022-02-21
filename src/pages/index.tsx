import { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import React from "react";
import { listArticles } from "../helpers/articles.helper";

interface Article {
  path: string;
  metadata: {
    title: string;
    date: string;
    image: string;
  };
}

interface HomepageProps {
  articles: Article[];
}

const Homepage: NextPage<HomepageProps> = ({ articles }) => {
  return (
    <div>
      <h1>Articles</h1>

      <ul>
        {articles.map(({ path, metadata }) => (
          <li key={path}>
            <Link href={`/articles/${path}`}>
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
      articles: await listArticles(),
    },
  };
};

export default Homepage;
