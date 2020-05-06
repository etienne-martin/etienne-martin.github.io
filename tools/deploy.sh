#!/bin/bash

# Exit when any command fail
set -eo pipefail

yarn cleanup
yarn install
yarn build
git add --all
git commit -m "Release at $(date)"
git subtree push --prefix dist/out origin gh-pages
