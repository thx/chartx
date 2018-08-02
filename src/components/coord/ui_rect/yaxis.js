import Canvax from "canvax"
import {numAddSymbol} from "../../../utils/tools"
import DataSection from "../../../utils/datasection"

const Line = Canvax.Shapes.Line;
const _ = Canvax._;

export default class yAxis extends Canvax.Event.EventDispatcher
{
	constructor( opt, data ){

        super();

        this._opt = opt;
        
        this.width   = null; //第一次计算后就会有值
        this.yMaxHeight = 0; //y轴最大高
        this.height = 0; //y轴第一条线到原点的高

        this.maxW    = 0;    //最大文本的 width
        this.field   = [];   //这个 轴 上面的 field 不需要主动配置。可以从graphs中拿

        this.title  = {
            content    : "",
            shapeType  : "text",
            fontColor  : '#999',
            fontSize   : 12,
            offset   : 2,
            textAlign  : "center",
            textBaseline : "middle",
            strokeStyle : null,
            lineHeight : 0
        };
        this._title = null; //this.label对应的文本对象

        this.enabled = true;
        this.tickLine= {//刻度线
            enabled      : 1,
            lineWidth    : 1, //线宽
            lineLength   : 4, //线长
            strokeStyle  : '#cccccc',
            distance     : 2
        };
        this.axisLine = {//轴线
            enabled      : 1,     
            lineWidth    : 1,
            strokeStyle  : '#cccccc'
        };
        this.label = {
            enabled      : 1,
            fontColor    : '#999',
            fontSize     : 12,
            format       : null,
            rotation     : 0,
            distance     : 3, //和刻度线的距离,
            textAlign    : null,//"right",
            lineHeight   : 1
        };
        
        if( opt.isH && (!opt.label || opt.label.rotaion === undefined) ){
            //如果是横向直角坐标系图
            this.label.rotation = 90;
        };

        this.pos = {
            x: 0,
            y: 0
        };
        this.align = "left"; //yAxis轴默认是再左边，但是再双轴的情况下，可能会right
        
        this.layoutData = []; //dataSection 对应的layout数据{y:-100, value:'1000'}
        this.dataSection = []; //从原数据 dataOrg 中 结果 datasection 重新计算后的数据
        this.waterLine = null; //水位data，需要混入 计算 dataSection， 如果有设置waterLineData， dataSection的最高水位不会低于这个值

        //默认的 dataSectionGroup = [ dataSection ], dataSection 其实就是 dataSectionGroup 去重后的一维版本
        this.dataSectionGroup = []; 

        //如果middleweight有设置的话 dataSectionGroup 为被middleweight分割出来的n个数组>..[ [0,50 , 100],[100,500,1000] ]
        this.middleweight = null; 

        this.dataOrg = data.org || []; //源数据

        this.sprite = null;
        
        this.baseNumber = null; //默认为0，如果dataSection最小值小于0，则baseNumber为最小值，如果dataSection最大值大于0，则baseNumber为最大值
        this.basePoint = null; //value为 baseNumber 的point {x,y}
        this.min = null; 
        this.max = null; //后面加的，目前还没用

        this._yOriginTrans = 0;//当设置的 baseNumber 和datasection的min不同的时候，
        

        //过滤器，可以用来过滤哪些yaxis 的 节点是否显示已经颜色之类的
        //@params params包括 dataSection , 索引index，txt(canvax element) ，line(canvax element) 等属性
        this.filter = null; //function(params){}; 

        this.isH = false; //是否横向

        this.animation = true;

        this.sort = null; //"asc" //排序，默认从小到大, desc为从大到小，之所以不设置默认值为asc，是要用null来判断用户是否进行了配置

        this.layoutType = "proportion"; // rule , peak, proportion

        this.init(opt, data );

        this._getName();
    }

    init(opt, data )
    {
        _.extend(true , this, opt);

        //extend会设置好this.field
        //先要矫正子啊field确保一定是个array
        if( !_.isArray(this.field) ){
            this.field = [this.field];
        };

        this._initData();

        this.sprite = new Canvax.Display.Sprite({
            id: "yAxisSprite_"+new Date().getTime()
        });
        this.rulesSprite = new Canvax.Display.Sprite({
            id: "yRulesSprite_"+new Date().getTime()
        });
        this.sprite.addChild( this.rulesSprite );
    }

    //配置和数据变化
    resetData( dataFrame )
    {
        this.dataSection = [];
        this.dataSectionGroup = [];

        if( dataFrame && dataFrame.field ){
            this.field = dataFrame.field;
        }

        if( dataFrame && dataFrame.org ){
            this.dataOrg = dataFrame.org; //这里必须是data.org
        };
        
        this._initData();

        this._trimYAxis();
        this._widget();
    }

    setX($n)
    {
        this.sprite.context.x = $n;
        this.pos.x = $n;
    }

    setY($n)
    {
        this.sprite.context.y = $n;
        this.pos.y = $n;
    }

    //目前和xAxis一样
    _getName() 
    {
        if ( this.title.content ) {
            if( !this._title ){
                var rotation = 0;
                if( this.align == "left" ){
                    rotation = -90;
                } else {
                    rotation = 90;
                    if( this.isH ){
                        rotation = 270;
                    }
                };
                this._title = new Canvax.Display.Text(this.title.content, {
                    context: {
                        fontSize: this.title.fontSize,
                        textAlign: this.title.textAlign,  //"center",//this.isH ? "center" : "left",
                        textBaseline: this.title.textBaseline,//"middle", //this.isH ? "top" : "middle",
                        fillStyle: this.title.fontColor,
                        strokeStyle: this.title.strokeStyle,
                        lineWidth : this.title.lineWidth,
                        rotation: rotation
                    }
                });
            } else {
                this._title.resetText( this.title.content );
            }
        }
    }

    draw(opt)
    {
        !opt && (opt ={});
        opt && _.extend(true, this, opt);
        
        this.height = parseInt( this.yMaxHeight - this._getYAxisDisLine() );
        
        this._trimYAxis();
        this._widget( opt );

        this.setX(this.pos.x);
        this.setY(this.pos.y);


    }

    //更具y轴的值来输出对应的在y轴上面的位置
    getYposFromVal( val )
    {

        var y = 0;
        var dsgLen = this.dataSectionGroup.length;
        var yGroupHeight = this.height / dsgLen ;

        for( var i=0,l=dsgLen ; i<l ; i++ ){
            var ds = this.dataSectionGroup[i];
            var min = _.min(ds);
            var max = _.max(ds);
            var valInd = _.indexOf(ds , val);

            if( (val >= min && val <= max) || valInd >= 0 ){
                if( this.layoutType == "proportion" ){
                    var _baseNumber = this.baseNumber;
                    //如果 baseNumber 并不在这个区间
                    if( _baseNumber < min || _baseNumber > max ){
                        _baseNumber = min;
                    } else {
                        //如果刚好在这个区间Group

                    }
                    var maxGroupDisABS = Math.max( Math.abs( max-_baseNumber ) , Math.abs( _baseNumber-min ) );
                    var amountABS = Math.abs( max - min );
                    var h = (maxGroupDisABS/amountABS) * yGroupHeight;
                    y = (val - _baseNumber) / maxGroupDisABS * h + i*yGroupHeight;
                    
                    if( isNaN(y) ){
                        y = i*yGroupHeight;
                    }
                }
                if( this.layoutType == "rule" ){
                    //line 的xaxis就是 rule
                    y = valInd / (ds.length - 1) * yGroupHeight;
                }
                if( this.layoutType == "peak" ){
                    //bar的xaxis就是 peak
                    y = ( yGroupHeight/ds.length ) * (valInd+1) - ( yGroupHeight/ds.length )/2;
                }

                y += this._yOriginTrans;
                break;
            }
        };

        if( isNaN(y) ){
            y = 0;
        };
        
        return -Math.abs(y);
    }

    getValFromYpos( y )
    {
        var start = this.layoutData[0];
        var end   = this.layoutData.slice(-1)[0];
        var val = (end.value-start.value) * ((y-start.y)/(end.y-start.y)) + start.value;
        return val;
    }

    _getYOriginTrans( baseNumber )
    {
        var y = 0;
        var dsgLen = this.dataSectionGroup.length;
        var yGroupHeight = this.height / dsgLen ;

        for( var i=0,l=dsgLen ; i<l ; i++ ){
            var ds = this.dataSectionGroup[i];
            var min = _.min(ds);
            var max = _.max(ds);

            var amountABS = Math.abs( max - min );

            if( baseNumber >= min && baseNumber <= max ){
                y = ( (baseNumber - min) / amountABS * yGroupHeight + i*yGroupHeight);
                break;
            }
        };

        y = isNaN(y) ? 0 : parseInt(y);

        if( this.sort == "desc" ){
            //如果是倒序的
            y = -(yGroupHeight - Math.abs(y));
        };

        return y;
    }

    _trimYAxis()
    {
        var me = this;
        var tmpData = [];

        /*
        //这里指的是坐标圆点0，需要移动的距离，因为如果有负数的话，最下面的坐标圆点应该是那个负数。
        //this._yOriginTrans = this._getYOriginTrans( 0 );
        var originVal = _.min(this.dataSection);
        if( originVal < 0  ){
            originVal = 0;
        };
        */

        var originVal = this.baseNumber;
        this._yOriginTrans = this._getYOriginTrans( originVal );

        //设置 basePoint
        this.basePoint = {
            value: this.baseNumber,
            y: this.getYposFromVal( this.baseNumber ),
        };
        
        for (var i = 0, l = this.dataSection.length; i < l; i++) {
            var layoutData = {
                value   : this.dataSection[ i ],
                y       : this.getYposFromVal( this.dataSection[ i ] ),
                visible : true,
                text    : ""
            };

            //把format提前
            var text = layoutData.value;
            if (_.isFunction(me.label.format)) {
                text = me.label.format.apply(this, [text, i ]);
            };
            if( text === undefined || text === null ){
                text = numAddSymbol( layoutData.value );
            };  
            layoutData.text = text;

            tmpData.push( layoutData );

        }

        var _preShowInd = 0;
        for (var a = 0, al = tmpData.length; a < al; a++) {
            if( a == 0 ) continue;

            if( _preShowInd == 0 ){
                if( tmpData[a].text == tmpData[ _preShowInd ].text ){
                    //如果后面的format后的数据和前面的节点的format后数据相同
                    tmpData[a].visible = false;
                } else {
                    _preShowInd = a;
                }
            } else {
                if( tmpData[a].text == tmpData[ _preShowInd ].text ){
                    tmpData[_preShowInd].visible = false;
                    
                }
                _preShowInd = a;
            }
        };

        //TODO: 最后的问题就是dataSection中得每个只如果format后都相同的话，就会出现最上面最下面两个一样得刻度
        this.layoutData = tmpData;
    }

    _getYAxisDisLine() 
    { //获取y轴顶高到第一条线之间的距离         
        var disMin = 0
        var disMax = 2 * disMin
        var dis = disMin
        dis = disMin + this.yMaxHeight % this.dataSection.length;
        dis = dis > disMax ? disMax : dis
        return dis
    }

    _setDataSection()
    {
        //如果有堆叠，比如[ ["uv","pv"], "click" ]
        //那么这个 this.dataOrg， 也是个对应的结构
        //vLen就会等于2
        var vLen = 1;

        _.each( this.field, function( f ){
            vLen = Math.max( vLen, 1 );
            if( _.isArray( f ) ){
                _.each( f, function( _f ){
                    vLen = Math.max( vLen, 2 );
                } );
            }
        } );


        if( vLen == 1 ){
            return this._oneDimensional( );
        };
        if( vLen == 2 ){
            return this._twoDimensional( );
        };
        
    }

    _oneDimensional()
    {
        var arr = _.flatten( this.dataOrg ); //_.flatten( data.org );

        for( var i = 0, il=arr.length; i<il ; i++ ){
            arr[i] =  arr[i] || 0;
        };

        return arr;
    }

    //二维的yAxis设置，肯定是堆叠的比如柱状图，后续也会做堆叠的折线图， 就是面积图
    _twoDimensional()
    {
        var d = this.dataOrg;
        var arr = [];
        var min;
        _.each( d , function(d, i) {
            if (!d.length) {
                return
            };

            //有数据的情况下 
            if (!_.isArray(d[0])) {
                arr.push(d);
                return;
            };

            var varr = [];
            var len = d[0].length;
            var vLen = d.length;

            for (var i = 0; i < len; i++) {
                var up_count = 0;
                var up_i = 0;

                var down_count = 0;
                var down_i = 0;

                for (var ii = 0; ii < vLen; ii++) {
                    !min && (min = d[ii][i])
                    min = Math.min(min, d[ii][i]);

                    if (d[ii][i] >= 0) {
                        up_count += d[ii][i];
                        up_i++
                    } else {
                        down_count += d[ii][i];
                        down_i++
                    }
                }
                up_i && varr.push(up_count);
                down_i && varr.push(down_count);
            };
            arr.push(varr);
        });
        arr.push(min);
        return _.flatten(arr);
    }

    _initData()
    {
        var me = this;
        
        var arr = this._setDataSection();

        if( this.waterLine != null ){
            arr.push( this.waterLine )
        }

        if( this._opt.min != null ){
            arr.push( this.min )
        };
        if( arr.length == 1 ){
            arr.push( arr[0]*2 );
        };
        
        //如果用户传入了自定义的dataSection， 那么优先级最高
        if ( !this._opt.dataSection ) {

            if( this._opt.baseNumber != undefined ){
                arr.push( this.baseNumber );
            }; 
            if( this._opt.minNumber != undefined ){
                arr.push( this.minNumber );
            }; 
            if( this._opt.maxNumber != undefined ){
                arr.push( this.maxNumber );
            }; 

            for( var ai=0,al=arr.length; ai<al; ai++ ){
                arr[ai] = Number( arr[ai] );
                if( isNaN( arr[ai] ) ){
                    arr.splice( ai,1 );
                    ai--;
                    al--;
                }
            };

            this.dataSection = DataSection.section(arr, 3);
        } else {
            this.dataSection = this._opt.dataSection;
        };

        //如果还是0
        if (this.dataSection.length == 0) {
            this.dataSection = [0]
        };
        if( _.min(this.dataSection) < this._opt.min ){
            var minDiss = me._opt.min - _.min(me.dataSection);
            //如果用户有硬性要求min，而且计算出来的dataSection还是比min小的话
            _.each( this.dataSection, function( num, i ){
                me.dataSection[i] += minDiss;
            } );
        };

        //如果有 middleweight 设置，就会重新设置dataSectionGroup
        this.dataSectionGroup = [ _.clone(this.dataSection) ];

        this._sort();
        this._setBottomAndBaseNumber();

        this._middleweight(); //如果有middleweight配置，需要根据配置来重新矫正下datasection
    }

    //yVal 要被push到datasection 中去的 值
    setWaterLine( yVal )
    {
        if( yVal <= this.waterLine) return;
        this.waterLine = yVal;
        if( yVal < _.min(this.dataSection) || yVal > _.max(this.dataSection) ){
            //waterLine不再当前section的区间内，需要重新计算整个datasection    
            this._initData();
        };
    }

    _sort()
    {
        if (this.sort) {
            var sort = this._getSortType();
            if (sort == "desc") {
                this.dataSection.reverse();

                //dataSectionGroup 从里到外全部都要做一次 reverse， 这样就可以对应上 dataSection.reverse()
                _.each( this.dataSectionGroup , function( dsg , i ){
                    dsg.reverse();
                } );
                this.dataSectionGroup.reverse();
                //dataSectionGroup reverse end
            };
        };
    }

    _getSortType()
    {
        var _sort;
        if( _.isString(this.sort) ){
            _sort = this.sort;
        }
        if( _.isArray(this.sort) ){
            _sort = this.sort[ this.align == "left" ? 0 : 1 ];
        }
        if( !_sort ){
            _sort = "asc";
        }
        return _sort;
    }

    _setBottomAndBaseNumber()
    {
        if( this.min == null ){
            //this.min = this.dataSection[0];
            this.min = _.min( this.dataSection );
        };
        
        //没人情况下 baseNumber 就是datasection的最小值
        if (this._opt.baseNumber == undefined || this._opt.baseNumber == null) {
            this.baseNumber = 0;//this.dataSection[0];//_.min( this.dataSection );
            if( _.max( this.dataSection ) < 0 ){
                this.baseNumber = _.max( this.dataSection );
            };
            if( _.min( this.dataSection ) > 0 ){
                this.baseNumber = _.min( this.dataSection );
            };
        };
        
    }

    _middleweight()
    {
        if( this.middleweight ){
            //支持多个量级的设置
            //量级的设置只支持非sort的柱状图场景，否则这里修改过的datasection会和 _initData 中sort过的逻辑有冲突
            if( !_.isArray( this.middleweight ) ){
                this.middleweight = [ this.middleweight ];
            };

            //拿到dataSection中的min和 max 后，用middleweight数据重新设置一遍dataSection
            var dMin = _.min( this.dataSection );
            var dMax = _.max( this.dataSection );
            var newDS = [ dMin ];
            var newDSG = [];

            for( var i=0,l=this.middleweight.length ; i<l ; i++ ){
                var preMiddleweight = dMin;
                if( i > 0 ){
                    preMiddleweight = this.middleweight[ i-1 ];
                };
                var middleVal = preMiddleweight + parseInt( (this.middleweight[i] - preMiddleweight) / 2 );

                newDS.push( middleVal );
                newDS.push( this.middleweight[i] );

                newDSG.push([
                    preMiddleweight,
                    middleVal,
                    this.middleweight[i]
                ]);
            };
            var lastMW =  this.middleweight.slice(-1)[0];

            if( dMax > lastMW ){
                newDS.push( lastMW + (dMax - lastMW) / 2 ) ;
                newDS.push( dMax );
                newDSG.push([
                    lastMW,
                    lastMW +(dMax - lastMW) / 2 ,
                    dMax
                ]);
            }

            

            //好了。 到这里用简单的规则重新拼接好了新的 dataSection
            this.dataSection = newDS;
            this.dataSectionGroup = newDSG;

            //因为重新设置过了 dataSection 所以要重新排序和设置bottom and base 值
            this._sort();
            this._setBottomAndBaseNumber();
        };                
    }

    resetWidth(width)
    {
        var me = this;
        me.width = width;
        if( me.align == "left" ){
            me.rulesSprite.context.x = me.width;
        }
    }

    _widget( opt )
    {
        var me = this;
        !opt && (opt ={});
        if (!me.enabled) {
            me.width = 0;
            return;
        };
        
        var arr = this.layoutData;
        me.maxW = 0;

        for (var a = 0, al = arr.length; a < al; a++) {
            var o = arr[a];
            if( !o.visible ){
                continue;
            };
            var y = o.y;

            var value = o.value;

            var textAlign = me.label.textAlign || (me.align == "left" ? "right" : "left");
 
            var posy = y + (a == 0 ? -3 : 0) + (a == arr.length - 1 ? 3 : 0);
            //为横向图表把y轴反转后的 逻辑
            if (me.label.rotation == 90 || me.label.rotation == -90) {
                textAlign = "center";
                if (a == arr.length - 1) {
                    posy = y - 2;
                    textAlign = "right";
                }
                if (a == 0) {
                    posy = y;
                }
            };

            var yNode = this.rulesSprite.getChildAt(a);

            if( yNode ){
                if( yNode._txt && this.label.enabled ){

                    if (me.animation && !opt.resize) {
                        yNode._txt.animate({
                            y: posy
                        }, {
                            duration: 500,
                            delay: a*80,
                            id: yNode._txt.id
                        });
                    } else {
                        yNode._txt.context.y = posy;
                    };
                    
                    yNode._txt.resetText( o.text );
                };

                if( yNode._tickLine && this.tickLine.enabled ){
                    if (me.animation && !opt.resize) {
                        yNode._tickLine.animate({
                            y: y
                        }, {
                            duration: 500,
                            delay: a*80,
                            id: yNode._tickLine.id
                        });
                    } else {
                        yNode._tickLine.context.y = y;
                    }
                };

            } else {
                yNode = new Canvax.Display.Sprite({
                    id: "yNode" + a
                });

                var aniFrom = 20;
                if( o.value == me.baseNumber ){
                    aniFrom = 0;
                };

                if( o.value < me.baseNumber ){
                    aniFrom = -20;
                };

                var lineX = 0
                if (me.tickLine.enabled) {
                    //线条
                    lineX = me.align == "left" ? - me.tickLine.lineLength - me.tickLine.distance : me.tickLine.distance;
                    var line = new Line({
                        context: {
                            x: lineX ,
                            y: y,
                            end : {
                                x : me.tickLine.lineLength,
                                y : 0
                            },
                            lineWidth: me.tickLine.lineWidth,
                            strokeStyle: me._getProp(me.tickLine.strokeStyle)
                        }
                    });
                    yNode.addChild(line);
                    yNode._tickLine = line;
                };

                //文字
                if( me.label.enabled ){
                    var txtX = me.align == "left" ? lineX - me.label.distance : lineX + me.tickLine.lineLength + me.label.distance;
                    if( this.isH ){
                        txtX = txtX + (me.align == "left"?-1:1)* 4
                    };
                    var txt = new Canvax.Display.Text( o.text , {
                        id: "yAxis_txt_" + me.align + "_" + a,
                        context: {
                            x: txtX,
                            y: posy + aniFrom,
                            fillStyle: me._getProp(me.label.fontColor),
                            fontSize: me.label.fontSize,
                            rotation: -Math.abs(me.label.rotation),
                            textAlign: textAlign,
                            textBaseline: "middle",
                            lineHeight  : me.label.lineHeight,
                            globalAlpha: 0
                        }
                    });
                    yNode.addChild(txt);
                    yNode._txt = txt;

                    
                    if (me.label.rotation == 90 || me.label.rotation == -90) {
                        me.maxW = Math.max(me.maxW, txt.getTextHeight());
                    } else {
                        me.maxW = Math.max(me.maxW, txt.getTextWidth());
                    };

                    //这里可以由用户来自定义过滤 来 决定 该node的样式
                    _.isFunction(me.filter) && me.filter({
                        layoutData: me.layoutData,
                        index: a,
                        txt: txt,
                        line: line
                    });

                    me.rulesSprite.addChild(yNode);

            
                    if (me.animation && !opt.resize) {
                        txt.animate({
                            globalAlpha: 1,
                            y: txt.context.y - aniFrom
                        }, {
                            duration: 500,
                            easing: 'Back.Out', //Tween.Easing.Elastic.InOut
                            delay: (a+1) * 80,
                            id: txt.id
                        });
                    } else {
                        txt.context.y = txt.context.y - aniFrom;
                        txt.context.globalAlpha = 1;
                    }
                };
            }
        };

        //把 rulesSprite.children中多余的给remove掉
        if( me.rulesSprite.children.length > arr.length ){
            for( var al = arr.length,pl = me.rulesSprite.children.length;al<pl;al++  ){
                me.rulesSprite.getChildAt( al ).remove();
                al--,pl--;
            };
        };

        if( me.width === null ){
            me.width = parseInt( me.maxW + me.label.distance  );
            if (me.tickLine.enabled) {
                me.width += parseInt( me.tickLine.lineLength + me.tickLine.distance );
            }
            if ( me._title ){
                me.width += me._title.getTextHeight();
            }
        }

        var _originX = 0;
        if( me.align == "left" ){
            me.rulesSprite.context.x = me.width;
            _originX = me.width;
        }

        //轴线
        if( me.axisLine.enabled ){
            var _axisLine = new Line({
                context : {
                    start : {
                        x : _originX,
                        y : 0
                    },
                    end   : {
                        x : _originX,
                        y : -me.height
                    },
                    lineWidth   : me.axisLine.lineWidth,
                    strokeStyle : me._getProp(me.axisLine.strokeStyle)
                }
            });
            this.sprite.addChild( _axisLine );
        }

        if (this._title) {
            this._title.context.y = -this.height/2;
            this._title.context.x = this._title.getTextHeight() / 2;
            if( this.align == "right" ){
                this._title.context.x = this.width - this._title.getTextHeight() / 2;
            };
            this.sprite.addChild(this._title);
        };

    }


    _getProp(s)
    {
        var res = s;
        if (_.isFunction(s)) {
            res = s.call( this , this );
        }
        if( !s ){
            res = "#999";
        }
        return res
    }
}