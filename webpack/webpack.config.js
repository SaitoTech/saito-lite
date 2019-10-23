// Webpack uses this to work with directories
const path = require('path');

// This is main configuration object.
// Here you write different options and tell Webpack what to do
***REMOVED***
    target: 'web',
    node: {
        fs: "empty",
***REMOVED***,
    externals: [
        {
            sqlite: 'sqlite'
    ***REMOVED***,
        /\.png$/,
        /\.jpg$/,
        /\.html$/,
        /\.css$/,
        /\.sql$/
    ],
    // Path to your entry point. From this file Webpack will begin his work
    entry: ["babel-polyfill", path.resolve(__dirname, '../lib/saito/lite/index.js')],

    // Webpack will bundle all JavaScript into this file
    output: {
        path: path.resolve(__dirname, '../web/saito'),
        filename: 'saito.js'
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


    // Default mode for Webpack is production.
    // Depending on mode Webpack will apply different things
    // on final bundle. For now we don't need production's JavaScript
    // minifying and other thing so let's set mode to development
    mode: 'development',
    devtool: "cheap-module-eval-source-map",
***REMOVED***;
