// electron/webpack.electron.config.js
// Webpack configuration for Electron main process

const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'electron-main',
  entry: './main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.bundle.js'
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.json']
  },
  node: {
    __dirname: false,
    __filename: false
  }
};