const path = require("path");

const saitoRootWeb = path.resolve("web");
const saitoRootMods = path.resolve("mods");
// const saitoRootEmailWeb = path.resolve("mods/email");
// const saitoRootChatWeb = path.resolve("mods/chat");
const saitoEmailRoot = path.resolve(__dirname, "../");

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
  entry: ["babel-polyfill", path.resolve(__dirname, "../email.js")],
  output: {
    path: path.resolve(__dirname, ""),
    filename: "bundle.email.js",
  },
  devServer: {
    contentBase: [
      path.resolve(__dirname, ""),
      saitoRootWeb,
      saitoEmailRoot,
      saitoRootMods,
      // saitoRootEmailWeb,
      // saitoRootChatWeb,
    ],
    port: 8888,
    host: "0.0.0.0",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
};
