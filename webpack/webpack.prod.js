const path = require('path');
const webpack = require('webpack');

webpack({
  target: 'web',
    node: {
        fs: "empty",
    },
    externals: [
        {
            archiver: 'archiver'
        },
        {
            child_process: 'child_process'
        },
        {
            nodemailer: 'nodemailer'
        },
        {
            sqlite: 'sqlite'
        },
        {
            unzipper: 'unzipper'
        },
        {
            webpack: 'webpack'
        }
    ],
  entry: ["babel-polyfill", path.resolve(__dirname, './../bundler/default/lib/index.js')],
  output: {
      path: path.resolve(__dirname, '../web/saito/'),
      filename: 'saito.js'
  },
  module: {
    rules: [
        {
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        },
    ]
  },
  mode: 'production',
  devtool: false,
  }, (err, stats) => {
  if (err || stats.hasErrors()) {
    console.log(err);
    if (stats) {
      let info = stats.toJson();
      console.log(info.errors);
    }
  }
  //
  // Done processing
  //
  console.log("Bundle Success!");
});
