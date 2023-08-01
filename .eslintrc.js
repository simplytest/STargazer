module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:react/recommended", "plugin:react/jsx-runtime"],
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
        "object-curly-spacing":                 ["error", "always"],
        "brace-style":                          ["error", "allman"],
        quotes:                                 ["error", "double"],
        semi:                                   ["error", "always"],
        "linebreak-style":                      ["error", "unix"],
        indent:                                 ["error", 4],
        "@typescript-eslint/no-explicit-any":   "off",
        "no-else-return":                       1,
        "space-unary-ops":                      2,
    },
};
