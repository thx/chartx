/**
 * 把json数据转化为关系图的数据格式
 */

import { _ } from "mmvis"



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

const childrenKey = 'children';
const defaultFieldKey = '__key__';

function checkData(data, key) {
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
    }

    return result;

}

function jsonToArrayForRelation(data, options) {
    let result = [];
    const wm = new WeakMap();
    let key = options.field || defaultFieldKey;
    let label = options.node && options.node.content && options.node.content.field;

    if (!checkData(data, key)) {
        console.error('该数据不能正确绘制，请提供数组对象形式的数据！');
        return result;
    }



    let childrens = [];
    let index = 0;
    let item = undefined;

    _.each(data, item => {
        childrens.push(item)
    });

    while (item = childrens.pop()) {
        if (!item[key]) item[key] = index;
        let _child = item[childrenKey]
        if (_child) {
            _.each(_child, ch => {
                wm.set(ch, {
                    parentIndex: index,
                    parentNode: item
                })
            });
            childrens = childrens.concat(_child);
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
            line.key = [start, index];
            if (label) {
                line[label] = [startNode[label], item[label]].join('_');
            }

            result.push(line)
        }
        index++;
    }
   // wm = null;
    return result;

}



export {
    checkData,
    jsonToArrayForRelation
}; 