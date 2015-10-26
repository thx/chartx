define(    
    "chartx/components/yaxis/yAxis" , 
    [
        "canvax/index",
        "canvax/shape/Line",
        "chartx/utils/tools",
        'chartx/utils/datasection'
    ],
    function( Canvax , Line , Tools , DataSection){
        var yAxis = function(opt , data ){
            
            this.w = 0;
            this.enabled = 1;//true false 1,0都可以
            this.dis  = 6                                  //线到文本的距离

            this.label = "";
            this._label= null; //label的text对象
    
            this.line = {
                    enabled : 1,                           //是否有line
                    width   : 4,
                    lineWidth  : 1,
                    strokeStyle   : '#BEBEBE'
            };

            this.text = {
                    fillStyle : '#999999',
                    fontSize  : 12,
                    format    : null,
                    rotation  : 0
                    
            };
            this.pos         = {
                x : 0 , y : 0
            };  
            this.place       = "left";                       //yAxis轴默认是再左边，但是再双轴的情况下，可能会right
            this.biaxial     = false;                        //是否是双轴中的一份
            this.layoutData  = [];                           //dataSection对应的layout数据{y:-100, content:'1000'}
            this.dataSection = [];                           //从原数据dataOrg 中 结果datasection重新计算后的数据
            this.dataOrg     = [];                           //源数据

            this.sprite      = null;
            //this.x           = 0;
            //this.y           = 0;
            this.disYAxisTopLine =  6;                       //y轴顶端预留的最小值
            this.yMaxHeight      =  0;                       //y轴最大高
            this.yGraphsHeight   =  0;                       //y轴第一条线到原点的高

            this.baseNumber      =  null;
            this.basePoint       =  null;                    //value为baseNumber的point {x,y}
            
            //过滤器，可以用来过滤哪些yaxis 的 节点是否显示已经颜色之类的
            //@params params包括 dataSection , 索引index，txt(canvax element) ，line(canvax element) 等属性
            this.filter          =  null; //function(params){}; 

            this.isH             =  false;

            this.init(opt , data);
        };
    
        yAxis.prototype = {
            init:function( opt , data ){
                _.deepExtend( this , opt );

                if( this.text.rotation != 0 && this.text.rotation % 90 == 0 ){
                    this.isH = true;
                }

                this._initData( data );
                this.sprite = new Canvax.Display.Sprite();
            },
            setX:function($n){
                this.sprite.context.x = $n
            },
            setY:function($n){
                this.sprite.context.y = $n
            },
            setAllStyle : function( sty ){
                _.each(this.sprite.children,function( s ){
                    _.each( s.children , function( cel ){
                        if( cel.type == "text" ){
                            cel.context.fillStyle = sty;
                        } else if( cel.type == "line" ) {
                            cel.context.strokeStyle = sty;
                        }
                    } );
                });
            },
            //删除一个字段
            update : function( opt , data ){
                //先在field里面删除一个字段，然后重新计算
                this.sprite.removeAllChildren();
                this.dataSection = [];
                _.deepExtend( this , opt );
                this._initData( data );
                this.draw();
            },
            _getLabel  : function(){
                if( this.label && this.label!="" ){
                    this._label = new Canvax.Display.Text(this.label, {
                        context: {
                            fontSize: this.text.fontSize,
                            textAlign: "left",
                            textBaseline: this.isH ? "top" : "bottom",
                            fillStyle: this.text.fillStyle,
                            rotation: this.isH ? -90 : 0
                        }
                    });
                }
            },
            draw:function( opt ){
                opt && _.deepExtend( this , opt );   
                this._getLabel();
                this.yGraphsHeight = this.yMaxHeight  - this._getYAxisDisLine();
                
                if( this._label ){
                    if (this.isH) {
                        this.yGraphsHeight -= this._label.getTextWidth();
                    } else {
                        this.yGraphsHeight -= this._label.getTextHeight();
                    }
                    this._label.context.y = -this.yGraphsHeight-5;
                };
                this.setX( this.pos.x );
                this.setY( this.pos.y );
                this._trimYAxis();
                this._widget();
            },
            _trimYAxis:function(){
                var max = this.dataSection[ this.dataSection.length - 1 ];
                var tmpData = [];
                for (var a = 0, al = this.dataSection.length; a < al; a++ ) {
                    var y = - (this.dataSection[a] - this._bottomNumber) / (max - this._bottomNumber) * this.yGraphsHeight;
                    y = isNaN(y) ? 0 : parseInt(y);                                                    
                    tmpData[a] = { content : this.dataSection[a] , y : y };
                }

                this.layoutData = tmpData;

                //设置basePoint
                var basePy = - (this.baseNumber - this._bottomNumber) / (max - this._bottomNumber) * this.yGraphsHeight;
                basePy = isNaN(basePy) ? 0 : parseInt(basePy); 
                this.basePoint = {
                    content : this.baseNumber ,
                    y       : basePy
                }
            },
            _getYAxisDisLine:function(){                   //获取y轴顶高到第一条线之间的距离         
                var disMin = this.disYAxisTopLine
                var disMax = 2 * disMin
                var dis    = disMin
                dis = disMin + this.yMaxHeight % this.dataSection.length;
                dis = dis > disMax ? disMax : dis
                return dis
            },
            _setDataSection : function( data ){
                var arr = [];
                if( !this.biaxial ){
                    arr = _.flatten( data.org ); //Tools.getChildsArr( data.org );
                } else {
                    if( this.place == "left" ){
                        arr = data.org[0];
                        this.field = this.field[0];
                    } else {
                        arr = data.org[1];
                        this.field = this.field[1];
                    }
                }
                return arr;
            },
            _initData  : function( data ){ 
                var arr = this._setDataSection(data);
                this.dataOrg     = data.org; //这里必须是data.org
                if( this.dataSection.length == 0 ){
                    this.dataSection = DataSection.section( arr , 3 );
                };
                //如果还是0
                if( this.dataSection.length == 0 ){
                    this.dataSection = [0]
                }
                this._bottomNumber = this.dataSection[0];
                /*
                if(arr.length == 1){
                    this.dataSection[0] = arr[0] * 2;
                    this._bottomNumber  = 0;
                }
                */
                if( this.baseNumber == null ){
                    this.baseNumber = this._bottomNumber > 0 ? this._bottomNumber : 0;
                }
            },
            resetWidth : function( w ){
                var self = this;
                self.w   = w;
                if( self.line.enabled ){
                    self.sprite.context.x = w - self.dis - self.line.width;
                } else {
                    self.sprite.context.x = w - self.dis;
                }
            },
            _widget:function(){
                var self  = this;
                if( !self.enabled ){
                    self.w = 0;
                    return;
                }
                var arr = this.layoutData;
                var maxW = 0;
                self._label && self.sprite.addChild( self._label );
                for(var a = 0, al = arr.length; a < al; a++){
                    var o = arr[a];
                    var x = 0, y = o.y;
                    var content = o.content
                    if( _.isFunction(self.text.format) ){
                        content = self.text.format(content , self);
                    } else {
                        content = Tools.numAddSymbol(content);
                    }
                    var yNode = new Canvax.Display.Sprite({ id : "yNode"+a });
                     
                 　 var textAlign = (self.place == "left" ? "right" : "left");
                    //为横向图表把y轴反转后的 逻辑
                    if( self.text.rotation == 90 || self.text.rotation == -90 ){
                        textAlign = "center";
                        if( a == arr.length - 1 ){
                            textAlign = "right";
                        }
                    };
                    var posy = y + ( a == 0 ? -3 : 0 ) + ( a == arr.length-1 ? 3 : 0 );
                    //为横向图表把y轴反转后的 逻辑
                    if( self.text.rotation == 90 || self.text.rotation == -90 ){
                        if( a == arr.length - 1 ){
                            posy = y - 2;
                        }
                        if( a == 0 ){
                            posy = y;
                        }
                    };

                    //文字
                    var txt = new Canvax.Display.Text( content ,
                       {
                        context : {
                            x  : x + ( self.place == "left" ? -5 : 5 ),
                            y  : posy,
                            fillStyle    : self.text.fillStyle,
                            fontSize     : self.text.fontSize,
                            rotation     : -Math.abs(this.text.rotation),
                            textAlign    : textAlign,
                            textBaseline : "middle"
                       }
                    });
                    yNode.addChild( txt );
    
                    maxW = Math.max(maxW, txt.getTextWidth());
                    if( self.text.rotation == 90 || self.text.rotation == -90 ){
                        maxW = Math.max(maxW, txt.getTextHeight());
                    }
    
                    if( self.line.enabled ){
                        //线条
                        var line = new Line({
                            context : {
                                x           : 0 + ( self.place == "left" ? +1 : -1 ) * self.dis - 2,
                                y           : y,
                                xEnd        : self.line.width,
                                yEnd        : 0,
                                lineWidth   : self.line.lineWidth,
                                strokeStyle : self.line.strokeStyle
                            }
                        });                 
                        yNode.addChild( line );
                    }; 
                    //这里可以由用户来自定义过滤 来 决定 该node的样式
                    _.isFunction(self.filter) && self.filter({
                        layoutData  : self.layoutData,
                        index       : a,
                        txt         : txt,
                        line        : line
                    });

                    self.sprite.addChild( yNode );
                };

                maxW += self.dis;
                 
                self.sprite.context.x = maxW + self.pos.x;
                if( self.line.enabled ){
                    self.w = maxW + self.dis + self.line.width + self.pos.x;
                } else {
                    self.w = maxW + self.dis + self.pos.x;
                }
            }
        };

        return  yAxis;
    } 
)
