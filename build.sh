#!/bin/bash

# Remove existing dist

rm -rf dist

# Build with parcel
# ├ we need to use "--no-scope-hoist" because tensorflow wouldn't work otherwise
# └ bug report for the afforementioned issue is here: https://github.com/parcel-bundler/parcel/issues/7781

parcel build "${@:1}" --no-scope-hoist pages/*/*.html pages/*/*.ts pages/*/*.tsx src/*.ts assets/logo/*

# Copy files that were not built by parcel:

cp manifest.json dist/
cp -r model/ dist/