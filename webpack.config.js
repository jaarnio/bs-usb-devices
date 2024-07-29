"use strict";
const path = require("path");

module.exports = {
  entry: "./src/server.js",
  output: {
    filename: "./bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [{}],
  },
  target: "node",
  resolve: {
    extensions: [".js"],
  },
  externals: {
    "@brightsign/serialport": "commonjs @brightsign/serialport",
    "@brightsign/serialportlist": "commonjs @brightsign/serialportlist",
    "@brightsign/deviceinfo": "commonjs @brightsign/deviceinfo",
  },
};
