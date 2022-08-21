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
      port: 8137,
      devMiddleware: {
        publicPath: "./dist",
        writeToDisk: true,
      },
      client: {
        webSocketURL: "ws://localhost:8137/ws",
      },
    },
  },
]
