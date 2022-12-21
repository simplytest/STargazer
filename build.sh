rm -rf dist
parcel build ${@:1} pages/*/*.html pages/*/*.ts pages/*/*.tsx src/*.ts
cp manifest.json dist/