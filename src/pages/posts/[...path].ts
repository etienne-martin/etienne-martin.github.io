import { GetStaticPaths, GetStaticProps } from "next";
import { listPostPaths } from "../../modules/Post/Post.service";
import { ParsedUrlQuery } from "querystring";
import { Post, PostPageProps } from "../../modules/Post/Post";

interface PageParams extends ParsedUrlQuery {
  path: string[];
}

export const getStaticPaths: GetStaticPaths<PageParams> = async () => {
  const postPaths = await listPostPaths();

  return {
    paths: postPaths.map((path) => ({
      params: {
        path: path.split("/"),
      },
    })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<
  PostPageProps,
  PageParams
> = async ({ params }) => {
  const path = params?.path.join("/");

  if (!path) throw new Error("Missing post path");

  return {
    props: {
      path,
    },
  };
};

export default Post;
