require('./stylesheets');

import { square, diag } from './es6/lib';
import treeshaking from './webpack-tree-shaking/';
import Circle from './es6/Circle.js';

require('./es6/angular.js');

var circle = new Circle();
var area = circle.area();

var sqr = square(4);

function showData(data) {
  console.log(data);
  circle.restProps();
}
//
showData(sqr, area);
