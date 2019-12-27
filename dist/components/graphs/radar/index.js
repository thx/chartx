"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _classCallCheck2=_interopRequireDefault(require("@babel/runtime/helpers/classCallCheck")),_possibleConstructorReturn2=_interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn")),_getPrototypeOf2=_interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf")),_assertThisInitialized2=_interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized")),_createClass2=_interopRequireDefault(require("@babel/runtime/helpers/createClass")),_inherits2=_interopRequireDefault(require("@babel/runtime/helpers/inherits")),_canvax=_interopRequireDefault(require("canvax")),_index=_interopRequireDefault(require("../index")),_mmvis=require("mmvis"),Polygon=_canvax.default.Shapes.Polygon,Circle=_canvax.default.Shapes.Circle,RadarGraphs=function(e){function a(e,t){var i;return(0,_classCallCheck2.default)(this,a),(i=(0,_possibleConstructorReturn2.default)(this,(0,_getPrototypeOf2.default)(a).call(this,e,t))).type="radar",i.enabledField=null,i.groups={},_mmvis._.extend(!0,(0,_assertThisInitialized2.default)(i),(0,_mmvis.getDefaultProps)(a.defaultProps()),e),i.init(),i}return(0,_inherits2.default)(a,e),(0,_createClass2.default)(a,null,[{key:"defaultProps",value:function(){return{field:{detail:"字段配置",default:null},line:{detail:"线配置",propertys:{enabled:{detail:"是否显示",default:!0},lineWidth:{detail:"线宽",default:2},strokeStyle:{detail:"线颜色",default:null}}},area:{detail:"面积区域配置",propertys:{enabled:{detail:"是否显示",default:!0},fillStyle:{detail:"面积背景色",default:null},fillAlpha:{detail:"面积透明度",default:.1}}},node:{detail:"线上面的单数据节点图形配置",propertys:{enabled:{detail:"是否显示",default:!0},strokeStyle:{detail:"边框色",default:"#ffffff"},radius:{detail:"半径",default:4},lineWidth:{detail:"边框大小",default:1}}}}}}]),(0,_createClass2.default)(a,[{key:"init",value:function(){}},{key:"draw",value:function(e){e=e||{};_mmvis._.extend(!0,this,e),this.data=this._trimGraphs(),this._widget(),this.sprite.context.x=this.origin.x,this.sprite.context.y=this.origin.y,this.fire("complete")}},{key:"_widget",value:function(){var u=this,d=this.app.getComponent({name:"coord"}),f=0;_mmvis._.each(this.data,function(e,t){var i={},a=[];_mmvis._.each(e,function(e,t){a.push([e.point.x,e.point.y])});var l=d.getFieldMapOf(t),n=u._getStyle(u.line.strokeStyle,f,l.color,l),r={pointList:a,cursor:"pointer"};u.line.enabled&&(r.lineWidth=u.line.lineWidth,r.strokeStyle=n),u.area.enabled&&(r.fillStyle=u._getStyle(u.area.fillStyle,f,l.color,l),r.fillAlpha=u._getStyle(u.area.fillAlpha,f,1,l));var o=new Polygon({hoverClone:!1,context:r});if(i.area=o,u.sprite.addChild(o),o.__hoverFillAlpha=o.context.fillAlpha+.2,o.__fillAlpha=o.context.fillAlpha,o.on(_mmvis.event.types.get(),function(e){"mouseover"==e.type&&(this.context.fillAlpha=this.__hoverFillAlpha),"mouseout"==e.type&&(this.context.fillAlpha=this.__fillAlpha),u.app.fire(e.type,e)}),u.node.enabled){var s=[];_mmvis._.each(e,function(e,t){a.push([e.point.x,e.point.y]);var i=new Circle({context:{cursor:"pointer",x:e.point.x,y:e.point.y,r:u.node.radius,lineWidth:u.node.lineWidth,strokeStyle:u.node.strokeStyle,fillStyle:n}});u.sprite.addChild(i),i.iNode=t,i.nodeData=e,i._strokeStyle=n,i.on(_mmvis.event.types.get(),function(e){e.aAxisInd=this.iNode,e.eventInfo={trigger:u.node,nodes:[this.nodeData]},u.app.fire(e.type,e)}),s.push(i)}),i.nodes=s}u.groups[t]=i,f++})}},{key:"tipsPointerOf",value:function(e){var a=this;a.tipsPointerHideOf(e),e.eventInfo&&e.eventInfo.nodes&&_mmvis._.each(e.eventInfo.nodes,function(i){a.data[i.field]&&_mmvis._.each(a.data[i.field],function(e,t){i.iNode==t&&a.focusOf(e)})})}},{key:"tipsPointerHideOf",value:function(){var i=this;_mmvis._.each(i.data,function(e,t){_mmvis._.each(e,function(e){i.unfocusOf(e)})})}},{key:"focusOf",value:function(e){if(!e.focused){var t=this.groups[e.field].nodes[e.iNode];t.context.r+=1,t.context.fillStyle=this.node.strokeStyle,t.context.strokeStyle=t._strokeStyle,e.focused=!0}}},{key:"unfocusOf",value:function(e){if(e.focused){var t=this.groups[e.field].nodes[e.iNode];--t.context.r,t.context.fillStyle=t._strokeStyle,t.context.strokeStyle=this.node.strokeStyle,e.focused=!1}}},{key:"hide",value:function(e){var t=this.app.getComponent({name:"coord"});this.enabledField=t.filterEnabledFields(this.field);var i=this.groups[e];i&&(i.area.context.visible=!1,_mmvis._.each(i.nodes,function(e){e.context.visible=!1}))}},{key:"show",value:function(e){var t=this.app.getComponent({name:"coord"});this.enabledField=t.filterEnabledFields(this.field);var i=this.groups[e];i&&(i.area.context.visible=!0,_mmvis._.each(i.nodes,function(e){e.context.visible=!0}))}},{key:"_trimGraphs",value:function(){var s=this,u=this.app.getComponent({name:"coord"});this.enabledField=u.filterEnabledFields(this.field);var e={};return _mmvis._.each(this.enabledField,function(l){var n=s.dataFrame.getFieldData(l),r=u.getFieldMapOf(l),o=[];_mmvis._.each(u.aAxis.angleList,function(e,t){var i=Math.PI*e/180,a=u.getPointInRadianOfR(i,u.getROfNum(n[t]));o.push({type:"radar",field:l,iNode:t,rowData:s.dataFrame.getRowDataAt(t),focused:!1,value:n[t],point:a,color:r.color})}),e[l]=o}),e}},{key:"_getStyle",value:function(e,t,i,a){var l=i;return(_mmvis._.isString(e)||_mmvis._.isNumber(e))&&(l=e),_mmvis._.isArray(e)&&(l=e[t]),_mmvis._.isFunction(e)&&(l=e(t,a)),null==l&&(l=i),l}},{key:"getNodesAt",value:function(a){var l=this.data,n=[];return _mmvis._.each(this.enabledField,function(e,t){if(_mmvis._.isArray(e))_mmvis._.each(e,function(e,t){var i=l[e][a];i&&n.push(i)});else{var i=l[e][a];i&&n.push(i)}}),n}}]),a}(_index.default);_mmvis.global.registerComponent(RadarGraphs,"graphs","radar");var _default=RadarGraphs;exports.default=_default;