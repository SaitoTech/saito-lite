const path = require("path");

module.exports = {
  mode: "development",
  node: {
    fs: "empty",
  },
  externals: [
    {
      archiver: "archiver",
    },
    {
      child_process: "child_process",
    },
    {
      nodemailer: "nodemailer",
    },
    {
      jimp: "jimp",
    },
    {
      "image-resolve": "image-resolver",
    },
    {
      sqlite: "sqlite",
    },
    {
      unzipper: "unzipper",
    },
    {
      webpack: "webpack",
    },
    // /^(image-resolver|\$)$/i,
    /\.txt/,
    /\.png$/,
    /\.jpg$/,
    /\.html$/,
    /\.css$/,
    /\.sql$/,
    /\.md$/,
    /\.pdf$/,
    /\.sh$/,
    /\.zip$/,
    /\/web\//,
    /\/www\//,
  ],
  entry: [
    "babel-polyfill",
    // path.resolve(__dirname, "./../bundler/default/lib/saito/lite/index.js"),
    path.resolve(__dirname, "./../lib/saito/lite/index.js"),
  ],
  output: {
    path: path.resolve(__dirname, "./../web/saito"),
    filename: "saito.bundle.js",
  },
  devServer: {
    contentBase: path.resolve(__dirname, "./../web"),
    port: 8888,
    host: "0.0.0.0",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
};
