const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

module.exports = {
  publicPath: '.',
  css: {
    loaderOptions: {
      css: {},
      postcss: {
        plugins: [
          require('postcss-px2rem')({
            remUnit: 75
          })
        ]
      }
    }
  },
  configureWebpack: {
    devtool: process.env.NODE_ENV === "development" ? 'source-map' : 'eval-source-map',
    resolve: {
      extensions: ['.ts'],
    },
    externals : {
        // 'PIXI': 'pixi.js',
        'pixi.js': "PIXI"
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    plugins: [
        // new webpack.DllReferencePlugin({
        //     context: __dirname,
        //     manifest: path.join(__dirname, './public/dll/pixi.manifest.json')
        // }),
        // new AddAssetHtmlPlugin([
        //     {
        //         filepath: path.resolve(__dirname, './public/dll/*.js'),
        //         outputPath: 'dll',
        //         publicPath: 'dll'
        //     }
        // ])
    ]
  }
}