const path = require('path')
const webpack = require('webpack')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


module.exports = {
    mode: 'production',
    entry: {
        pixi: ['pixi.js']
    },
    output: {
        filename: '[name].dll.js',
        path: path.join(__dirname, 'public/dll'),
        library: '_dll_[name]'
    },
    plugins: [
        new CleanWebpackPlugin({
            root: path.resolve(__dirname, 'public/dll'),
            verbose: true,
            dry: false
        }),
        new webpack.DllPlugin({
            name: '_dll_[name]',
            path: path.join(__dirname, 'public/dll/[name].manifest.json')
        }),
        new BundleAnalyzerPlugin()
    ]
}