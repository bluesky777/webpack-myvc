const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
  entry: {
    app: './src/app.js',
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
        title: 'Production',
        template: 'src/index.html'
    }),
    new MiniCssExtractPlugin(),
    new copyWebpackPlugin({
      patterns: [
        { from: 'src/views', to: 'views' },
        { from: 'src/fonts', to: 'fonts' },
        { from: 'src/images', to: 'images' },
        { from: 'src/styles', to: 'styles' },
      ]
    })
  ],
  module: {
    rules: [

    ],
  },
};
