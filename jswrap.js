'use strict';

var esprima = require('esprima');
var escodegen = require('escodegen');
var _ = require('lodash');

module.exports = function (code, file, catchbody) {

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

  parse(root)

  _.each(fns, function (fn, index) {
    // move nested functions outside the body
    var nestedFns = [],
      errorPosition = esprima.parse('e.position = "' + file + ' ' + fn.loc.start.line + ':' + fn.loc.end.line + '"');

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
