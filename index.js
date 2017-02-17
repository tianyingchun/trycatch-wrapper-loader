// http://javascriptplayground.com/blog/2016/10/moving-to-webpack-2/
var jsWrap = require('./jswrap');
var loaderUtils = require("loader-utils");

module.exports = function (contents) {

  // In webpack2 Loaders are now cacheable by default. Loaders must opt-out if they are not cacheable.
  // this.cacheable();

  var loaderOptions = loaderUtils.parseQuery(this.query);
  var file = this.resourcePath.replace(this.options.context, '');
  var result = jsWrap(contents, file, loaderOptions);

  return result;
};
