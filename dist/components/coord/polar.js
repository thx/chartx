"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _classCallCheck2=_interopRequireDefault(require("@babel/runtime/helpers/classCallCheck")),_possibleConstructorReturn2=_interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn")),_getPrototypeOf2=_interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf")),_assertThisInitialized2=_interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized")),_createClass2=_interopRequireDefault(require("@babel/runtime/helpers/createClass")),_inherits2=_interopRequireDefault(require("@babel/runtime/helpers/inherits")),_index=_interopRequireDefault(require("./index")),_canvax=_interopRequireDefault(require("canvax")),_grid=_interopRequireDefault(require("./polar/grid")),_mmvis=require("mmvis"),Polar=function(t){function a(t,i){var e;return(0,_classCallCheck2.default)(this,a),(e=(0,_possibleConstructorReturn2.default)(this,(0,_getPrototypeOf2.default)(a).call(this,t,i))).type="polar",_mmvis._.extend(!0,(0,_assertThisInitialized2.default)(e),(0,_mmvis.getDefaultProps)(a.defaultProps()),e.setDefaultOpt(t,i)),e.init(t),e}return(0,_inherits2.default)(a,t),(0,_createClass2.default)(a,null,[{key:"defaultProps",value:function(){return{allAngle:{detail:"坐标系总角度",documentation:"",default:360,values:[0,360]},startAngle:{detail:"坐标系起始角度",documentation:"",default:0,values:[0,360]},radius:{detail:"坐标系的最大半径",documentation:"默认自动计算view的高宽，如果squareRange==true，则会取Math.min(width,height)",default:"auto",values:null},aAxis:{detail:"角度轴",documentation:"类似直角坐标系中的x轴",propertys:{data:[],angleList:[],layoutData:[],field:{detail:"数据字段",documentation:"",default:""},layoutType:{detail:"布局类型",documentation:"",default:"proportion"},beginAngle:{detail:"起始角度",documentation:"",default:-90},enabled:{detail:"是否显示",documentation:"",default:!1},label:{detail:"文本配置",documentation:"",propertys:{enabled:{detail:"是否显示",documentation:"",default:!0},format:{detail:"label的格式化处理函数",documentation:"",default:null},fontColor:{detail:"label颜色",documentation:"",default:"#666"}}}}},rAxis:{detail:"半径维度轴",documentation:"类似直角坐标系中的y轴维度",propertys:{field:{detail:"数据字段",documentation:"",default:""},dataSection:{detail:"轴的显示数据",documentation:"默认根据源数据中自动计算，用户也可以手动指定",default:!1},enabled:{detail:"是否显示",documentation:"",default:!1}}}}}}]),(0,_createClass2.default)(a,[{key:"setDefaultOpt",value:function(t,i){var e={rAxis:{field:[]},aAxis:{},grid:{}};_mmvis._.extend(!0,e,t),_mmvis._.isArray(e.rAxis.field)||(e.rAxis.field=[e.rAxis.field]);var a=_mmvis._.flatten([i._opt.graphs]),n=[];return _mmvis._.each(a,function(t){if(t.field){var i=t.field;_mmvis._.isArray(i)||(i=[i]),n=n.concat(i)}}),e.rAxis.field=e.rAxis.field.concat(n),t.aAxis&&t.aAxis.field?e.aAxis.enabled=!0:e.grid.enabled=!1,e}},{key:"init",value:function(){this._initModules(),this.fieldsMap=this.setFieldsMap({type:"rAxis"})}},{key:"_initModules",value:function(){this.grid.enabled&&(this._grid=new _grid.default(this.grid,this),this.sprite.addChild(this._grid.sprite)),this.aAxis.enabled&&this.grid.enabled&&(this._aAxisScaleSp=new _canvax.default.Display.Sprite({id:"aAxisScaleSp"}),this.sprite.addChild(this._aAxisScaleSp)),this._axiss.push({type:"rAxis",field:this.rAxis.field})}},{key:"draw",value:function(){this._computeAttr(),this.rAxis.dataSection=this._getRDataSection(),this.aAxis.data=this.app.dataFrame.getFieldData(this.aAxis.field),this._setAAxisAngleList(),this.grid.enabled&&(this._grid.draw({pos:this.origin,width:this.width,height:this.height,dataSection:this.rAxis.dataSection},this),this.aAxis.enabled&&this._drawAAxis(),this._initInduce())}},{key:"resetData",value:function(){}},{key:"changeFieldEnabled",value:function(t){this.setFieldEnabled(t),this.rAxis.dataSection=this._getRDataSection(),this.aAxis.data=this.app.dataFrame.getFieldData(this.aAxis.field),this.grid.enabled&&this._grid.reset({dataSection:this.rAxis.dataSection},this)}},{key:"_getRDataSection",value:function(){var i=this;if(this._opt.rAxis&&this._opt.rAxis.dataSection)return this._opt.rAxis.dataSection;var e=[];return _mmvis._.each(_mmvis._.flatten([i.rAxis.field]),function(t){e=e.concat(i.app.dataFrame.getFieldData(t))}),e.push(0),_mmvis.dataSection.section(e,3)}},{key:"_computeAttr",value:function(){var t,i,e=this.app.padding,a=this.app.width,n=this.app.height;"width"in this._opt||(this.width=a-e.left-e.right),"height"in this._opt||(this.height=n-e.top-e.bottom);for(var s=this.width,r=this.height,l=0,o=0,h=0,u=0,d=[this.startAngle],c=0,f=parseInt((this.startAngle+this.allAngle)/90)-parseInt(this.startAngle/90);c<=f;c++){var p=90*parseInt(this.startAngle/90)+90*c;-1==_mmvis._.indexOf(d,p)&&p>d.slice(-1)[0]&&d.push(p)}var g=this.startAngle+this.allAngle;-1==_mmvis._.indexOf(d,g)&&d.push(g),_mmvis._.each(d,function(t){t%=360;var i=Math.sin(t*Math.PI/180);180==t&&(i=0);var e=Math.cos(t*Math.PI/180);270!=t&&90!=t||(e=0),l=Math.min(l,i),o=Math.max(o,i),h=Math.min(h,e),u=Math.max(u,e)}),i=(Math.abs(h)+Math.abs(u))/(Math.abs(l)+Math.abs(o));var x=Math.min(s,r);if(1==i)s=r=x;else{var _=r*i;s<_?r=s/i:s=_}var v=e.left+(this.width-s)/2,m=e.top+(this.height-r)/2;this.origin={x:v+s*(h/(h-u)),y:m+r*(l/(l-o))};var A={top:this.origin.y-m,right:v+s-this.origin.x,bottom:m+r-this.origin.y,left:this.origin.x-v},y=[],b=[["right","bottom"],["bottom","left"],["left","top"],["top","right"]];_mmvis._.each(d,function(t){t%=360;var i=parseInt(t/90),e=b[i];t%90==0&&(e=[["right","bottom","left","top"][i]]);var a=Math.sin(t*Math.PI/180);180==t&&(a=0);var n=Math.cos(t*Math.PI/180);270!=t&&90!=t||(n=0),_mmvis._.each(e,function(t){var i;"top"!=t&&"bottom"!=t||a&&(i=Math.abs(A[t]/a)),"right"!=t&&"left"!=t||n&&(i=Math.abs(A[t]/n)),y.push(i)})}),t=_mmvis._.min(y),this.aAxis.label.enabled&&(t-=20),this.radius=t}},{key:"getMaxDisToViewOfOrigin",value:function(){var t=this.origin,i=this.app.padding,e=this.app.width,a=this.app.height,n=e-i.left-i.right,s=a-i.top-i.bottom,r=[t.x-i.left,n+i.left-t.x,t.y-i.top,s+i.top-t.y];return _mmvis._.max(r)}},{key:"getRadiansAtR",value:function(t,i,e){var n=this;null==i&&(i=this.width),null==e&&(e=this.height);var a,s,r=[],l=this.app.padding,o={x:this.origin.x-l.left-(this.width-i)/2,y:this.origin.y-l.top-(this.height-e)/2},h=o.y;h<t&&(a=Math.sqrt(Math.pow(t,2)-Math.pow(h,2)),r=r.concat(this._filterPointsInRect([{x:-a,y:-h},{x:a,y:-h}],o,i,e)));var u=i-o.x;u<t&&(s=Math.sqrt(Math.pow(t,2)-Math.pow(u,2)),r=r.concat(this._filterPointsInRect([{x:u,y:-s},{x:u,y:s}],o,i,e)));var d=e-o.y;d<t&&(a=Math.sqrt(Math.pow(t,2)-Math.pow(d,2)),r=r.concat(this._filterPointsInRect([{x:a,y:d},{x:-a,y:d}],o,i,e)));var c=o.x;c<t&&(s=Math.sqrt(Math.pow(t,2)-Math.pow(c,2)),r=r.concat(this._filterPointsInRect([{x:-c,y:s},{x:-c,y:-s}],o,i,e)));var f=[];0==r.length?f.push([{point:{x:t,y:0},radian:0},{point:{x:t,y:0},radian:2*Math.PI}]):_mmvis._.each(r,function(t,i){var e=i==r.length-1?0:i+1,a=r.slice(e,e+1)[0];f.push([{point:t,radian:n.getRadianInPoint(t)},{point:a,radian:n.getRadianInPoint(a)}])});for(var p=0,g=f.length;p<g;p++)this._checkArcInRect(f[p],t,o,i,e)||(f.splice(p,1),p--,g--);return f}},{key:"_filterPointsInRect",value:function(t,i,e,a){for(var n=0,s=t.length;n<s;n++)this._checkPointInRect(t[n],i,e,a)||(t.splice(n,1),n--,s--);return t}},{key:"_checkPointInRect",value:function(t,i,e,a){var n=t.x+i.x,s=t.y+i.y;return!(n<0||e<n||s<0||a<s)}},{key:"_checkArcInRect",value:function(t,i,e,a,n){var s=t[0],r=t[1],l=r.radian-s.radian;r.radian<s.radian&&(l=2*Math.PI+r.radian-s.radian);var o=(s.radian+l/2)%(2*Math.PI);return this._checkPointInRect(this.getPointInRadianOfR(o,i),e,a,n)}},{key:"getRadianInPoint",value:function(t){var i=2*Math.PI;return(Math.atan2(t.y,t.x)+i)%i}},{key:"getPointInRadianOfR",value:function(t,i){var e=Math.PI,a=Math.cos(t)*i;t!=e/2&&t!=3*e/2||(a=0);var n=Math.sin(t)*i;return t%e==0&&(n=0),{x:a,y:n}}},{key:"getROfNum",value:function(t){var i=_mmvis._.max(this.rAxis.dataSection);return this.radius*((t-0)/(i-0))}},{key:"getPointsOfR",value:function(a){var n=this,s=[];return _mmvis._.each(n.aAxis.angleList,function(t){var i=Math.PI*t/180,e=n.getPointInRadianOfR(i,a);s.push(e)}),s}},{key:"_setAAxisAngleList",value:function(){var e=this;e.aAxis.angleList=[];var t=this.aAxis.data;if("proportion"==this.aAxis.layoutType){t=[];for(var i=0,a=this.aAxis.data.length;i<a;i++)t.push(i)}var n=this.allAngle,s=_mmvis._.max(t);"proportion"==this.aAxis.layoutType&&s++,_mmvis._.each(t,function(t){var i=(n*((t-0)/(s-0))+e.aAxis.beginAngle+n)%n;e.aAxis.angleList.push(i)})}},{key:"_drawAAxis",value:function(){var r=this,t=r.getROfNum(_mmvis._.max(this.rAxis.dataSection)),l=r.getPointsOfR(t+3);r._aAxisScaleSp.context.x=this.origin.x,r._aAxisScaleSp.context.y=this.origin.y,_mmvis._.each(this.aAxis.data,function(t,i){var e=l[i],a=_mmvis._.isFunction(r.aAxis.label.format)?r.aAxis.label.format(t):t,n={value:t,text:a,iNode:i,field:r.aAxis.field};if(r._getProp(r.aAxis.label.enabled,n)){var s={x:e.x,y:e.y,fillStyle:r._getProp(r.aAxis.label.fontColor,n)};_mmvis._.extend(s,r._getTextAlignForPoint(Math.atan2(e.y,e.x))),r._aAxisScaleSp.addChild(new _canvax.default.Display.Text(a,{context:s})),r.aAxis.layoutData.push(a)}})}},{key:"_getTextAlignForPoint",value:function(t){var i="center",e="bottom";return t>-Math.PI/2&&t<0&&(i="left",e="bottom"),0==t&&(i="left",e="middle"),0<t&&t<Math.PI/2&&(i="left",e="top"),t==Math.PI/2&&(i="center",e="top"),t>Math.PI/2&&t<Math.PI&&(i="right",e="top"),t!=Math.PI&&t!=-Math.PI||(i="right",e="middle"),t>-Math.PI&&t<-Math.PI/2&&(i="right",e="bottom"),{textAlign:i,textBaseline:e}}},{key:"getAxisNodeOf",value:function(t){var i=this.getAAxisIndOf(t);if(void 0!==i)return{ind:i,value:this.aAxis.data[i],text:this.aAxis.layoutData[i],angle:this.aAxis.angleList[i]}}},{key:"getAAxisIndOf",value:function(t){var n=this;if(void 0!==t.aAxisInd)return t.aAxisInd;if(n.aAxis.angleList.length){var i=t.point,s=(180*n.getRadianInPoint(i)/Math.PI-n.aAxis.beginAngle)%n.allAngle,r=(Math.sqrt(Math.pow(i.x,2)+Math.pow(i.y,2)),0),l=n.aAxis.angleList.length;return _mmvis._.each(n.aAxis.angleList,function(t,i){t=(t-n.aAxis.beginAngle)%n.allAngle;var e=i+1,a=(n.aAxis.angleList[e]-n.aAxis.beginAngle)%n.allAngle;if(i==l-1&&(e=0,a=n.allAngle),t<=s&&s<=a)return r=s-t<a-s?i:e,!1}),r}}},{key:"_initInduce",value:function(){var i=this;i.induce=this._grid.induce,i.induce&&i.induce.on(_mmvis.event.types.get(),function(t){i.fire(t.type,t),i.app.fire(t.type,t)})}},{key:"getTipsInfoHandler",value:function(t){var i=this.getAxisNodeOf(t),e={nodes:[]};return i&&(e.aAxis=i,e.title=i.text,e.iNode=i.ind),t.eventInfo&&(e=_mmvis._.extend(e,t.eventInfo)),e}},{key:"getPoint",value:function(){}},{key:"getSizeAndOrigin",value:function(){}},{key:"_getProp",value:function(t,i,e){var a=t;return _mmvis._.isFunction(t)&&(a=t.apply(this,[i])),!a&&e&&(a=e),a}}]),a}(_index.default);_mmvis.global.registerComponent(Polar,"coord","polar");var _default=Polar;exports.default=_default;