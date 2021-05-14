const path = require('path');
const webpack = require('webpack');

let devtool = false;
let entrypoint = './../bundler/default/apps/lite/index.js';
let outputfile = 'saito.js';
if(process.argv.includes("dev")) {
  devtool = "cheap-module-eval-source-map";
}
if(process.argv.includes("web3")) {
  //TODO: build a separate saito.js for web3
  entrypoint = './../bundler/default/apps/lite/web3index.js';
  outputfile = 'web3saito.js';
}
webpack({
  optimization: {
     minimize: true
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
            jimp: 'jimp'
        },
        {
            "image-resolve": "image-resolver"
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
        /\/www\//
  ],
  // Path to your entry point. From this file Webpack will begin his work
  entry: ["babel-polyfill", path.resolve(__dirname, entrypoint)],
  output: {
    path: path.resolve(__dirname, './../web/saito'),
    filename: outputfile
  },
  module: {
        rules: [
            {
                test: /\.mjs$/,
                include: /(node_modules)/,
                type: 'javascript/auto',
            },
            {
                test: /html$/,
                exclude: [ /(mods)/, /(email)/ ],
            },
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
            // Emscripten JS files define a global. With `exports-loader` we can
            // load these files correctly (provided the global’s name is the same
            // as the file name).
            {
                test: /quirc\.js$/,
                loader: "exports-loader"
            },
            // wasm files should not be processed but just be emitted and we want
            // to have their public URL.
            {
                test: /quirc\.wasm$/,
                type: "javascript/auto",
                loader: "file-loader",
                options: {
                    publicPath: "dist/"
                }
            },
	    {
                test: /\.zip$/,
                exclude: [
                    path.resolve(__dirname, '../mods/appstore/bundler'),
                    path.resolve(__dirname, '../mods/appstore/mods'),
                ]
            },
        ]
  },

  mode: 'production',
  devtool: devtool,

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


