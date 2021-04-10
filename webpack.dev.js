/* eslint-disable */
const common = require("./webpack.common.js")

const [main, preload, renderer] = common(true)

module.exports = [
  main,
  preload,
  {
    ...renderer,
    devtool: "inline-source-map",
    devServer: {
      contentBase: "./dist",
      writeToDisk: true,
    },
  },
]
