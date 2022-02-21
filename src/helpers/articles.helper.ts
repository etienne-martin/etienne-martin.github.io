import { glob } from "../utils/glob";

export const listArticlePaths = async () => {
  const paths = await glob("**/*.mdx", {
    cwd: `${process.cwd()}/src/pages/articles`,
  });

  return paths.map((filepath) => {
    return filepath.replace(/\/(index)?\.mdx$/, "");
  });
};

export const listArticles = async () => {
  const paths = await listArticlePaths();

  return await Promise.all(
    paths.map(async (path) => {
      const { metadata } = await import(`../pages/articles/${path}/index.mdx`);

      return {
        path,
        metadata,
      };
    })
  );
};
