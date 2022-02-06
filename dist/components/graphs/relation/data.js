"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.arrayToTreeJsonForRelation = arrayToTreeJsonForRelation;
exports.checkDataIsJson = checkDataIsJson;
exports.jsonToArrayForRelation = jsonToArrayForRelation;

var _canvax = require("canvax");

/**
 * 把json数据转化为关系图的数据格式
 */
//判断数据是否符合json格式要求的规范，
//如：
// [{
// 	name: 'xxxx',
// 	children: [{
// 		name: 'aaaaa'
// 	}, {
// 		name: 'bbbb',
// 		children: [{
// 			name: 'ccccc'
// 		}]
// 	}],
// }];
//const parentKey = 'parent';
var defaultFieldKey = '__key__';
var childrenKey = 'children';

function checkDataIsJson(data, key, _childrenField) {
  childrenKey = _childrenField;
  var result = false; //1、要求数据必须是一个数组

  if (!_canvax._.isArray(data)) return false; //2、数组中的每个元素是一个对象

  result = _canvax._.every(data, function (item) {
    return _canvax._.isObject(item);
  }); //3、field 自动不能是数组，如果是表示已经处理过的数据

  if (result) {
    result = _canvax._.every(data, function (item) {
      return !_canvax._.isArray(item[key]);
    });
  }

  ; //4、至少有一个元素中存在关键字

  result = _canvax._.some(data, function (item) {
    return childrenKey in item;
  });
  return result;
}

function jsonToArrayForRelation(data, options, _childrenField) {
  childrenKey = _childrenField;
  var result = [];
  var wm = new WeakMap();
  var key = options.field || defaultFieldKey;
  var label = options.node && options.node.content && options.node.content.field;

  if (!checkDataIsJson(data, key, childrenKey)) {
    console.error('该数据不能正确绘制，请提供数组对象形式的数据！');
    return result;
  }

  ;
  var childrens = [];
  var index = 0;

  _canvax._.each(data, function (_item) {
    childrens.push(_item);
  });

  var _loop = function _loop() {
    var item = childrens.pop();
    if (!item[key]) item[key] = index;
    var _child = item[childrenKey];

    if (_child) {
      _canvax._.each(_child, function (ch) {
        wm.set(ch, {
          parentIndex: index,
          parentNode: item
        });
      });

      childrens = childrens.concat(_child.reverse());
    }

    var obj = {};

    _canvax._.each(item, function (value, key) {
      if (key !== childrenKey) {
        obj[key] = value;
      }
    });

    result.push(obj);
    var myWm = wm.get(item);

    if (myWm) {
      var start = myWm.parentIndex;
      var startNode = myWm.parentNode;
      var line = {};
      line.key = [start, index].join(',');

      if (label) {
        line[label] = [startNode[label], item[label]].join('_');
      }

      result.push(line);
    }

    index++;
  };

  while (childrens.length) {
    _loop();
  } // wm = null;


  return result;
}

function arrayToTreeJsonForRelation(data, options) {
  // [ { key: 1, name: },{key:'1,2'} ] to [ { name: children: [ {}... ] } ] 
  var _nodes = {};
  var _edges = {};

  _canvax._.each(data, function (item) {
    var key = item[options.field] + '';

    if (key.split(',').length == 1) {
      _nodes[key] = item;
    } else {
      _edges[key] = item;
    }

    ;
  }); //先找到所有的一层


  var arr = [];

  _canvax._.each(_nodes, function (node, nkey) {
    var isFirstLev = true;

    _canvax._.each(_edges, function (edge, ekey) {
      ekey = ekey + '';

      if (ekey.split(',')[1] == nkey) {
        isFirstLev = false;
        return false;
      }
    });

    if (isFirstLev) {
      arr.push(node);
      node.__inRelation = true;
    }

    ;
  }); //有了第一层就好办了


  function getChildren(list) {
    _canvax._.each(list, function (node) {
      if (node.__cycle) return;
      var key = node[options.field];

      _canvax._.each(_edges, function (edge, ekey) {
        ekey = ekey + '';

        if (ekey.split(',')[0] == key) {
          //那么说明[1] 就是自己的children
          var childNode = _nodes[ekey.split(',')[1]];

          if (childNode) {
            if (!node.children) node.children = [];

            if (!_canvax._.find(node.children, function (_child) {
              return _child.key == childNode.key;
            })) {
              node.children.push(childNode);
            }

            ; //node.children.push( childNode );
            //如果这个目标节点__inRelation已经在关系结构中
            //那么说明形成闭环了，不需要再分析这个节点的children

            if (childNode.__inRelation) {
              childNode.__cycle = true;
            }

            ;
          }
        }
      });

      if (node.children && node.children.length) {
        getChildren(node.children);
      }

      ;
    });
  }

  ;
  getChildren(arr);
  return arr;
}