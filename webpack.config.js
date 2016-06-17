 // Support for Node 0.10
// See https://github.com/webpack/css-loader/issues/144
 require('es6-promise').polyfill();
 
 module.exports = {
     entry: './src/app.js',
     output: {
         filename: 'ios.js'
     },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" }
        ]
    }
 };