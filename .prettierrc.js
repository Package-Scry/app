module.exports = {
  semi: false,
  singleQuote: false,
  trailingComma: "es5",
  bracketSpacing: true,
  bracketSameLine: false,
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
