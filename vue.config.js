const webpack = require('webpack')
const path = require('path')

module.exports = {
  publicPath: '',
  configureWebpack: {
    devtool: process.env.NODE_ENV === "development" ? 'source-map' : 'eval-source-map',
    resolve: {
      extensions: ['.ts'],
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
      
    ]
  }
}