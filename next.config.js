const withLinaria = require("next-linaria");
const CircularDependencyPlugin = require("circular-dependency-plugin");

const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
    providerImportSource: "@mdx-js/react",
    useDynamicImport: false,
  },
});

const config = {
  pageExtensions: ["ts", "tsx", "js", "jsx"],
  distDir: "./dist/.next",
  devIndicators: {
    autoPrerender: false,
  },
  eslint: {
    dirs: ["src"],
  },
  env: {
    ORIGIN: process.env.ORIGIN,
  },
  webpack: (config, { dev: isDev }) => {
    if (!isDev) {
      config.plugins.push(
        new CircularDependencyPlugin({
          exclude: /node_modules/,
          failOnError: true,
          cwd: process.cwd(),
        })
      );
    }

    return config;
  },
};

module.exports = withLinaria(withMDX(config));
