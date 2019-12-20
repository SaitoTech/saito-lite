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
            archiver: 'archiver'
    ***REMOVED***,
        {
            child_process: 'child_process'
    ***REMOVED***,
        {
            nodemailer: 'nodemailer'
    ***REMOVED***,
        {
            sqlite: 'sqlite'
    ***REMOVED***,
        {
            unzipper: 'unzipper'
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
        /\.zip$/,
        /\/web\//,
        /\/www\//
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
    ***REMOVED*** Emscripten JS files define a global. With `exports-loader` we can
    ***REMOVED*** load these files correctly (provided the global’s name is the same
    ***REMOVED*** as the file name).
            {
                test: /quirc\.js$/,
                loader: "exports-loader"
        ***REMOVED***,
    ***REMOVED*** wasm files should not be processed but just be emitted and we want
    ***REMOVED*** to have their public URL.
            {
                test: /quirc\.wasm$/,
                type: "javascript/auto",
                loader: "file-loader",
                options: {
                    publicPath: "dist/"
            ***REMOVED***
        ***REMOVED***
        ]
***REMOVED***,

    resolve: {
        alias: {
            ModTemplate$: path.resolve(__dirname, '../lib/templates/modtemplate.js'),
    ***REMOVED***
***REMOVED***,


    // Default mode for Webpack is production.
    // Depending on mode Webpack will apply different things
    // on final bundle. For now we don't need production's JavaScript
    // minifying and other thing so let's set mode to development
    mode: 'development',
    devtool: "cheap-module-eval-source-map",
***REMOVED***;
