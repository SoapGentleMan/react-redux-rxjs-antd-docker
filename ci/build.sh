#!/usr/bin/env bash
. ./config.sh
yarn config set fse_binary_host_mirror https://npm.taobao.org/mirrors/fsevents
yarn config set sass_binary_site http://cdn.npm.taobao.org/dist/node-sass
yarn install && yarn build
