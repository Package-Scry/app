module.exports = {
  semi: false,
  singleQuote: false,
  trailingComma: "es5",
  bracketSpacing: true,
  jsxBracketSameLine: false,
  arrowParens: "avoid",
  endOfLine: "auto",
  overrides: [
    {
      files: "*.svelte",
      options: { parser: "svelte" },
    },
  ],
  plugins: ["./node_modules/prettier-plugin-svelte"],
}
