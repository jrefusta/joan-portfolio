const path = require("path");
const { merge } = require("webpack-merge");
const commonConfiguration = require("./webpack.common.js");

module.exports = merge(commonConfiguration, {
  mode: "development",
  devServer: {
    host: "localhost",
    port: "auto",
    static: {
      directory: path.resolve(__dirname, "../dist"),
    },
    open: true,
  },
});
