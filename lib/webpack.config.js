var path = require('path');
var nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',
  externals: [nodeExternals()],
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'saitolib.js',
    library: 'saitolib',
    libraryTarget: 'commonjs2'
  },
  node: {
    console: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
};

