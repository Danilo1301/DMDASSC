// production config
const { merge } = require("webpack-merge");
const { resolve } = require("path");
const path = require("path");

const commonConfig = require("./common");

module.exports = merge(commonConfig, {
  mode: "production",
  entry: "./index.tsx",
  output: {
    //filename: "js/bundle.[contenthash].min.js",
    filename: "js/bundle.min.js",
    path: resolve(path.join(__dirname, "..", "..", "..", "server", "static", "client")),
    publicPath: "/static/client/",
  },
  devtool: "source-map",
  plugins: [],
});
