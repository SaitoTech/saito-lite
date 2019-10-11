var path = require('path');
var nodeExternals = require('webpack-node-externals');

***REMOVED***
  target: 'node',
  externals: [nodeExternals()],
  // node: {
  //   fs: "empty"
  // ***REMOVED***,
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'saitolib.js',
    library: 'saitolib',
    libraryTarget: 'commonjs2'
  ***REMOVED***
***REMOVED***;

