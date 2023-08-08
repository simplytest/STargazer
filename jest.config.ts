/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
    clearMocks: true,

    coverageProvider: "v8",

    setupFilesAfterEnv: ["./tests/setup.ts"],

    transform: {
        "^.+words.ts$": ["babel-jest", {
            plugins: ["babel-plugin-macros"],
            presets: ["@babel/preset-typescript", "@babel/preset-env"]
        }],
        "^.+\\.tsx?$": ["ts-jest", {
            babelConfig: true,
        }],
    },
};
