define(
    "chartx/chart/scat/xaxis",
    [
        "chartx/components/xaxis/xAxis",
        "chartx/utils/datasection"
    ],
    function(xAxisBase , DataSection ){
        var xAxis = function( opt , data ){
            this.xDis = 0; //x方向一维均分长度
            opt.layoutType = "proportion";
            xAxis.superclass.constructor.apply( this , arguments );
        };
        Chartx.extend( xAxis , xAxisBase , {
            _initDataSection  : function( arr ){ 
                var arr = _.flatten( arr ); //_.flatten( data.org );
                var dataSection = DataSection.section(arr);
                this._baseNumber = dataSection[0];
                if( dataSection.length == 1 ){
                    //TODO;散点图中的xaxis不应该只有一个值，至少应该有个区间
                    dataSection.push( 100 );
                }
                return dataSection;
            },
            /**
             *@param data 就是上面 _initDataSection计算出来的dataSection
             */
            _trimXAxis : function( data , xGraphsWidth ){
                var tmpData = [];
                this.xDis  = xGraphsWidth / (data.length-1);

                for (var a = 0, al  = data.length; a < al; a++ ) {
                    var o = {
                        'content' : data[a], 
                        'x'       : this.xDis * a
                    }
                    tmpData.push( o );
                }
                return tmpData;
            } 
        } );
    
        return xAxis;
    }
);


define(
    "chartx/chart/scat/graphs",
    [
        "canvax/index",
        "canvax/shape/Circle",
        "canvax/shape/Rect",
        "canvax/animation/Tween",
        "chartx/chart/theme"
    ],
    function( Canvax , Circle , Rect , Tween , Theme ){

        var Graphs = function( opt , dataFrame ){
            this.zAxis = dataFrame.zAxis;
            this.xAxis = dataFrame.xAxis;
            this.yAxis = dataFrame.yAxis;
            this.dataFrame = dataFrame;
            this.label     = {
                field : [],
                enabled : true
            }; //label的字段
            this.w = 0;
            this.h = 0;

            this.pos = {
                x : 0,
                y : 0
            };

            this.circle = {
                maxR    : 20,  //圆圈默认最大半径
                minR    : 3,
                r       : null,
                normalR : 10,
                fillStyle: function(){}
            };

            this._colors  = Theme.colors;

            this.sprite   = null;

            this._circles = [];  //所有圆点的集合

            _.deepExtend( this , opt );

            this.init( );
        };

        Graphs.prototype = {
            init : function(){
                this.sprite = new Canvax.Display.Sprite({ id : "graphsEl" });
            },
            setX:function($n){
                this.sprite.context.x = $n
            },
            setY:function($n){
                this.sprite.context.y = $n
            },
            _getLabel      : function( iGroup , iNode ){
                var labelField = this.label.field[ iGroup ];
                if( labelField ) {
                    var label = null;
                    _.each( this.dataFrame.data , function( d , i ){
                        if( d.field == labelField ){
                            label = d.data[iNode];
                        }
                    } );
                    return label;
                }
            },
            _getCircleNode : function( iGroup , iNode , value ){
                var node = {
                    iGroup : iGroup,
                    iNode  : iNode,
                    xAxis  : {
                        field : this.xAxis.field[iGroup],
                        value : this.xAxis.org[iGroup][iNode]
                    },
                    yAxis  : {
                        field : this.yAxis.field[iGroup],
                        value : value
                    },
                    label  : this._getLabel( iGroup , iNode ),
                    zAxis  : null
                }
                if( this.zAxis.field[iGroup] ){
                    node.zAxis = {
                        field : this.zAxis.field[iGroup],
                        value : this.zAxis.org[iGroup][iNode]
                    }
                }
                return node;
            },
            getCircleFillStyle : function( i , ii , value , circleNode ){
                var fillStyle = this.circle.fillStyle;

                if( _.isArray( fillStyle ) ){
                    fillStyle = fillStyle[ii]
                }
                if( _.isFunction( fillStyle ) ){
                    //fillStyle = fillStyle( i , ii , value );
                    //fillStyle = fillStyle( {
                    //    iGroup : ii,
                    //    iNode  : i,
                    //    value  : value
                    //} );
                    //fillStyle   = fillStyle(this._getCircleNode(ii , i , value));
                    fillStyle   = fillStyle( circleNode );
                }
                if( !fillStyle || fillStyle=="" ){
                    fillStyle = this._colors[ii];
                }
                return fillStyle;
            },
            getR : function(d){
                var r = this.circle.r;
                if( _.isFunction(r) ){
                    return r(d)
                } else {
                    return r;
                };
            },
            draw : function(data , opt){
                
                var self = this;
                _.deepExtend(this , opt);
                if( data.length == 0 ){
                    return;
                };

                self.data = data;

                this.induce = new Rect({
                    id    : "induce",
                    context:{
                        y           : -this.h,
                        width       : this.w,
                        height      : this.h,
                        fillStyle   : '#000000',
                        globalAlpha : 0,
                        cursor      : 'pointer'
                    }
                });

                this.sprite.addChild(this.induce);

                this.induce.on("panstart mouseover", function(e){
                    e.eventInfo = null;
                });
                this.induce.on("panmove mousemove", function(e){
                    e.eventInfo = null;
                });


                //这个分组是只x方向的一维分组
                var barGroupLen = data[0].length;

                var zMax = 1;

                if( this.zAxis.field && this.zAxis.field.length > 0 ){
                    zMax = _.max( _.flatten(this.zAxis.org) );
                }

                for( var i = 0 ; i < barGroupLen ; i++ ){
                    var sprite = new Canvax.Display.Sprite();
                    for( var ii = 0 , iil = data.length ; ii < iil ; ii++ ){
                        var d = data[ii][i];

                        var zAxisV  = this.zAxis.org[ii] && this.zAxis.org[ii][i];

                        if (zAxisV == 0 ) {
                            continue
                        };

                        var r = this.getR(d) || (zAxisV ? Math.max(this.circle.maxR*(zAxisV/zMax) , this.circle.minR) : this.circle.normalR );
                        var circleNode = this._getCircleNode(ii , i , d.value);

                        var fillStyle  = this.getCircleFillStyle( i , ii , d.value , circleNode );
                        if( d.value == null || d.value == undefined || d.value === "" ){
                            continue;
                        }

                        var circle = new Circle({
                            hoverClone : false,
                            context : {
                                x           : d.x,
                                y           : d.y,
                                fillStyle   : fillStyle,
                                r           : r,
                                globalAlpha : 0,
                                cursor      : "pointer"
                            }
                        });
                        sprite.addChild( circle );

                        circle.iGroup = ii;
                        circle.iNode  = i;
                        circle.r      = r;
                        circle.label  = circleNode.label;
                        if( zAxisV != undefined || zAxisV != null ){
                            circle.zAxis  = {
                                field : this.zAxis.field,
                                value : zAxisV,
                                org   : this.zAxis.org
                            }
                        }

                        circle.on("panstart mouseover", function(e){
                            e.eventInfo = self._getInfoHandler(e);
                            this.context.globalAlpha = 0.9;
                            this.context.r ++;
                        });
                        circle.on("panmove mousemove", function(e){
                            e.eventInfo = self._getInfoHandler(e);

                        });
                        circle.on("panend mouseout", function(e){
                            e.eventInfo = {};
                            this.context.globalAlpha = 0.7;
                            this.context.r --;
                        });
                        circle.on("tap click", function(e){
                            e.eventInfo = self._getInfoHandler(e);
                        });

                        this._circles.push( circle );

                        if( circleNode.label && circleNode.label != "" && this.label.enabled ){
                            var y = d.y-r;
                            if( y + this.h <= 20 ){
                                y = -(this.h - 20);
                            }
                            var label = new Canvax.Display.Text( circleNode.label , {
                                context: {
                                    x            : d.x,
                                    y            : y,
                                    fillStyle    : fillStyle,
                                    textAlign    : "center",
                                    textBaseline : "bottom"
                                }
                            });
                            if( circle.context.r * 2 > label.getTextWidth() ){
                                label.context.y = d.y;
                                label.context.textBaseline = "middle";
                                label.context.fillStyle = "black"
                            }
                            sprite.addChild( label );
                        }
                    }
                    this.sprite.addChild( sprite );
                };

                this.setX( this.pos.x );
                this.setY( this.pos.y );
            },
            _getInfoHandler : function(e){
                var target = e.target;
                var node = {
                    iGroup        : target.iGroup,
                    iNode         : target.iNode,
                    label         : target.label,
                    nodesInfoList : this._getNodeInfo(target.iGroup, target.iNode)
                };
                return node
            },
            _getNodeInfo : function( iGroup , iNode ){
                var arr  = [];
                arr.push( this.data[iGroup][iNode] );
                return arr;
            },
            /**
             * 生长动画
             */
            grow : function(){
                var self  = this;
                var timer = null;

                var growAnima = function(){
                   var bezierT = new Tween.Tween( { h : 0 } )
                   .to( { h : 100 }, 500 )
                   .onUpdate( function () {
                       for( var i=0 , l=self._circles.length ; i<l ; i++ ){
                           var _circle = self._circles[i];
                           _circle.context.globalAlpha = this.h / 100 * 0.7;
                           _circle.context.r = this.h / 100 * _circle.r;
                       }
                   } ).onComplete( function(){
                       cancelAnimationFrame( timer );
                   }).start();
                   animate();
                };
                function animate(){
                    timer    = requestAnimationFrame( animate );
                    Tween.update();
                };
                growAnima();
            }
        };
        return Graphs;
    }
);


define(
    "chartx/chart/scat/index",
    [
        'chartx/chart/index',
        'chartx/utils/tools',
        'chartx/utils/datasection',
        './xaxis',
        'chartx/components/yaxis/yAxis',
        'chartx/components/back/Back',
        './graphs',
        'chartx/utils/dataformat',
        'chartx/components/anchor/Anchor',
        'chartx/components/tips/tip'
    ],
    function(Chart , Tools, DataSection, xAxis, yAxis, Back, Graphs , dataFormat , Anchor , Tip){
        /*
         *@node chart在dom里的目标容器节点。
        */
        var Canvax = Chart.Canvax;
    
        return Chart.extend( {
    
            init:function(node , data , opts){
    
                this._xAxis   =  null;
                this._yAxis   =  null;
                this._back    =  null;
                this._graphs  =  null;
                this._anchor  =  null;

                _.deepExtend( this , opts );
                this.dataFrame = this._initData( data , this );

            },
            draw:function(){
                this.stageTip = new Canvax.Display.Sprite({
                    id      : 'tip'
                });
    
                this.core    = new Canvax.Display.Sprite({
                    id      : 'core'
                });
                this.stageBg  = new Canvax.Display.Sprite({
                    id      : 'bg'
                });
    
                this.stage.addChild(this.stageBg);
                this.stage.addChild(this.core);
                this.stage.addChild(this.stageTip);

                if( this.rotate ) {
                  this._rotate( this.rotate );
                }
    
                this._initModule();                      //初始化模块  
    
                this._startDraw();                         //开始绘图
    
                this._drawEnd();                           //绘制结束，添加到舞台

                this.inited = true;
            },
            _initData  : dataFormat,
            _initModule:function(){
                this._xAxis  = new xAxis(this.xAxis , this.dataFrame.xAxis);
                this._yAxis  = new yAxis(this.yAxis , this.dataFrame.yAxis);
                this._back   = new Back(this.back);
                this._anchor = new Anchor(this.anchor);
                this._graphs = new Graphs(this.graphs , this.dataFrame);
                this._tip    = new Tip(this.tips, this.canvax.getDomContainer());
                this._tip._getDefaultContent = this._getTipDefaultContent;

                this.stageBg.addChild(this._back.sprite);
                this.core.addChild(this._xAxis.sprite);
                this.core.addChild(this._yAxis.sprite);
                this.core.addChild(this._graphs.sprite);
                this.core.addChild(this._anchor.sprite);
                this.stageTip.addChild(this._tip.sprite);

            },
            _getTipDefaultContent : function( nodeInfo ){
                var res;
                if( nodeInfo.label ){
                    res = nodeInfo.label+"："+nodeInfo.nodesInfoList[0].value;
                } else {
                    res = nodeInfo.xAxis.field + "："+nodeInfo.nodesInfoList[0].value;
                }
                return res;
            },
            _startDraw : function(opt){
                var w = (opt && opt.w) || this.width;
                //w     -= (this.padding.right + this.padding.left); 
                var h = (opt && opt.h) || this.height;
                var y = parseInt( h - this._xAxis.height );
                var graphsH = y - this.padding.top;
                
                //绘制yAxis
                this._yAxis.draw({
                    pos : {
                        x : this.padding.left,
                        y : y
                    },
                    yMaxHeight : graphsH 
                });
                
                var _yAxisW = this._yAxis.width;
    
    
                //绘制x轴
                this._xAxis.draw({
                    graphh :   h,
                    graphw :   w - this.padding.right,
                    yAxisW :   _yAxisW
                });
                if( this._xAxis.yAxisW != _yAxisW ){
                    //说明在xaxis里面的时候被修改过了。那么要同步到yaxis
                    this._yAxis.resetWidth( this._xAxis.yAxisW );
                    _yAxisW = this._xAxis.yAxisW;
                };
    
                var _graphsH = this._yAxis.yGraphsHeight;
                //绘制背景网格
                this._back.draw({
                    w    : this._xAxis.xGraphsWidth ,
                    h    : _graphsH,
                    xAxis:{
                        data : this._yAxis.layoutData
                    },
                    yAxis:{
                        data : this._xAxis.layoutData
                    },
                    pos : {
                        x : _yAxisW,
                        y : y
                    }
                });
    
                //绘制主图形区域
                this._graphs.draw( this._trimGraphs() , {
                    w    : this._xAxis.xGraphsWidth,
                    h    : _graphsH,
                    pos  : {
                         x : _yAxisW ,
                         y : y
                    }
                });
    
                //执行生长动画
                this._graphs.grow();

                if(this._anchor.enabled){
                    //绘制点位线
                    this._anchor.draw({
                        w    : this._xAxis.xGraphsWidth,//w - _yAxisW,
                        h    : _graphsH,
                        cross  : {
                            x : this._back.yAxis.org,
                            y : _graphsH+this._back.xAxis.org
                        },
                        pos   : {
                            x : _yAxisW,
                            y : y - _graphsH
                        }
                    } , this._xAxis , this._yAxis );
                    this._anchor.hide()
                };

                this._bindEvent();
              
            },
            _setXaxisYaxisToeventInfo : function( e ){
                var self = this;
                e.eventInfo.xAxis = {
                    field : self.dataFrame.xAxis.field[ e.eventInfo.iGroup ],
                    value : self.dataFrame.xAxis.org[ e.eventInfo.iGroup ][ e.eventInfo.iNode ]
                };
                
                if( e.target.zAxis ){
                    e.eventInfo.zAxis = e.target.zAxis;
                };
                _.each( e.eventInfo.nodesInfoList , function( node , i ){
                    node.field = self.dataFrame.yAxis.field[ e.eventInfo.iGroup ]
                } );
                
            },
            _bindEvent  : function(){
                var self = this;
                this._graphs.sprite.on("panstart mouseover", function(e){
                    if( self._anchor.enabled ){
                        self._anchor.show();
                    };
                    //console.log(e.eventInfo)
                    if( e.eventInfo ){
                        self._setXaxisYaxisToeventInfo(e);
                        self._tip.show( e );
                    }
                });
                this._graphs.sprite.on("panmove mousemove", function(e){
                    var cross = e.point;
                    if( e.target.id != "induce" ){
                        //那么肯定是从散点上面触发的，
                        cross = e.target.localToGlobal( e.point , self._graphs.sprite );
                        cross.y += self._graphs.h;
                    }
                    if( self._anchor.enabled ){
                        self._anchor.resetCross( cross );
                    }
                    if( e.eventInfo ){
                        self._setXaxisYaxisToeventInfo(e);
                        self._tip.move( e );
                    }

                });
                this._graphs.sprite.on("panend mouseout", function(e){
                    if( self._anchor.enabled ){
                        self._anchor.hide();
                    }
                    if( e.eventInfo ){
                        self._tip.hide( e );
                    }
                });
                this._graphs.sprite.on("tap click", function(e){
                });

            },
            _trimGraphs : function(){
                var xArr     = this._xAxis.dataOrg;
                var yArr     = this._yAxis.dataOrg;
    
                /**
                 *下面三行代码，为了在用户的xAxis.field 和 yAxis.field 数量不同的情况下
                 *自动扔掉多余的field数，保证每个点都有x，y坐标值
                 *这样的情况是散点图和 折线 柱状图 的x 轴不一样的地方
                 */
                var fields   = Math.min(yArr.length , xArr.length);
                xArr.length  = fields;
                yArr.length  = fields;
    
                var xDis    = this._xAxis.xDis;
    
                var maxYAxis = this._yAxis.dataSection[ this._yAxis.dataSection.length - 1 ];
                var maxXAxis = this._xAxis.dataSection[ this._xAxis.dataSection.length - 1 ];
    
                var tmpData  = [];
    
                for( var i = 0 , il = yArr.length; i < il ; i++ ){
                    !tmpData[i] && (tmpData[i] = []);
                    for( var ii = 0 , iil = yArr[i].length ; ii < iil ; ii++ ){
                        var y = -(yArr[i][ii]-this._yAxis._bottomNumber) / (maxYAxis - this._yAxis._bottomNumber) * this._yAxis.yGraphsHeight;
                        var xbaseNum = this._xAxis._baseNumber;
                        if( xbaseNum == undefined || xbaseNum == null ){
                            xbaseNum = this._xAxis._baseNumber = this._xAxis.dataSection[0];
                        };
                        //var x = (xArr[i][ii] - xbaseNum) / (maxXAxis - xbaseNum) * this._xAxis.w;
                        debugger
                        var x = this._xAxis.getPosX( {val : xArr[i][ii]} );
                        tmpData[i][ii] = {
                            //value : {
                            //    x : xArr[i][ii],
                            //    y : yArr[i][ii]
                            //},
                            value : yArr[i][ii],
                            x : x,
                            y : y
                        }
                    }
                }
                
                return tmpData;
            },
            _drawEnd:function(){
                
            }
        });
        
    }
);
