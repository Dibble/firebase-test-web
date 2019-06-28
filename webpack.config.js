const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'public')
  },
  plugins: [
    new CopyPlugin([
      { from: 'src/index.html', to: 'index.html' }
    ])
  ]
}