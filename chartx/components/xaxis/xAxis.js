define(
    "chartx/components/xaxis/xAxis" , 
    [
        "canvax/index",
        "canvax/shape/Line",
        "chartx/utils/tools",
        "chartx/utils/deep-extend"
    ],
    function(Canvax, Line , Tools){
        var xAxis = function(opt , data){
            this.w = 0;
            this.h = 0;
    
            this.disY       = 0
            this.dis        = 6;                           //线到文本的距离
    
            this.line = {
                    enabled : 1,                           //是否有line
                    width   : 1,
                    height  : 4,
                    strokeStyle   : '#cccccc'
            }
    
            this.max  = { 
                    left    : 0,                           //第一个文字最左侧坐标的最大值              
                    right   : 0,                           //最后一个文字最右侧坐标的最大值
    
                    txtH    : 14                           //文字最大高
            }
    
            this.text = {
                    mode      : 1,                         //模式(1 = 文字有几个线有几条 | 2 = 线不做过滤)
                    fillStyle : '#999999',
                    fontSize  : 13
            }
    
            //this.display = "block";
            this.enabled = 1 ; //1,0 true ,false 
    
            this.disXAxisLine =  6;                        //x轴两端预留的最小值
            this.disOriginX   =  0;                        //背景中原点开始的x轴线与x轴的第一条竖线的偏移量
            this.xGraphsWidth =  0;                        //x轴宽(去掉两端)
    
            this.dataOrg     = [];                          //源数据
            this.dataSection = [];                          //默认就等于源数据
            this.data        = [];                          //{x:100, content:'1000'}
            this.layoutData  = [];                          //this.data(可能数据过多),重新编排后的数据集合, 并根据此数组展现文字和线条
            this.sprite      = null;
            this.txtSp       = null;
            this.lineSp      = null;
    
            this.init(opt , data)
        };
    
        xAxis.prototype = {
            init:function( opt , data ){
                this.dataOrg = data.org;
    
                if( opt ){
                    _.deepExtend( this , opt );
                }
    
                this.dataSection = this._initDataSection( this.dataOrg );
    
                this.sprite = new Canvax.Display.Sprite({
                    id : "xAxisSprite"
                });
    
                this._checkText();                              //检测
            },
            /**
             *return dataSection 默认为xAxis.dataOrg的的faltten
             *即 [ [1,2,3,4] ] -- > [1,2,3,4]
             */
            _initDataSection : function( data ){
                return _.flatten(data);
            },
            setX:function($n){
                this.sprite.context.x = $n
            },
            setY:function($n){
                this.sprite.context.y = $n
            },
            draw:function(opt){
                // this.data = [{x:0,content:'0000'},{x:100,content:'10000'},{x:200,content:'20000'},{x:300,content:'30000'},{x:400,content:'0000'},{x:500,content:'10000'},{x:600,content:'20000'}]
    
                this._initConfig( opt );
    
                this.data = this._trimXAxis( this.dataSection , this.xGraphsWidth );
    
                this._trimLayoutData();
    
                this.setX( this.pos.x + this.disOriginX );
                this.setY( this.pos.y );
                
                if( this.enabled ){ //this.display != "none"
                    this._widget();
                    this._layout();
                } 
            },
    
            //初始化配置
            _initConfig:function( opt ){
              	if( opt ){
                    _.deepExtend( this , opt );
                }
                this.max.right = this.w;
                this.xGraphsWidth = this.w - this._getXAxisDisLine()
                this.disOriginX   = parseInt((this.w - this.xGraphsWidth) / 2);
    
                this.max.left  += this.disOriginX;
                this.max.right -= this.disOriginX;
            },
            _trimXAxis:function( data , xGraphsWidth ){
                var tmpData = [];
                var dis  = xGraphsWidth / (data.length+1);
                for (var a = 0, al  = data.length; a < al; a++ ) {
                    var o = {
                        'content' : data[a], 
                        'x'       : parseInt( dis * (a+1) )
                    }
                    tmpData.push( o );
                }
                return tmpData;
            },
            _getXAxisDisLine:function(){//获取x轴两端预留的距离
                var disMin = this.disXAxisLine
                var disMax = 2 * disMin
                var dis    = disMin
                dis = disMin + this.w % this.dataOrg.length
                dis = dis > disMax ? disMax : dis
                dis = isNaN(dis) ? 0 : dis
                return dis
            }, 
            _checkText:function(){//检测下文字的高等
                var txt = new Canvax.Display.Text('test',
                       {
                        context : {
                            fontSize    : this.text.fontSize
                       }
                })
                this.max.txtH = txt.getTextHeight();
                if( !this.enabled ){ //this.display == "none"
                    this.h = this.dis;//this.max.txtH;
                } else {
                    this.h = this.disY + this.line.height + this.dis + this.max.txtH
                }
            },
            _widget:function(){
    
                var arr = this.layoutData
    
              	this.txtSp  = new Canvax.Display.Sprite(),  this.sprite.addChild(this.txtSp)
             	this.lineSp = new Canvax.Display.Sprite(),  this.sprite.addChild(this.lineSp)
    
              	for(var a = 0, al = arr.length; a < al; a++){
    
                  	var o = arr[a]
                  	var x = o.x, y = this.disY + this.line.height + this.dis
                  	var content = Tools.numAddSymbol(o.content)
                  	//文字
                  	var txt = new Canvax.Display.Text(content,
                       {
                        context : {
                            x  : x,
                            y  : y,
                            fillStyle   : this.text.fillStyle,
                            fontSize    : this.text.fontSize,
                       }
                  	})
                  	this.txtSp.addChild(txt);
                } 
    
                var arr = this.text.mode == 1 ? this.layoutData : this.data
                for(var a = 0, al = arr.length; a < al; a++){
                    var o = arr[a]
                    var x = o.x
                    //线条
                    var line = new Line({
                        id      : a,
                        context : {
                            xStart      : x,
                            yStart      : this.disY,
                            xEnd        : x,
                            yEnd        : this.line.height + this.disY,
                            lineWidth   : this.line.width,
                            strokeStyle : this.line.strokeStyle
                        }
                    });
                    this.lineSp.addChild(line);
                }
    
               	for(var a = 0, al = this.txtSp.getNumChildren(); a < al; a++){
               		var txt = this.txtSp.getChildAt(a)
               		var x = parseInt(txt.context.x - txt.getTextWidth() / 2)
               		txt.context.x = x
               	}
            },
            /*校验第一个和最后一个文本是否超出了界限。然后决定是否矫正*/
            _layout:function(){
    			var firstText = this.txtSp.getChildAt(0)
    			var popText = this.txtSp.getChildAt(this.txtSp.getNumChildren() - 1)
    
    			if(firstText && firstText.context.x < this.max.left){
    				firstText.context.x = parseInt(this.max.left)
    			}
    			if (popText && (Number(popText.context.x + Number(popText.getTextWidth())) > this.max.right)) {
    				popText.context.x = parseInt(this.max.right - popText.getTextWidth())
    			}
            },
            _trimLayoutData:function(){
                
                var tmp = []
                var arr = this.data
                var textMaxWidth = 0
    
                for(var a = 0, al = arr.length; a < al; a++){
                    var o = arr[a]
                        
                    var content = Tools.numAddSymbol(o.content)
                    var txt = new Canvax.Display.Text(content,
                       {
                        context : {
                            fillStyle   : this.text.fillStyle,
                            fontSize    : this.text.fontSize
                       }
                    })
                    textMaxWidth = Math.max(textMaxWidth, txt.getTextWidth())           //获取文字最大宽
                }
                var maxWidth =  this.max.right                                          //总共能多少像素展现
                var n = Math.min( Math.floor( maxWidth / textMaxWidth ) , arr.length ); //能展现几个
                var dis = Math.max( Math.ceil( arr.length / n - 1 ) , 0 );                            //array中展现间隔
    
    
                //存放展现的数据
                for( var a = 0 ; a < n ; a++ ){
                    var obj = arr[a + dis*a];
                    obj && tmp.push( obj );
                }
     
                this.layoutData = tmp
            }
        };
    
        return xAxis;
    
    } 
)
