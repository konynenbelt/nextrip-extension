const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.js',
    background: './src/background.js'
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
            path.resolve(__dirname, './src'),
          ],
        loader: 'babel-loader',
        query:
        {
          presets:['react']
        }
      },
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader']
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
        inject: true,
        chunks: ['index'],
        filename: 'index.html',
        template: './public/index.html'
    }),
    new CopyWebpackPlugin([
      { from: './public/manifest.json' },
      { context: './public', from: 'favicon.ico', to: 'assets' }
    ])
  ]
};