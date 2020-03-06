const merge = require('webpack-merge');
const common = require('./old/webpack.config.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: false
});
