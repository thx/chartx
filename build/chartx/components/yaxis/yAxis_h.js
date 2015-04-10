define(    
    "chartx/components/yaxis/yAxis_h" , 
    [
        "canvax/index",
        "canvax/shape/Line",
        "chartx/utils/tools"//,
        // 'chartx/utils/datasection'
    ],
    function( Canvax , Line , Tools){
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
                    //fontSize  : 13//
                    fontSize  : 12
            }
    
            this.data        = [];                          //{y:-100, content:'1000'}
            this.dataOrg     = [];
    
    
            this.sprite      = null;
            this.txtSp       = null;
            this.lineSp      = null;
            
            //yAxis的左上角坐标
            this.x           = 0;
            this.y           = 0;
            
            this.disYAxisTopLine =  6;                       //y轴顶端预留的最小值
            this.yMaxHeight      =  0;                       //y轴最大高
            this.yGraphsHeight   =  0;                       //y轴第一条线到原点的高
            this.yDis1           =  0;                       //y轴每一组的高

            //最终显示到y轴上面的文本的格式化扩展
            //比如用户的数据是80 但是 对应的显示要求确是80%
            //后面的%符号就需要用额外的contentFormat来扩展
            this.textFormat   =  null;   

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
                _.deepExtend( this , opt );
                this._initData( data );
                this.draw();
            },
            draw:function( opt ){
                opt && _.deepExtend( this , opt );            
    
                this.yGraphsHeight = this.yMaxHeight  - this._getYAxisDisLine();
                this.yDis1         = this.yGraphsHeight / this.dataOrg.length 
    
                this.setX( this.pos.x );
                this.setY( this.pos.y );
                this._trimYAxis();
                this._widget();
            },
            _trimYAxis:function(){
                var arr = this.dataOrg
                var tmpData = [];
                for(var a = 0, al = arr.length; a < al; a++){
                    var y = - (a + 1) * this.yDis1 + this.yDis1 / 2
                    y = isNaN(y) ? 0 : parseInt(y);
                    tmpData[a] = {content:this.dataOrg[a], y:y}
                }
                this.data = tmpData
             },
            _getYAxisDisLine:function(){                   //获取y轴顶高到第一条线之间的距离         
                var disMin = this.disYAxisTopLine
                var disMax = 2 * disMin
                var dis    = disMin
                dis = disMin + this.yMaxHeight % this.dataOrg.length;
                dis = dis > disMax ? disMax : dis
                return dis
            },
            _initData  : function( data ){ 
                this.dataOrg     = data.org[0];
            },
            _widget:function(){
                var self  = this;
                if( !self.enabled ){
                    self.w = 0;
                    return;
                }
                
                self.txtSp  = new Canvax.Display.Sprite(),  self.sprite.addChild(self.txtSp)
                self.lineSp = new Canvax.Display.Sprite(),  self.sprite.addChild(self.lineSp)
                
                var arr = this.data
                var maxW = 0;
                for(var a = 0, al = arr.length; a < al; a++){
                    var o = arr[a];
                    var x = 0, y = o.y;
                    
                    var content = Tools.numAddSymbol( o.content );

                    if( _.isFunction(self.textFormat) ){
                        content = self.textFormat( content );
                    }

                    //文字
                    var txt = new Canvax.Display.Text( content ,
                       {
                        context : {
                            x  : x,
                            y  : y,
                            fillStyle    : self.text.fillStyle,
                            fontSize     : self.text.fontSize,
                            // textBackgroundColor:'#0000ff',
                            textAlign    : "right",
                            textBaseline : "middle"
                       }
                    })
    
    
                    self.txtSp.addChild(txt);
                    maxW = Math.max(maxW, txt.getTextWidth());
    
                    //线条
                    var line = new Line({
                        id      : a,
                        context : {
                            x           : 0,
                            y           : y,
                            xEnd        : self.line.width,
                            yEnd        : 0,
                            lineWidth   : self.line.height,
                            strokeStyle : self.line.strokeStyle
                        }
                    })
                    self.lineSp.addChild(line)
                }
                self.txtSp.context.x  = maxW;
                self.lineSp.context.x = maxW + self.dis
                if(self.line.enabled){
                    self.w = maxW + self.dis + self.line.width
                } else {
                    self.lineSp.context.visible = false
                    self.w = maxW + self.dis;
                }
            }
        };
        return  yAxis;
    } 
)
