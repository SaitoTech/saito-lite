const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const merge = require('webpack-merge');
const common = require('./webpack.config.js');

module.exports = merge(common, {
  plugins: [
    new BundleAnalyzerPlugin()
  ],
  mode: 'production'
});
