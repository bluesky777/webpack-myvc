const path = require("path");
const webpack = require("webpack");
//const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
  entry: {
    app: "./src/app.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  devServer: {
    contentBase: path.join(__dirname, "src"),
    compress: true,
    port: 9000,
    publicPath: "/dist/",
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
        loader: "url-loader",
        options: {
          limit: 8192,
        },
      },
      {
        test: /\.html$/,
        use: "raw-loader",
      },
    ],
  },
};
