import { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import React from "react";
import { glob } from "../utils/glob";

interface Article {
  slug: string;
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
        {articles.map(({ slug, metadata }) => (
          <li key={slug}>
            <Link href={slug}>
              <a>{metadata.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const getStaticProps: GetStaticProps<HomepageProps> = async () => {
  const pages = await glob("**/*.mdx", {
    cwd: `${process.cwd()}/src/pages`,
  });

  const articles = await Promise.all(
    pages.map(async (page) => {
      const slug = `/${page.replace(/(index)?\.mdx$/, "")}`;
      const { metadata } = await import(`./${page}`);

      return {
        slug,
        metadata,
      };
    })
  );

  return {
    props: {
      articles,
    },
  };
};

export default Homepage;
