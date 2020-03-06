const path = require('path');
const webpack = require('webpack');

let [entry_path, output_path, output_filename] = process.argv.slice(2);

//entry_path = "/Users/david/Programming/saito-lite/bundler/default/lib/index.js";
//output_path = "/Users/david/Programming/saito-lite/web/saito";
//output_filename = "saito.js";


webpack({
  optimization: {
    minimize: false,
  },
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
        },
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
        /\/www\//
    ],
  entry: ["babel-polyfill", entry_path],
  output: {
      path: output_path,
      filename: output_filename
  },
  // rules that we're governed by
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
  resolve: {
    alias: {
      ModTemplate$: path.resolve(__dirname, 'lib/templates/modtemplate.js'),
      GameTemplate$: path.resolve(__dirname, 'lib/templates/gametemplate.js'),
      GameHud$: path.resolve(__dirname, 'lib/templates/lib/game-hud/game-hud.js'),
      GameCardBox$: path.resolve(__dirname, 'lib/templates/lib/game-cardfan/game-cardfan.js'),
      GameCardFan$: path.resolve(__dirname, 'lib/templates/lib/game-cardbox/game-cardbox.js'),
      AddressController$: path.resolve(__dirname, 'lib/ui/menu/address-controller.js'),
      Helpers$: path.resolve(__dirname, 'lib/helpers/index.js'),
      Header$: path.resolve(__dirname, 'lib/ui/header/header.js'),
      Modal$: path.resolve(__dirname, 'lib/ui/modal/modal.js'),
      saito$: path.resolve(__dirname, 'lib/saito/saito.js')
    }
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
