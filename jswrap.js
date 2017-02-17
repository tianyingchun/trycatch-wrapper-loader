'use strict';

var esprima = require('esprima');
var escodegen = require('escodegen');
var _ = require('lodash');
var minimatch = require('minimatch');
var chalk = require('chalk');

module.exports = function (code, file, loaderOptions) {
  var catchbody = loaderOptions.exceptionHandler || 'console.error(e)';
  var fileFormatter = 'e.position = "' + (loaderOptions.fileFormatter || '${file}#L${loc.start.line} ${loc.start.line}:${loc.end.line}') + '"';
  var globPattern = loaderOptions.glob || '**';

  // minimatch('/test/name/z.js', '/test/{name,}/**.js', {matchBase:true});
  // minimatch('/test/name/z.js', '/test/name/**', {matchBase:true});
  // Add minimatch glob pattern to limit the trycatch loader.
  if (!minimatch(file, globPattern, { matchBase: true })) {
    return code;
  } else {
    console.log(chalk.blue('[Apply trycatch-wrapper]: '), chalk.yellow(file));
  }

  _.templateSettings = {
    evaluate: /\{\{#([\s\S]+?)\}\}/g, // {{# console.log("blah") }}
    interpolate: /\{\{[^#\{]([\s\S]+?)[^\}]\}\}/g, // {{ title }}
    escape: /\{\{\{([\s\S]+?)\}\}\}/g, // {{{ title }}}
  }

  if (catchbody) {

    var astbody = JSON.stringify(esprima.parse(catchbody).body);
    var catcher = function (fn_id) {
      return JSON.parse(astbody.replace('{{fn_id}}', fn_id));
    }
  } else {
    var catcher = function () {
      return [];
    }
  }

  var root = esprima.parse(code, { sourceType: 'module', loc: true })

  var fns = []

  function isFn(el) {
    return el instanceof Object && !(el instanceof Array) &&
      (el.type === 'FunctionDeclaration' || el.type === 'FunctionExpression' || el.type === 'ArrowFunctionExpression');
  }

  function parse(root) {
    _.each(root, function (el) {
      if (isFn(el)) fns.push(el)
      if (el instanceof Object) parse(el);
    })
  }

  function strFormat(template, data) {
    var keys = Object.keys(data),
      dataList;

    dataList = keys.map(function (key) {
      return data[key]
    });

    // 这里使用反引号来构建模板引擎
    return new Function(keys.join(','), 'return `' + template + '`;')
      .apply(null, dataList);
  }

  parse(root)

  _.each(fns, function (fn, index) {
    // move nested functions outside the body
    var nestedFns = [];

    var errorPosition = esprima.parse(strFormat(fileFormatter, { file: file, loc: fn.loc }));

    _.each(fn.body.body, function (el) {
      if (isFn(el)) {
        nestedFns.push(el);
        fn.body.body = _.without(fn.body.body, el);
      };
    })

    fn.body.body = nestedFns.concat([{
      "type": "TryStatement",
      "block": {
        "type": "BlockStatement",
        "body": fn.body.body
      },
      "guardedHandlers": [],
      "handlers": [{
        "type": "CatchClause",
        "param": {
          "type": "Identifier",
          "name": "e"
        },
        "body": {
          "type": "BlockStatement",
          "body": errorPosition.body.concat(catcher(index))
        }
      }],
      "finalizer": null
    }]);
  });

  var result = escodegen.generate(root, { format: { preserveBlankLines: true } });

  return result;
};
