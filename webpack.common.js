/* eslint-disable */
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = isDev => {
  const main = {
    mode: isDev ? "development" : "production",
    entry: "./src/main.ts",
    target: "electron-main",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    output: {
      path: __dirname + "/dist",
      filename: "main.js",
    },
    externals: [
      {
        "utf-8-validate": "commonjs utf-8-validate",
        fsevents: "commonjs fsevents",
        bufferutil: "commonjs bufferutil",
      },
    ],
  }
  const preload = {
    mode: isDev ? "development" : "production",
    entry: "./src/preload.ts",
    target: "electron-preload",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    output: {
      path: __dirname + "/dist",
      filename: "preload.js",
    },
  }
  const renderer = {
    mode: isDev ? "development" : "production",
    entry: "./src/index.ts",
    target: "electron-renderer",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html",
      }),
    ],
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    output: {
      path: __dirname + "/dist",
      filename: "renderer.js",
    },
  }
  return [main, preload, renderer]
}
