import { glob } from "../../utils/glob";

export const listPostPaths = async () => {
  const paths = await glob("**/*.mdx", {
    cwd: `${process.cwd()}/src/pages/posts`,
  });

  return paths.map((filepath) => {
    return filepath.replace(/\/(index)?\.mdx$/, "");
  });
};

export const listPosts = async () => {
  const paths = await listPostPaths();

  return await Promise.all(
    paths.map(async (path) => {
      const { metadata } = await import(`../../pages/posts/${path}/index.mdx`);

      return {
        path,
        metadata,
      };
    })
  );
};
