/* eslint-disable */
const common = require("./webpack.common.js")

const [main, preload, renderer] = common(false)

module.exports = [main, preload, { ...renderer, devtool: "source-map", }]