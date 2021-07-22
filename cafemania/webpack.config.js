const path = require('path');

module.exports = {
  entry: './src/main.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.tsx', '.js' ],
    alias: {
      '@cafemania': path.join(__dirname, 'src')
    }
  },
  output: {
    filename: 'game.js',
    path: path.resolve(__dirname, '..', 'server', 'static', 'cafemania')
  },
  devtool: 'source-map',
  mode: 'development'
};