define(    
    "chartx/components/yaxis/yAxis" , 
    [
        "canvax/index",
        "canvax/shape/Line",
        "chartx/utils/tools",
        'chartx/utils/datasection'
    ],
    function( Canvax , Line , Tools , DataSection){
        var yAxis = function(opt , data){
            this.w = 0;
            this.enabled = 1;//true false 1,0都可以
            this.dis  = 6                                  //线到文本的距离
            this.line = {
                    enabled : 1,                           //是否有line
                    width   : 6,
                    height  : 3,
                    strokeStyle   : '#BEBEBE'
            }
            this.text = {
                    fillStyle : '#999999',
                    fontSize  : 12,
                    textAlign : "right",
                    format    : null
            }
            this.layoutData  = [];                           //dataSection对应的layout数据{y:-100, content:'1000'}
            this.dataSection = [];                           //从原数据dataOrg 中 结果datasection重新计算后的数据
            this.dataOrg     = [];                           //源数据

            this.sprite      = null;
            this.x           = 0;
            this.y           = 0;
            this.disYAxisTopLine =  6;                       //y轴顶端预留的最小值
            this.yMaxHeight      =  0;                       //y轴最大高
            this.yGraphsHeight   =  0;                       //y轴第一条线到原点的高

            this.baseNumber      =  null;
            this.basePoint       =  null;                    //value为baseNumber的point {x,y}
            
            //过滤器，可以用来过滤哪些yaxis 的 节点是否显示已经颜色之类的
            //@params params包括 dataSection , 索引index，txt(canvax element) ，line(canvax element) 等属性
            this.filter          =  null; //function(params){}; 

            this.init(opt , data);
        };
    
        yAxis.prototype = {
            init:function( opt , data ){
                _.deepExtend( this , opt );
                this._initData( data );
                this.sprite = new Canvax.Display.Sprite();
            },
            setX:function($n){
                this.sprite.context.x = $n
            },
            setY:function($n){
                this.sprite.context.y = $n
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
            draw:function( opt ){
                opt && _.deepExtend( this , opt );            
                this.yGraphsHeight = this.yMaxHeight  - this._getYAxisDisLine();
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
            _initData  : function( data ){ 
                
                var arr = _.flatten( data.org ); //Tools.getChildsArr( data.org );
                this.dataOrg     = data.org;
                
                if( this.dataSection.length == 0 ){
                    //if( !this.enabled ){
                    //    arr.unshift( 0 );
                    //} 
                    this.dataSection = DataSection.section( arr , 3 );
                };

                //如果还是0
                if( this.dataSection.length == 0 ){
                    this.dataSection = [0]
                }
                this._bottomNumber = this.dataSection[0];
                if(arr.length == 1){
                    this.dataSection[0] = arr[0] * 2;
                    this._bottomNumber  = 0;
                }
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
                for(var a = 0, al = arr.length; a < al; a++){
                    var o = arr[a];
                    var x = 0, y = o.y;
                    var content = o.content
                    if( _.isFunction(self.text.format) ){
                        content = self.text.format(content );
                    }else{
                        content = Tools.numAddSymbol(content);
                    }
                    var yNode = new Canvax.Display.Sprite({ id : "yNode"+a });

                    //文字
                    var txt = new Canvax.Display.Text( content ,
                       {
                        context : {
                            x  : x,
                            y  : y,
                            fillStyle    : self.text.fillStyle,
                            fontSize     : self.text.fontSize,
                            textAlign    : self.text.textAlign,
                            textBaseline : "middle"
                       }
                    });
                    yNode.addChild( txt );
    
                    maxW = Math.max(maxW, txt.getTextWidth());
    
                    if( self.line.enabled ){
                        //线条
                        var line = new Line({
                            context : {
                                x           : 0 + self.dis,
                                y           : y,
                                xEnd        : self.line.width,
                                yEnd        : 0,
                                lineWidth   : self.line.height,
                                strokeStyle : self.line.strokeStyle
                            }
                        });                 
                        yNode.addChild( line );
                    }; 

                    //这里可以由用户来自定义过滤 来 决定 该node的样式
                    _.isFunction(self.filter) && self.filter({
                        layoutData  : self.dataSection,
                        index       : a,
                        txt         : txt,
                        line        : line
                    });

                    self.sprite.addChild( yNode );
                };

                maxW += self.dis;
                self.sprite.context.x = maxW;
                if( self.line.enabled ){
                    self.w = maxW + self.dis + self.line.width
                } else {
                    self.w = maxW + self.dis;
                }
            }
        };

        return  yAxis;
    } 
)
