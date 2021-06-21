/* eslint-disable */
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const path = require("path")

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
    entry: "./src/app/index.ts",
    target: "web",
    module: {
      rules: [
        {
          test: /\.svelte$/,
          use: "svelte-loader",
        },
        {
          // required to prevent errors from Svelte on Webpack 5+, omit on Webpack 4
          test: /node_modules\/svelte\/.*\.mjs$/,
          resolve: {
            fullySpecified: false,
          },
        },
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: `./src/index${isDev ? "-dev" : ""}.html`,
      }),
      new MiniCssExtractPlugin()
    ],
    resolve: {
      alias: {
        svelte: path.resolve("node_modules", "svelte"),
      },
      extensions: [".tsx", ".ts", ".js", ".mjs", ".svelte"],
      mainFields: ["svelte", "browser", "module", "main"],
    },
    output: {
      path: __dirname + "/dist",
      filename: "renderer.js",
    },
  }
  return [main, preload, renderer]
}
