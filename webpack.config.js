/* eslint-disable */
module.exports = [
  {
    mode: "development",
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
        'utf-8-validate': 'commonjs utf-8-validate',
        fsevents: 'commonjs fsevents',
        bufferutil: 'commonjs bufferutil',
      },
    ],
  },
]
