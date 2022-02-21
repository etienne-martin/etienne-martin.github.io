import { glob } from "../../utils/glob";
import readingTime from "reading-time";
import { promises as fs } from "fs";

export const listPostPaths = async () => {
  const paths = await glob("**/*.mdx", {
    cwd: `${process.cwd()}/src/pages/posts`,
  });

  return paths.map((filepath) => {
    return filepath.replace(/\/(index)?\.mdx$/, "");
  });
};

export const getPostContent = async (path: string) => {
  return await fs.readFile(
    `${process.cwd()}/src/pages/posts/${path}/index.mdx`,
    "utf-8"
  );
};

export const getReadingTime = async (path: string) => {
  return readingTime(await getPostContent(path)).text;
};

export const listPosts = async () => {
  const paths = await listPostPaths();

  return await Promise.all(
    paths.map(async (path) => {
      const { metadata } = await import(`../../pages/posts/${path}/index.mdx`);

      return {
        path,
        metadata,
        readingTime: await getReadingTime(path),
      };
    })
  );
};
