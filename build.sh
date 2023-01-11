rm -rf dist
parcel build ${@:1} pages/*/*.html pages/*/*.ts pages/*/*.tsx src/*.ts assets/*
cp manifest.json dist/