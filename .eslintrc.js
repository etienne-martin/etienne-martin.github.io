module.exports = {
  extends: [
    "next/core-web-vitals",
    "plugin:mdx/recommended",
    "plugin:prettier/recommended",
    "prettier",
  ],
  plugins: ["prettier"],
  settings: {
    // Enable linting of code blocks
    "mdx/code-blocks": true,
  },
  rules: {
    eqeqeq: 2,
    "object-shorthand": ["error", "always"],
    "react-hooks/exhaustive-deps": 2,
    "@next/next/no-img-element": 0,
    "@next/next/no-css-tags": 0,
  },
};
