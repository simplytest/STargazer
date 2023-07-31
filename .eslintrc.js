module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:react/recommended"],
    overrides: [
        {
            env: {
                node: true,
            },
            files: [".eslintrc.{js,cjs}"],
            parserOptions: {
                sourceType: "script",
            },
        },
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: ["@typescript-eslint", "react"],
    rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "object-curly-spacing": ["error", "always"],
        "linebreak-style": ["error", "unix"],
        "brace-style": ["error", "allman"],
        quotes: ["error", "double"],
        semi: ["error", "always"],
        indent: ["error", 4],
    },
};
