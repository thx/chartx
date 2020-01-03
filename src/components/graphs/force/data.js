/**
 * 把json数据转化为关系图的数据格式
 */

import { _ } from "canvax"

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

const defaultFieldKey = '__key__';

let childrenKey = 'children';

function checkDataIsJson(data, key, _childrenField) {

    childrenKey = _childrenField;

    let result = false;

    //1、要求数据必须是一个数组
    if (!_.isArray(data)) return false;

    //2、数组中的每个元素是一个对象
    result = _.every(data, (item) => {
        return _.isObject(item);
    });

    //3、field 自动不能是数组，如果是表示已经处理过的数据
    if (result) {
        result = _.every(data, (item) => {
            return !_.isArray(item[key])
        });
    };

    //4、至少有一个元素中存在关键字
    result = _.some(data, item => {
        return childrenKey in item;
    });

    return result;
}

function jsonToArrayForRelation(data, options ,_childrenField ) {
    childrenKey = _childrenField;
    let result = [];
    const wm = new WeakMap();
    let key = options.field || defaultFieldKey;
    let label = options.node && options.node.content && options.node.content.field;

    if (!checkDataIsJson(data, key, childrenKey)) {
        console.error('该数据不能正确绘制，请提供数组对象形式的数据！');
        return result;
    };

    let childrens = [];
    let index = 0;
    

    _.each(data, _item => {
        childrens.push(_item)
    });

    if( childrens.length ){
        
        while ( childrens.length ) {
            let item = childrens.pop();
            if (!item[key]) item[key] = index;
            let _child = item[childrenKey]
            if (_child) {
                _.each(_child, ch => {
                    wm.set(ch, {
                        parentIndex: index,
                        parentNode: item
                    })
                });
                childrens = childrens.concat(_child.reverse());
            }
            let obj = {};
            _.each(item, (value, key) => {
                if (key !== childrenKey) {
                    obj[key] = value;
                }
            })
    
            result.push(obj);
    
            let myWm = wm.get(item);
    
            if (myWm) {
                let start = myWm.parentIndex;
                let startNode = myWm.parentNode
                let line = {};
                line.key = [start, index].join(',');
                if (label) {
                    line[label] = [startNode[label], item[label]].join('_');
                }
    
                result.push(line)
            }
            index++;
            
        }
    }
    
    // wm = null;
    return result;
}

function arrayToTreeJsonForRelation(data, options){
    // [ { key: 1, name: },{key:'1,2'} ] to [ { name: children: [ {}... ] } ] 
    
    let _nodes = {}
    let _edges = {}
    _.each( data, function( item ){
        let key = item[ options.field ];
        if( key.split(',').length == 1 ){
            _nodes[ key ] = item;
        } else {
            _edges[ key ] = item;
        };
    } );
    
    //先找到所有的一层
    let arr = [];
    _.each( _nodes, function( node, nkey ){
        let isFirstLev=true;
        _.each( _edges, function( edge, ekey ){
            if( ekey.split(',')[1] == nkey ){
                isFirstLev = false;
                return false;
            }
        } );
        if( isFirstLev ){
            arr.push( node );
            node.__inRelation = true;
        };
    } );

    //有了第一层就好办了
    function getChildren( list ){

        _.each( list, function( node ){
            if( node.__cycle ) return;
            let key = node[ options.field ];
            _.each( _edges, function( edge, ekey ){
                if( ekey.split(',')[0] == key ){
                    //那么说明[1] 就是自己的children
                    let childNode = _nodes[ ekey.split(',')[1] ];

                    if( childNode ){
                        if( !node.children ) node.children = [];
                        node.children.push( childNode );

                        //如果这个目标节点__inRelation已经在关系结构中
                        //那么说明形成闭环了，不需要再分析这个节点的children
                        if( childNode.__inRelation ){
                            childNode.__cycle = true;
                        };
                    }
                }
            } );
            if( node.children && node.children.length ){
                getChildren( node.children );
            };
        } );

    };

    getChildren( arr );

    return arr;
}

export {
    checkDataIsJson,
    jsonToArrayForRelation,
    arrayToTreeJsonForRelation
}; 