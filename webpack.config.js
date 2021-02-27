<<<<<<< HEAD
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
=======
>>>>>>> 1882f35e3900242e17621776cf66a45690e5e03b
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: [/node_modules/, /src\/three-assets/],
      },
      {
        test: /.(jpe?g|gif|png|svg|woff|ttf|wav|mp3|gltf|glb)$/i,
        type: 'asset/resource',
      },
      {
<<<<<<< HEAD
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
=======
>>>>>>> 1882f35e3900242e17621776cf66a45690e5e03b
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
<<<<<<< HEAD
  },
  plugins: [new MiniCssExtractPlugin(), new HtmlWebpackPlugin()],
=======
    publicPath: '',
  },
>>>>>>> 1882f35e3900242e17621776cf66a45690e5e03b
  devServer: {
    historyApiFallback: true,
    contentBase: path.join(__dirname, 'dist'),
  },
};
