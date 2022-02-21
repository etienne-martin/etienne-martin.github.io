import { GetStaticPaths, GetStaticProps } from "next";
import { ArticlePage } from "../../modules/ArticlePage";
import { listArticlePaths } from "../../helpers/articles.helper";
import { ParsedUrlQuery } from "querystring";
import { ArticlePageProps } from "../../modules/ArticlePage/ArticlePage";

interface PageParams extends ParsedUrlQuery {
  path: string[];
}

export const getStaticPaths: GetStaticPaths<PageParams> = async () => {
  const articlePaths = await listArticlePaths();

  return {
    paths: articlePaths.map((path) => ({
      params: {
        path: path.split("/"),
      },
    })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<
  ArticlePageProps,
  PageParams
> = async ({ params }) => {
  const path = params?.path.join("/");

  if (!path) throw new Error("Missing article path");

  return {
    props: {
      path,
    },
  };
};

export default ArticlePage;
