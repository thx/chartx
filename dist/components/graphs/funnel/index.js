"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _classCallCheck2=_interopRequireDefault(require("@babel/runtime/helpers/classCallCheck")),_possibleConstructorReturn2=_interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn")),_getPrototypeOf2=_interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf")),_assertThisInitialized2=_interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized")),_createClass2=_interopRequireDefault(require("@babel/runtime/helpers/createClass")),_inherits2=_interopRequireDefault(require("@babel/runtime/helpers/inherits")),_canvax=_interopRequireDefault(require("canvax")),_index=_interopRequireDefault(require("../index")),_tools=require("../../../utils/tools"),_mmvis=require("mmvis"),Text=_canvax.default.Display.Text,Polygon=_canvax.default.Shapes.Polygon,FunnelGraphs=function(e){function a(e,t){var i;return(0,_classCallCheck2.default)(this,a),(i=(0,_possibleConstructorReturn2.default)(this,(0,_getPrototypeOf2.default)(a).call(this,e,t))).type="funnel",i.dataOrg=[],i.data=[],i._maxVal=null,i._minVal=null,_mmvis._.extend(!0,(0,_assertThisInitialized2.default)(i),(0,_mmvis.getDefaultProps)(a.defaultProps()),e),i.init(),i}return(0,_inherits2.default)(a,e),(0,_createClass2.default)(a,null,[{key:"defaultProps",value:function(){return{field:{detail:"字段配置",default:null},sort:{detail:"排序规则",default:null},maxNodeWidth:{detail:"最大的元素宽",default:null},minNodeWidth:{detail:"最小的元素宽",default:0},minVal:{detail:"漏斗的塔尖",default:0},node:{detail:"单个元素图形配置",propertys:{height:{detail:"高",default:0,documentation:"漏斗单元高，如果options没有设定， 就会被自动计算为 this.height/dataOrg.length"}}},label:{detail:"文本配置",propertys:{enabled:{detail:"是否开启文本",default:!0},textAlign:{detail:"文本布局位置(left,center,right)",default:"center"},textBaseline:{detail:"文本基线对齐方式",default:"middle"},format:{detail:"文本格式化处理函数",default:function(e){return(0,_tools.numAddSymbol)(e)}},fontSize:{detail:"文本字体大小",default:13},fontColor:{detail:"文本颜色",default:"#ffffff",documentation:"align为center的时候的颜色，align为其他属性时候取node的颜色"}}}}}}]),(0,_createClass2.default)(a,[{key:"init",value:function(){}},{key:"_computerAttr",value:function(){this.field&&(this.dataOrg=this.dataFrame.getFieldData(this.field)),this._maxVal=_mmvis._.max(this.dataOrg),this._minVal=_mmvis._.min(this.dataOrg),this.maxNodeWidth||(this.maxNodeWidth=.7*this.width),this.node.height||(this.node.height=this.height/this.dataOrg.length)}},{key:"draw",value:function(e){e=e||{},_mmvis._.extend(!0,this,e);this.animation&&e.resize;this._computerAttr(),this.data=this._trimGraphs(),this._drawGraphs(),this.sprite.context.x=this.origin.x+this.width/2,this.sprite.context.y=this.origin.y}},{key:"_trimGraphs",value:function(){if(this.field){var a=this,l=[];return _mmvis._.each(this.dataOrg,function(e,t){var i={type:"funnel",field:a.field,rowData:a.dataFrame.getRowDataAt(t),value:e,width:a._getNodeWidth(e),color:a.app.getTheme(t),cursor:"pointer",label:"",middlePoint:null,iNode:-1,points:[]};l.push(i)}),this.sort&&(l=l.sort(function(e,t){return"desc"==a.sort?t.value-e.value:e.value-t.value})),_mmvis._.each(l,function(e,t){e.iNode=t,e.label=a.label.format(e.value,e)}),_mmvis._.each(l,function(e,t){e.points=a._getPoints(e,l[t+1],l[t-1]),e.middlePoint={x:0,y:(e.iNode+.5)*a.node.height}}),l}}},{key:"_getNodeWidth",value:function(e){var t=this.minNodeWidth+(this.maxNodeWidth-this.minNodeWidth)/(this._maxVal-this.minVal)*(e-this.minVal);return parseInt(t)}},{key:"_getPoints",value:function(e,t,i){var a=[],l=e.iNode*this.node.height,n=l+this.node.height;if("asc"!==this.sort){a.push([-e.width/2,l]),a.push([e.width/2,l]);var r=this.minNodeWidth;t&&(r=t.width),a.push([r/2,n]),a.push([-r/2,n])}else{var s=this.minNodeWidth;i&&(s=i.width),a.push([-s/2,l]),a.push([s/2,l]),a.push([e.width/2,n]),a.push([-e.width/2,n])}return a}},{key:"_drawGraphs",value:function(){var n=this;_mmvis._.each(this.data,function(e){var t=new Polygon({context:{pointList:e.points,fillStyle:e.color,cursor:e.cursor}});n.sprite.addChild(t),t.nodeData=e,t.on(_mmvis.event.types.get(),function(e){e.eventInfo={trigger:n.node,title:n.field,nodes:[this.nodeData]},n.app.fire(e.type,e)});var i="center",a={x:e.middlePoint.x,y:e.middlePoint.y};"left"==n.label.textAlign&&(a.x=e.points[0][0]-(e.points[0][0]-e.points[3][0])/2,a.x-=15,i="right"),"right"==n.label.textAlign&&(a.x=e.points[1][0]-(e.points[1][0]-e.points[2][0])/2,a.x+=15,i="left");var l=new Text(e.label,{context:{x:a.x,y:a.y,fontSize:n.label.fontSize,fillStyle:"center"==n.label.textAlign?n.label.fontColor:e.color,textAlign:i,textBaseline:n.label.textBaseline}});n.sprite.addChild(l)})}}]),a}(_index.default);_mmvis.global.registerComponent(FunnelGraphs,"graphs","funnel");var _default2=FunnelGraphs;exports.default=_default2;