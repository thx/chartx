KISSY.add("dvix/components/yaxis/yAxis" , function(S, Dvix , Line , Tools , DataSection){
    var Canvax = Dvix.Canvax;
    var yAxis = function(opt , data){
        this.w = 0;

        this.mode = 1                                  //模式( 1 = 正常 | 2 = 显示两条(最下面 + 最上面 且与背景线不对其))
        this.dis  = 6                                  //线到文本的距离

        this.line = {
                enabled : 1,                           //是否有line
                width   : 6,
                height  : 3,
                strokeStyle   : '#BEBEBE'
        }

        this.text = {
                fillStyle : 'blank',
                //fontSize  : 13//
                fontSize  : 12
        }

        this.data        = [];                          //{y:-100, content:'1000'}
        this.dataSection = [];
        this.sprite      = null;
        this.txtSp       = null;
        this.lineSp      = null;
        
        //yAxis的左上角坐标
        this.x           = 0;
        this.y           = 0;
        
        this._disYAxisTopLine =  6;                       //y轴顶端预留的最小值
        this._yMaxHeight      =  0;                       //y轴最大高
        this._yGraphsHeight   =  0;                       //y轴第一条线到原点的高

        this.init(opt , data);
    };

    yAxis.prototype = {
        init:function( opt , data ){
            this._initConfig( opt );
            this._initData( data );
            this.sprite = new Canvax.Display.Sprite();
        },
        setX:function($n){
            this.sprite.context.x = $n
        },
        setY:function($n){
            this.sprite.context.y = $n
        },
        draw:function( opt ){
            //self._configData(opt)
            if( opt.pos ){
                opt.pos.x && (this.x = opt.pos.x);
                opt.pos.y && (this.y = opt.pos.y);
            }
            opt.yMaxHeight && ( this._yMaxHeight = opt.yMaxHeight );
            
            this._yGraphsHeight = this._yMaxHeight  - this._getYAxisDisLine();

            this.setX( this.x );
            this.setY( this.y );
            this._trimYAxis();
            this._widget();
        },
        _trimYAxis:function(){
            var max = this.dataSection[ this.dataSection.length - 1 ];
            var tmpData = []
            for (var a = 0, al = this.dataSection.length; a < al; a++ ) {
                var y = - (this.dataSection[a] - this._baseNumber) / (max - this._baseNumber) * this._yGraphsHeight
                y = isNaN(y) ? 0 : parseInt(y)                                                    
                tmpData[a] = { 'content':this.dataSection[a], 'y': y }
            }
            this.data = tmpData
        },
        _getYAxisDisLine:function(){                   //获取y轴顶高到第一条线之间的距离         
            var disMin = this._disYAxisTopLine
            var disMax = 2 * disMin
            var dis    = disMin
            dis = disMin + this._yMaxHeight % this.dataSection.length;
            dis = dis > disMax ? disMax : dis
            return dis
        },
        _initData  : function( data ){

            var arr = Tools.getChildsArr( data.org );
            this.dataSection = DataSection.section(arr);
            this._baseNumber = this.dataSection[0];
            if(arr.length == 1){
                this.dataSection[0] = arr[0] * 2;
                this._baseNumber    = 0;
            }


        },
        //初始化配置
        _initConfig: function(opt){
          var self = this
            if(opt){
                self.dis  = opt.dis || opt.dis == 0 ? opt.dis : self.dis
                self.mode = opt.mode|| self.mode

                var line = opt.line

                self._disYAxisTopLine = (opt.disYAxisTopLine || opt.disYAxisTopLine == 0) ? opt.disYAxisTopLine : self._disYAxisTopLine
                
                if(line){
                    self.line.enabled = line.enabled == 0 ? 0 : self.line.enabled;
                    self.line.strokeStyle = line.strokeStyle || self.line.strokeStyle
                }

                var text = opt.text
                if(text){
                    self.text.fillStyle = text.fillStyle || self.text.fillStyle
                    self.text.fontSize  = text.fontSize  || self.text.fontSize
                }
            }
        },

        //配置数据
        /*
        _configData:function(opt){
            var self = this
            var opt = opt || {}

            self.data  = opt.data  || [];
        },
        */

        _widget:function(){
            var self  = this;
            var arr = this.data

            if(self.mode == 2){
                var tmp = []
                if(arr.length > 2){
                    tmp.push(arr[0]), tmp.push(arr[arr.length - 1])
                    arr = tmp
                }
            }

            self.txtSp  = new Canvax.Display.Sprite(),  self.sprite.addChild(self.txtSp)
            self.lineSp = new Canvax.Display.Sprite(),  self.sprite.addChild(self.lineSp)

            var maxW = 0;
            for(var a = 0, al = arr.length; a < al; a++){
                var o = arr[a]
                var x = 0, y = o.y
                var content = Tools.numAddSymbol(o.content)
                //文字
                var txt = new Canvax.Display.Text(content,
                   {
                    context : {
                        x  : x,
                        y  : y,
                        fillStyle    : self.text.fillStyle,
                        fontSize     : self.text.fontSize,
                        // textBackgroundColor:'#0000ff',
                        textAlign    : self.mode == 2 ? "left" : "right",
                        textBaseline : "middle"
                   }
                })

                if(self.mode == 2){
                    if(arr.length == 2){
                        var h = txt.getTextHeight()
                        if(a == 0){
                            txt.context.y = y - parseInt(h / 2) - 2
                        }else if(a == 1){
                            txt.context.y = y + parseInt(h / 2) + 2
                        }
                    }
                }

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
            self.txtSp.context.x  = self.mode == 2 ? 0 : maxW;
            self.lineSp.context.x = maxW + self.dis

            if(self.line.enabled){
                self.w = maxW + self.dis + self.line.width
            } else {
                self.lineSp.context.visible = false
                self.w = maxW 
            }
        }
    };

    return  yAxis;

} , {
    requires : [
        "dvix/",
        "canvax/shape/Line",
        "dvix/utils/tools",
        'dvix/utils/datasection'
    ] 
})
