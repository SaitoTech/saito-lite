const path = require('path');
const webpack = require('webpack');

let [entry_path, output_path, output_filename] = process.argv.slice(2);

// let entry = path.resolve(__dirname, 'mods/appstore/bundler/templates/index.js');
// let output_path = path.resolve(__dirname, 'mods/appstore/bundler/dist');

webpack({
  target: 'web',
  node: {
      fs: "empty",
  ***REMOVED***,
  externals: [
      {
          sqlite: 'sqlite'
  ***REMOVED***,
      {
          child_process: 'child_process'
  ***REMOVED***,
      {
          webpack: 'webpack'
  ***REMOVED***,
      /\.txt/,
      /\.png$/,
      /\.jpg$/,
      /\.html$/,
      /\.css$/,
      /\.sql$/,
      /\.md$/,
      /\.pdf$/,
      /\.sh$/,
      /\/web\//,
      /\/www\//
  ],
  entry: ["babel-polyfill", entry_path],
  output: {
      path: output_path,
      filename: output_filename
  ***REMOVED***,
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
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***,
    ]
  ***REMOVED***,
  mode: 'development'
  ***REMOVED***, (err, stats) => {
  if (err || stats.hasErrors()) {
    let info = stats.toJson();
    console.log(info.errors);
  ***REMOVED***
  //
  // Done processing
  //
  console.log("Bundle Success!");
***REMOVED***);