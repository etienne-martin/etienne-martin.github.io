#!/bin/bash

# Exit when any command fail
set -eo pipefail

yarn cleanup
yarn install
yarn build
git add dist/* && git commit -m "deploy"
git subtree push --prefix dist origin gh-pages
