const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const CopyPlugin = require("copy-webpack-plugin");
const port = process.env.PORT || 3001;
const ASSET_PATH = process.env.ASSET_PATH || "/";

module.exports = {
  // Webpack configuration goes here
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, "build"),
    publicPath: ASSET_PATH,
    filename: "[name].bundle.js"
  },
  devtool: "source-map",
  module: {
    rules: [
      // First Rule
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        },
        resolve: {
          extensions: ["", ".js", ".jsx"]
        }
      },

      // Second Rule
      {
        test: /\.css$/,
        use: ["style-loader", { loader: "css-loader", options: { sourceMap: true } }]
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
        loader: "file-loader",
        options: {
          name: "[path][name].[ext]"
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    }),
    new ESLintPlugin(),
    new Dotenv(),
    new CopyPlugin({
      patterns: [
        { from: "public/assets", to: "assets" } //to the  root directory
      ]
    })
  ],
  devServer: {
    host: "localhost",
    port: port,
    historyApiFallback: true,
    open: true
  }
};
