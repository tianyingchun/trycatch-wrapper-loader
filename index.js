// http://javascriptplayground.com/blog/2016/10/moving-to-webpack-2/
var jsWrap = require('./jswrap');
var loaderUtils = require("loader-utils");

module.exports = function (contents) {

  this.cacheable();

  var loaderOptions = loaderUtils.parseQuery(this.query);
  var file = this.resourcePath.replace(this.options.context, '');
  var result = jsWrap(contents, file, loaderOptions.exceptionHandler || 'console.error(e)');

  return result;
};
