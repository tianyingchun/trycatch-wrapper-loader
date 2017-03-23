// http://javascriptplayground.com/blog/2016/10/moving-to-webpack-2/
// https://webpack.js.org/guides/migrating/
var path = require('path');
var webpack = require("webpack");
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var bannerText = `
/*!
* trycatch-wrapper-loader authored by tianyingchun
* http://github.com/tianyingchun
*
* Released under the MIT license
* Date: 2017-01-07
*/
`;
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
      { test: /\.css$/i, use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: [{ loader: "css-loader", options: { minimize: true } }] }) },
      { test: /\.less$/i, use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: ["css-loader?" + JSON.stringify({ minimize: true }), "less-loader"] }) },
      { test: /\.scss$/i, use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: "css-loader!sass-loader" }) },
      // For testing purpose, use local loader :`loader: path.join(__dirname, 'index.js')`
      {
        test: /\.(js|jsx)$/,
        use: [{
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              ['es2015', { modules: false }]
            ],
          }
        }, { loader: path.join(__dirname, 'index.js'), options: { exceptionHandler: 'console.error(e);windowsendError(e)', glob: '/test/es6/**', fileFormatter: '${file}#L${loc.start.line} ${loc.start.line}:${loc.end.line}' } }],
        exclude: /(node_modules|bower_components)/
      }
    ]
  },
  resolve: {
    modules: ['node_modules', path.resolve(__dirname, '../')],
    moduleExtensions: ["-loader"],
  },
  plugins: [
    new webpack.BannerPlugin({ banner: bannerText, raw: true, entryOnly: true }),
    new ExtractTextPlugin({ filename: './[name]/bundle.css?[hash]', allChunks: true })
  ]
}
