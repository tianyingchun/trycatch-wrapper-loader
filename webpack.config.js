// http://javascriptplayground.com/blog/2016/10/moving-to-webpack-2/
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');

module.exports = {
  devtool: "source-map", //生成sourcemap,便于开发调试
  entry: {
    'test': './test'
  },
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "dist/",
    filename: './[name]/bundle.js?[hash]',
  },
  module: {
    rules: [
      { test: /\.css$/i, use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: [{ loader: "css-loader" }] }) },
      { test: /\.less$/i, use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: "css-loader!less-loader" }) },
      { test: /\.scss$/i, use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: "css-loader!sass-loader" }) },
      { test: /\.(js|jsx)$/, use: [{ loader: 'babel-loader', options: { presets: ["es2015"] } }, { loader: 'trycatch-loader', options: { exceptionHandler: 'console.error(e);windowsendError(e)' } }], exclude: /(node_modules|bower_components)/ }
    ]
  },
  resolve: {
    modules: ['node_modules', path.resolve(__dirname, '../')],
    moduleExtensions: ["-loader"],
  },
  plugins: [
    new ExtractTextPlugin({ filename: './[name]/bundle.css?[hash]', allChunks: true })
  ]
}
