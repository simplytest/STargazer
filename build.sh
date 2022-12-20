rm -rf dist
parcel build pages/*/*.html pages/*/*.ts pages/*/*.tsx src/*.ts
cp manifest.json dist/