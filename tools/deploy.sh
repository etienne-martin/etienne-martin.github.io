#!/bin/bash

# Exit when any command fail
set -eo pipefail

yarn cleanup
yarn install
yarn build
touch dist/out/.nojekyll
echo 'etiennemartin.ca' > dist/out/CNAME
git add dist/*
git commit -m "Release at $(date)"
git subtree push --prefix dist/out origin master
