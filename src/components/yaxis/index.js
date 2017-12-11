import Component from "../component"
import Canvax from "canvax2d"
import {numAddSymbol} from "../../utils/tools"
import DataSection from "../../utils/datasection"

const Line = Canvax.Shapes.Line;
const _ = Canvax._;

export default class yAxis extends Component
{
	constructor( opt, data ){
        super();

        this._opt = opt;
        
        this.width   = null;
        this.display = true; //true false 1,0都可以
        this.dis     = 6;    //线到文本的距离
        this.maxW    = 0;    //最大文本的 width
        this.field   = [];   //这个 轴 上面的 field

        this.label   = "";
        this._label  = null; //label 的text对象

        this.line = {
            enabled: 1,      //是否有line
            width: 4,
            lineWidth: 1,
            strokeStyle: '#cccccc'
        };

        this.text = {
            fillStyle: '#999',
            fontSize: 12,
            format: null,
            rotation: 0
        };
        this.pos = {
            x: 0,
            y: 0
        };
        this.place = "left"; //yAxis轴默认是再左边，但是再双轴的情况下，可能会right
        
        this.layoutData = []; //dataSection 对应的layout数据{y:-100, content:'1000'}
        this.dataSection = []; //从原数据 dataOrg 中 结果 datasection 重新计算后的数据

        //默认的 dataSectionGroup = [ dataSection ], dataSection 其实就是 dataSectionGroup 去重后的一维版本
        this.dataSectionGroup = []; 

        //如果middleweight有设置的话 dataSectionGroup 为被middleweight分割出来的n个数组>..[ [0,50 , 100],[100,500,1000] ]
        this.middleweight = null; 

        this.dataOrg = data.org || []; //源数据

        this.sprite = null;
        //this.x           = 0;
        //this.y           = 0;
        this.disYAxisTopLine = 6; //y轴顶端预留的最小值
        this.yMaxHeight = 0; //y轴最大高
        this.yGraphsHeight = 0; //y轴第一条线到原点的高

        this.baseNumber = null; //为非负number
        this.basePoint = null; //value为 baseNumber 的point {x,y}
        this.bottomNumber = null; //如果手动设置了 bottomNumber 为负数，则baseNumber＝0，否则baseNumber 就 等于设置的 bottomNumber

        this._yOriginTrans = 0;//当设置的 baseNumber 和datasection的min不同的时候，
        

        //过滤器，可以用来过滤哪些yaxis 的 节点是否显示已经颜色之类的
        //@params params包括 dataSection , 索引index，txt(canvax element) ，line(canvax element) 等属性
        this.filter = null; //function(params){}; 

        this.isH = false; //是否横向

        this.animation = true;
        this.resize = false;

        this.sort = null; //"asc" //排序，默认从小到大, desc为从大到小，之所以不设置默认值为asc，是要用null来判断用户是否进行了配置

        this.layoutType = "proportion"; // rule , peak, proportion

        this.init(opt, data );
    }

    init(opt, data )
    {
        _.extend(true , this, opt);

        if (this.text.rotation != 0 && this.text.rotation % 90 == 0) {
            this.isH = true;
        };

        this._initData(data);
        this.sprite = new Canvax.Display.Sprite({
            id: "yAxisSprite_"+new Date().getTime()
        });
        this.rulesSprite = new Canvax.Display.Sprite({
            id: "yRulesSprite_"+new Date().getTime()
        });
        this.sprite.addChild( this.rulesSprite );
    }

    //配置和数据变化
    reset(opt, data)
    {
        this.dataSection = [];
        this.dataSectionGroup = [];

        if( opt ){
            _.extend(true, this, opt);

            //有些用户主动配置是只有在_opt上面才有记录的，this上面的时融合了很多默认配置，无法区分
            //所以这里也需要把主动配置也extend一次
            _.extend(true, this._opt, opt);
        }

        if( data && data.org ){
            this.dataOrg = data.org; //这里必须是data.org
        };
        
        this._initData({
            org : this.dataOrg
        });

        this._trimYAxis();
        this._widget();
    }

    setX($n)
    {
        this.sprite.context.x = $n + (this.place == "left" ? Math.max(this.maxW , (this.width - this.pos.x - this.dis - this.line.width) ) : 0);
        this.pos.x = $n;
    }

    setY($n)
    {
        this.sprite.context.y = $n;
        this.pos.y = $n;
    }

    setAllStyle(sty)
    {
        _.each(this.rulesSprite.children, function(s) {
            _.each(s.children, function(cel) {
                if (cel.type == "text") {
                    cel.context.fillStyle = sty;
                } else if (cel.type == "line") {
                    cel.context.strokeStyle = sty;
                }
            });
        });
    }

    _getLabel()
    {
        var _label = "";
        if(_.isArray(this.label)){
            _label = this.label[ this.place == "left" ? 0 : 1 ];
        } else {
            _label = this.label;
        };
        
        if (_label && _label != "") {
            this._label = new Canvax.Display.Text(_label, {
                context: {
                    fontSize: this.text.fontSize,
                    textAlign: this.place,//"left",
                    textBaseline: this.isH ? "top" : "bottom",
                    fillStyle: this.text.fillStyle,
                    rotation: this.isH ? -90 : 0
                }
            });
        }
    }

    draw(opt)
    {
        opt && _.extend(true, this, opt);
        this._getLabel();
        this.yGraphsHeight = this.yMaxHeight - this._getYAxisDisLine();

        if (this._label) {
            if (this.isH) {
                this.yGraphsHeight -= this._label.getTextWidth();
            } else {
                this.yGraphsHeight -= this._label.getTextHeight();
            }
            this._label.context.y = -this.yGraphsHeight - 5;
        };
        
        this._trimYAxis();
        this._widget();

        this.setX(this.pos.x);
        this.setY(this.pos.y);

        this.resize = false;
    }

    //更具y轴的值来输出对应的在y轴上面的位置
    getYposFromVal( val )
    {

        var y = 0;
        var dsgLen = this.dataSectionGroup.length;
        var yGroupHeight = this.yGraphsHeight / dsgLen ;

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
        //返回的y是以最底端为坐标原点的坐标值，所以就是负数
        if( this.sort == "desc" ){
            y = Math.abs(this.yGraphsHeight - Math.abs(y));
        }
        return -y;
    }

    getValFromYpos( y )
    {
        var start = this.layoutData[0];
        var end   = this.layoutData.slice(-1)[0];
        var val = (end.content-start.content) * ((y-start.y)/(end.y-start.y)) + start.content;
        return val;
    }

    _getYOriginTrans( baseNumber )
    {
        var y = 0;
        var dsgLen = this.dataSectionGroup.length;
        var yGroupHeight = this.yGraphsHeight / dsgLen ;

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
        
        var tmpData = [];
        //这里指的是坐标圆点0，需要移动的距离，因为如果有负数的话，最下面的坐标圆点应该是那个负数。
        //this._yOriginTrans = this._getYOriginTrans( 0 );


        var originVal = _.min(this.dataSection);
        if( originVal < 0  ){
            originVal = 0;
        };

        //originVal = this.baseNumber;
        
        this._yOriginTrans = this._getYOriginTrans( originVal );


        //设置 basePoint
        this.basePoint = {
            content: this.baseNumber,
            y: this.getYposFromVal( this.baseNumber ),
        };
        
        for (var a = 0, al = this.dataSection.length; a < al; a++) {
            tmpData[a] = {
                content: this.dataSection[a],
                y: this.getYposFromVal( this.dataSection[a] )
            };

        };
        this.layoutData = tmpData;
        
    }

    _getYAxisDisLine() 
    { //获取y轴顶高到第一条线之间的距离         
        var disMin = this.disYAxisTopLine
        var disMax = 2 * disMin
        var dis = disMin
        dis = disMin + this.yMaxHeight % this.dataSection.length;
        dis = dis > disMax ? disMax : dis
        return dis
    }

    _setDataSection(data)
    {
        var vLen = 1;
        var field = data.field;

        //如果没有传field，那么就默认按照一维数据获取section
        if( field ){
            if( !_.isArray( field ) ){
                field = [field];
            };
            _.each( data.field, function( f ){
                vLen = Math.max( vLen, 1 );
                if( _.isArray( f ) ){
                    _.each( f, function( _f ){
                        vLen = Math.max( vLen, 2 );
                    } );
                }
            } );
        };

        if( vLen == 1 ){
            return this._oneDimensional( data );
        };
        if( vLen == 2 ){
            return this._twoDimensional( data );
        };
        
    }

    _oneDimensional(data)
    {
        
        var d = (data.org || data.data || data);
        
        var arr = _.flatten( d ); //_.flatten( data.org );

        for( var i = 0, il=arr.length; i<il ; i++ ){
            arr[i] =  arr[i] || 0;
        };

        return arr;
    }

    //二维的yAxis设置，肯定是堆叠的比如柱状图，后续也会做堆叠的折线图， 就是面积图
    _twoDimensional(data)
    {
        var arr = [];
        var min;
        _.each(data.org, function(d, i) {
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

    _initData(data)
    {

        //先要矫正子啊field确保一定是个array
        if( !_.isArray(this.field) ){
            this.field = [this.field];
        };
        
        var arr = this._setDataSection(data);
        if( this.bottomNumber != null ){
            arr.push( this.bottomNumber )
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
        this.dataSectionGroup = [ _.clone(this.dataSection) ];

        this._sort();
        this._setBottomAndBaseNumber();

        this._middleweight(); //如果有middleweight配置，需要根据配置来重新矫正下datasection
    }

    //yVal 要被push到datasection 中去的 值
    resetDataSection( yVal )
    {

        if( yVal < _.min(this.dataSection) || yVal > _.max(this.dataSection) ){
            this.dataSection.push( yVal );
            this._initData( {
                //field: this.field,
                org : this.dataSection
            } );
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
            _sort = this.sort[ this.place == "left" ? 0 : 1 ];
        }
        if( !_sort ){
            _sort = "asc";
        }
        return _sort;
    }

    _setBottomAndBaseNumber()
    {
        if( this.bottomNumber == null ){
            this.bottomNumber = this.dataSection[0];
        }
        
        //没人情况下 baseNumber 就是datasection的最小值
        if (this._opt.baseNumber == undefined || this._opt.baseNumber == null) {
            this.baseNumber = this.dataSection[0];//_.min( this.dataSection );
            if( this.baseNumber < 0 ){
                this.baseNumber = 0;
            }
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
            var lastMW =  this.middleweight.slice(-1)[0] ;
            newDS.push( lastMW + (dMax - lastMW) / 2 ) ;
            newDS.push( dMax );

            newDSG.push([
                lastMW,
                lastMW +(dMax - lastMW) / 2 ,
                dMax
            ]);

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
        var self = this;
        self.width = width;
        if (self.line.enabled) {
            self.sprite.context.x = width - self.dis - self.line.width;
        } else {
            self.sprite.context.x = width - self.dis;
        }
    }

    _widget()
    {
        var self = this;
        if (!self.display) {
            self.width = 0;
            return;
        };
        
        var arr = this.layoutData;
        self.maxW = 0;
        self._label && self.sprite.addChild(self._label);
        for (var a = 0, al = arr.length; a < al; a++) {
            var o = arr[a];
            var x = 0,
                y = o.y;
            var content = o.content;
            
            if (_.isFunction(self.text.format)) {
                content = self.text.format(content, self);
            };
            if( content === undefined || content === null ){
                content = Tools.numAddSymbol( o.content );
            };  

        
            var textAlign = (self.place == "left" ? "right" : "left");
            //为横向图表把y轴反转后的 逻辑
            if (self.text.rotation == 90 || self.text.rotation == -90) {
                textAlign = "center";
                if (a == arr.length - 1) {
                    textAlign = "right";
                }
            };
            var posy = y + (a == 0 ? -3 : 0) + (a == arr.length - 1 ? 3 : 0);
            //为横向图表把y轴反转后的 逻辑
            if (self.text.rotation == 90 || self.text.rotation == -90) {
                if (a == arr.length - 1) {
                    posy = y - 2;
                }
                if (a == 0) {
                    posy = y;
                }
            };

            var yNode = this.rulesSprite.getChildAt(a);

            if( yNode ){
                if(yNode._txt){
                    yNode._txt.animate({
                        y: posy
                    }, {
                        duration: 500,
                        delay: a*80,
                        id: yNode._txt.id
                    });
                    yNode._txt.resetText( content );
                };

                if( yNode._line ){
                    yNode._line.animate({
                        y: y
                    }, {
                        duration: 500,
                        delay: a*80,
                        id: yNode._line.id
                    });
                };

            } else {
                yNode = new Canvax.Display.Sprite({
                    id: "yNode" + a
                });

                var aniDis = 20;
                if( content == self.baseNumber ){
                    aniDis = 0;
                }
                if( content < self.baseNumber ){
                    aniDis = -20;
                }

                //文字
                var txt = new Canvax.Display.Text(content, {
                    id: "yAxis_txt_" + self.place + "_" + a,
                    context: {
                        x: x + (self.place == "left" ? -5 : 5),
                        y: posy + aniDis,
                        fillStyle: self._getProp(self.text.fillStyle),
                        fontSize: self.text.fontSize,
                        rotation: -Math.abs(this.text.rotation),
                        textAlign: textAlign,
                        textBaseline: "middle",
                        globalAlpha: 0
                    }
                });
                yNode.addChild(txt);
                yNode._txt = txt;

                self.maxW = Math.max(self.maxW, txt.getTextWidth());
                if (self.text.rotation == 90 || self.text.rotation == -90) {
                    self.maxW = Math.max(self.maxW, txt.getTextHeight());
                };


                if (self.line.enabled) {
                    //线条
                    var line = new Line({
                        context: {
                            x: 0 + (self.place == "left" ? +1 : -1) * self.dis - 2,
                            y: y,
                            end : {
                                x : self.line.width,
                                y : 0
                            },
                            lineWidth: self.line.lineWidth,
                            strokeStyle: self._getProp(self.line.strokeStyle)
                        }
                    });
                    yNode.addChild(line);
                    yNode._line = line;
                };
                //这里可以由用户来自定义过滤 来 决定 该node的样式
                _.isFunction(self.filter) && self.filter({
                    layoutData: self.layoutData,
                    index: a,
                    txt: txt,
                    line: line
                });

                self.rulesSprite.addChild(yNode);

                //如果是resize的话也不要处理动画
                if (self.animation && !self.resize) {
                    txt.animate({
                        globalAlpha: 1,
                        y: txt.context.y - aniDis
                    }, {
                        duration: 500,
                        easing: 'Back.Out', //Tween.Easing.Elastic.InOut
                        delay: (a+1) * 80,
                        id: txt.id
                    });
                } else {
                    txt.context.y = txt.context.y - aniDis;
                    txt.context.globalAlpha = 1;
                }
            }
        };

        //把 rulesSprite.children中多余的给remove掉
        if( self.rulesSprite.children.length > arr.length ){
            for( var al = arr.length,pl = self.rulesSprite.children.length;al<pl;al++  ){
                self.rulesSprite.getChildAt( al ).remove();
                al--,pl--;
            };
        };

        self.maxW += self.dis;

        //self.rulesSprite.context.x = self.maxW + self.pos.x;
        //self.pos.x = self.maxW + self.pos.x;
        if( self.width == null ){
            if (self.line.enabled) {
                self.width = self.maxW + self.dis + self.line.width + self.pos.x;
            } else {
                self.width = self.maxW + self.dis + self.pos.x;
            }
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