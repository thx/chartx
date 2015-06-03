define(
    "chartx/components/xaxis/xAxis_h" , 
    [
        "canvax/index",
        "canvax/shape/Line",
        "chartx/utils/tools",
        'chartx/utils/datasection'
    ],
    function(Canvax, Line , Tools, DataSection){
        var xAxis = function(opt , data){
            this.graphw = 0;
            this.graphh = 0;
            this.yAxisW = 0;
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
    
            // this.max  = { 
            //         left    : 0,                           //第一个文字最左侧坐标的最大值              
            //         right   : 0,                           //最后一个文字最右侧坐标的最大值
    
            //         txtH    : 14                           //文字最大高
            // }
    
            this.text = {
                    // mode      : 1,                         //模式(1 = 文字有几个线有几条 | 2 = 线不做过滤)
                    dis       : 0,                         //间隔(间隔几个文本展现)
                    fillStyle : '#999999',
                    fontSize  : 13,
                    rotation  : 0
            }
            this.maxTxtH = 0;

            this.pos = {
                x  : null,
                y  : null
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
            // this.txtSp       = null;
            // this.lineSp      = null;

            this._textMaxWidth = 0;
            this.leftDisX      = 0;                         //x轴最左边需要的间距。默认等于第一个x value字符串长度的一半

            this.textFormat  = null;
    
            this.init(opt , data)
        };
    
        xAxis.prototype = {
            init:function( opt , data ){
                _.deepExtend( this , opt );
                this._initData(data)
                this.text.rotation = -Math.abs( this.text.rotation );
                this.sprite = new Canvax.Display.Sprite({id : "xAxisSprite"});
                this._getTextMaxWidth();
                this._checkText();                              //检测
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
                this._trimXAxis()
                this._trimLayoutData();

                this.setX( this.pos.x ); //+ this.disOriginX );
                this.setY( this.pos.y );
                
                if( this.enabled ){ //this.display != "none"
                    this._widget();
                    if( !this.text.rotation ){
                        this._layout();
                    }
                }
                // this.data = this.layoutData
            },
    
            //初始化配置
            _initConfig:function( opt ){
              	if( opt ){
                    _.deepExtend( this , opt );
                }
                /*
                this.max.right = this.w;
                this.xGraphsWidth = this.w - this._getXAxisDisLine()
                this.disOriginX   = parseInt((this.w - this.xGraphsWidth) / 2);

                this.max.left  += this.disOriginX;
                this.max.right -= this.disOriginX;
                */
                // console.log(this.graphw, this.yAxisW)
                this.yAxisW = Math.max( this.yAxisW , this.leftDisX );
                this.w      = this.graphw - this.yAxisW;
                if( this.pos.x == null ){
                    this.pos.x =  this.yAxisW + this.disOriginX;
                }
                if( this.pos.y == null ){
                    this.pos.y =  this.graphh - this.h;
                }

                this.xGraphsWidth = this.w - this._getXAxisDisLine()
                this.disOriginX   = parseInt((this.w - this.xGraphsWidth) / 2);
            },
            _trimXAxis:function(){
                var arr = this.dataSection
                var tmpData = [];
                var max = this.dataSection[this.dataSection.length - 1]
                for (var a = 0, al  = arr.length; a < al; a++ ) {
                    var x = arr[a] / max * this.xGraphsWidth
                    x = isNaN(x) ? 0 : parseInt(x);
                    tmpData[a] = {content:this.dataSection[a], x:x}
                }
                this.data = tmpData
            },
            _getXAxisDisLine:function(){//获取x轴两端预留的距离
                var disMin = this.disXAxisLine
                var disMax = 2 * disMin
                var dis    = disMin
                dis = disMin + this.w % this.dataSection.length
                dis = dis > disMax ? disMax : dis
                dis = isNaN(dis) ? 0 : dis
                return dis
            }, 
            _initData  : function( data ){ 
                var arr =  _.flatten(data.org)
                this.dataOrg = data.org;

                this.dataSection = DataSection.section( arr , 3 );
            },
            _checkText:function(){//检测下文字的高等
                /*
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
                */
                if( !this.enabled ){ //this.display == "none"
                    this.h = this.dis;//this.max.txtH;
                } else {
                    var txt = new Canvax.Display.Text( this.dataSection[0] ,
                                {
                                    context : {
                                        fontSize    : this.text.fontSize
                                    }
                                });
                    this.maxTxtH = txt.getTextHeight();
                    
                    if( !!this.text.rotation ){
                        this.h = Math.cos(Math.abs( this.text.rotation ) * Math.PI / 180) * this._textMaxWidth;
                        this.leftDisX = Math.cos(Math.abs( this.text.rotation ) * Math.PI / 180)*txt.getTextWidth() + 8;
                    } else {
                        this.h = this.disY + this.line.height + this.dis + this.maxTxtH;
                        this.leftDisX = txt.getTextWidth() / 2;
                    }
                }
            },
            _widget:function(){
                /*
                var self = this
                var arr = this.layoutData
    
              	this.txtSp  = new Canvax.Display.Sprite(),  this.sprite.addChild(this.txtSp)
             	this.lineSp = new Canvax.Display.Sprite(),  this.sprite.addChild(this.lineSp)
              	for(var a = 0, al = arr.length; a < al; a++){
                  	var o = arr[a]
                  	var x = o.x, y = this.disY + this.line.height + this.dis

                  	var content = Tools.numAddSymbol(o.content)

                    if( _.isFunction(self.textFormat) ){
                        content = self.textFormat( content );
                    }

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
    
                // var arr = this.text.mode == 1 ? this.layoutData : this.data
                var arr = this.data
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
                */
                var arr = this.layoutData

                for(var a = 0, al = arr.length; a < al; a++){
    
                    var xNode = new Canvax.Display.Sprite({id : "xNode"+a});

                    var o = arr[a]
                    var x = o.x, y = this.disY + this.line.height + this.dis

                    var content = Tools.numAddSymbol(o.content);
                    //文字
                    var txt = new Canvax.Display.Text(content,
                       {
                        context : {
                            x  : x,
                            y  : y,
                            fillStyle   : this.text.fillStyle,
                            fontSize    : this.text.fontSize,
                            rotation    : this.text.rotation,
                            textAlign   : !!this.text.rotation ? "right"  : "left",
                            textBaseline: !!this.text.rotation ? "middle" : "top"
                       }
                    });
                    xNode.addChild(txt);
                    if( !this.text.rotation ){
                        txt.context.x = parseInt(txt.context.x - txt.getTextWidth() / 2) ;
                    } else {
                        txt.context.x += 5;
                        txt.context.y += 3;
                    }

                    //线条
                    var line = new Line({
                        context : {
                            xStart      : x,
                            yStart      : this.disY,
                            xEnd        : x,
                            yEnd        : this.line.height + this.disY,
                            lineWidth   : this.line.width,
                            strokeStyle : this.line.strokeStyle
                        }
                    });
                    xNode.addChild( line );

                    //这里可以由用户来自定义过滤 来 决定 该node的样式
                    _.isFunction(this.filter) && this.filter({
                        layoutData  : arr,
                        index       : a,
                        txt         : txt,
                        line        : line
                    });

                    this.sprite.addChild( xNode );
                };
            },
            /*校验第一个和最后一个文本是否超出了界限。然后决定是否矫正*/
            _layout:function(){
                /*
    			var firstText = this.txtSp.getChildAt(0)
    			var popText = this.txtSp.getChildAt(this.txtSp.getNumChildren() - 1)
    
    			if(firstText && firstText.context.x < this.max.left){
    				firstText.context.x = parseInt(this.max.left)
    			}
    			if (popText && (Number(popText.context.x + Number(popText.getTextWidth())) > this.max.right)) {
    				popText.context.x = parseInt(this.max.right - popText.getTextWidth())
    			}
                */
                var popText = this.sprite.getChildAt(this.sprite.getNumChildren() - 1).getChildAt(0);
                // console.log(this.w,popText.getTextWidth() )
                if (popText && (Number(popText.context.x + Number(popText.getTextWidth())) > this.w)) {
                    popText.context.x = parseInt(this.w - popText.getTextWidth())
                    // console.log(popText.context.x)
                }
            },
            _getTextMaxWidth : function(){
                var arr = this.dataSection;
                var maxLenText   = arr[0];
                for( var a=0,l=arr.length ; a < l ; a++ ){
                    if( arr[a].length > maxLenText.length ){
                        maxLenText = arr[a];
                    }
                };
                       
                var txt = new Canvax.Display.Text( maxLenText ,
                    {
                    context : {
                        fillStyle   : this.text.fillStyle,
                        fontSize    : this.text.fontSize
                    }
                })

                this._textMaxWidth = txt.getTextWidth();

                return this._textMaxWidth;
            },
            _trimLayoutData:function(){
                /*
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
                // console.log(Math.floor( maxWidth / (textMaxWidth + 30) ), arr.length)
                var n = Math.min( Math.floor( maxWidth / textMaxWidth ) , arr.length ); //能展现几个
                var dis = Math.max( Math.ceil( arr.length / n - 1 ) , 0 );                            //array中展现间隔
                if(this.text.dis){
                    dis = this.text.dis
                }

                //存放展现的数据
                for( var a = 0 ; a < n ; a++ ){
                    var obj = arr[a + dis*a];
                    obj && tmp.push( obj );
                }
     
                this.layoutData = tmp
                */
                if(this.text.rotation){
                    //如果 有 选择的话，就不需要过滤x数据，直接全部显示了
                    this.layoutData = this.data;
                    return;
                }
                var tmp = []
                var arr = this.data
    
                //总共能多少像素展现
                var n = Math.min( Math.floor( this.w / this._textMaxWidth ) , arr.length ); //能展现几个
                var dis = Math.max( Math.ceil( arr.length / n - 1 ) , 0 );                  //array中展现间隔
                if(this.text.dis){
                    dis = this.text.dis
                }

                //存放展现的数据
                for( var a = 0 ; a < n ; a++ ){
                    var obj = arr[a + dis*a];
                    obj && tmp.push( obj );
                }
     
                this.layoutData    = tmp;
            }
        };
    
        return xAxis;
    
    } 
)
