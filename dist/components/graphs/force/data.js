"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.checkDataIsJson=checkDataIsJson,exports.jsonToArrayForRelation=jsonToArrayForRelation,exports.arrayToTreeJsonForRelation=arrayToTreeJsonForRelation;var _mmvis=require("mmvis"),parentKey="parent",defaultFieldKey="__key__",childrenKey="children";function checkDataIsJson(e,n,r){childrenKey=r;return!!_mmvis._.isArray(e)&&(_mmvis._.every(e,function(e){return _mmvis._.isObject(e)})&&_mmvis._.every(e,function(e){return!_mmvis._.isArray(e[n])}),_mmvis._.some(e,function(e){return childrenKey in e}))}function jsonToArrayForRelation(e,n,r){childrenKey=r;var a=[],c=new WeakMap,s=n.field||defaultFieldKey,_=n.node&&n.node.content&&n.node.content.field;if(!checkDataIsJson(e,s,childrenKey))return console.error("该数据不能正确绘制，请提供数组对象形式的数据！"),a;var l=[],u=0,v=void 0;_mmvis._.each(e,function(e){l.push(e)});for(var i=function(){v[s]||(v[s]=u);var e=v[childrenKey];e&&(_mmvis._.each(e,function(e){c.set(e,{parentIndex:u,parentNode:v})}),l=l.concat(e.reverse()));var r={};_mmvis._.each(v,function(e,n){n!==childrenKey&&(r[n]=e)}),a.push(r);var n=c.get(v);if(n){var i=n.parentIndex,o=n.parentNode,t={};t.key=[i,u].join(","),_&&(t[_]=[o[_],v[_]].join("_")),a.push(t)}u++};v=l.pop();)i();return a}function arrayToTreeJsonForRelation(e,r){var t={},a={};_mmvis._.each(e,function(e){var n=e[r.field];1==n.split(",").length?t[n]=e:a[n]=e});var n=[];return _mmvis._.each(t,function(e,r){var i=!0;_mmvis._.each(a,function(e,n){if(n.split(",")[1]==r)return i=!1}),i&&(n.push(e),e.__inRelation=!0)}),function n(e){_mmvis._.each(e,function(i,e){if(!i.__cycle){var o=i[r.field];_mmvis._.each(a,function(e,n){if(n.split(",")[0]==o){var r=t[n.split(",")[1]];r&&(i.children||(i.children=[]),i.children.push(r),r.__inRelation&&(r.__cycle=!0))}}),i.children&&i.children.length&&n(i.children)}})}(n),n}