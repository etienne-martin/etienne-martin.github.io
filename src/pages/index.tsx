import { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import React from "react";
import { glob } from "../utils/glob";

interface ArticlesHomeProps {
  pages: string[];
}

const BlogHome: NextPage<ArticlesHomeProps> = ({ pages }) => {
  return (
    <div>
      <h1>Articles</h1>

      <ul>
        {pages.map((page) => (
          <li key={page}>
            <Link href={page}>
              <a>{page}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const getStaticProps: GetStaticProps<ArticlesHomeProps> = async () => {
  const pages = await glob("**/*.mdx", {
    cwd: `${process.cwd()}/src/pages`,
  });

  const slugs = pages.map((page) => {
    return `/${page.replace(/(index)?\.mdx$/, "")}`;
  });

  return {
    props: {
      pages: slugs,
    },
  };
};

export default BlogHome;
