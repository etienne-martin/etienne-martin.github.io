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
  images: {
    disableStaticImages: true,
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

    config.module.rules.push({
      test: /\.(jpe?g|png|webp)$/i,
      use: {
        loader: "responsive-loader",
        options: {
          /**
           * Fixes a weird bug where the outputPath would change depending on if we're doing a production build or not
           */
          outputPath: isDev
            ? "../../../public/images"
            : "../../../../public/images",
          publicPath: "/images",
          format: "jpg",
          sizes: [
            100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300,
            1400, 1500, 1600,
          ].reverse(),
          adapter: require("responsive-loader/sharp"),
        },
      },
    });

    return config;
  },
};

module.exports = withLinaria(withMDX(config));
