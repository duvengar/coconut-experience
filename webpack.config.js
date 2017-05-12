var webpack = require('webpack'),
    path = require('path');

module.exports = {
    cache: true,
    target: 'web',
    entry: {
        app: path.join(__dirname, 'assets/js/app.js')
    },
    output: {
        path: path.join(__dirname, 'dist/js'),
        publicPath: '',
        filename: '[name].min.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    externals: {
        backbone: 'Backbone',
        underscore: '_'
    },
    plugins: [
        new webpack.ProvidePlugin({
            // Automatically detect jQuery and $ as free var in modules
            // and inject the jquery library
            // This is required by many jquery plugins
            backbone: "Backbone",
            underscore: "_"
        })
    ]
};