define(
    "chartx/components/markline/index",
    [
         "canvax/index",
         "canvax/shape/BrokenLine",
         "canvax/display/Sprite",
         "canvax/display/Text"
    ],
    function(Canvax, BrokenLine, Sprite, Text){
        var markLine = function(opt , _yAxis){
            this._yAxis = _yAxis;
            this.w      = 0;
            this.h      = 0
            this.field  = null;
            this.origin = {
                x : 0 , y : 0
            };

            this.target = null; //默认给所有字段都现实一条markline，有设置的话，配置给固定的几个 field 显示markline
            this.value = 0;
            this.line       = {
                y           : 0,
                list        : [],
                strokeStyle : '#999',
                lineWidth   : 1,
                smooth      : false,
                lineType    : 'dashed'
            };

            this.text = {
                enabled  : false,
                content  : '',
                fillStyle: '#999999',
                fontSize : 12,
                format   : null,
                lineType : 'dashed',
                lineWidth: 1,
                strokeStyle : "white"
            };

            this.filter = function( ){
                
            };

            this._doneHandle = null;
            this.done   = function( fn ){
                this._doneHandle = fn;
            };
            this.txt = null;

            this._line = null;
           
            opt && _.deepExtend(this, opt);
            this.init();
        }
        markLine.prototype = {
            init : function(){
                var me = this;

                this.sprite  = new Sprite({ 
                    context : {
                        x : this.origin.x,
                        y : this.origin.y
                    }
                });
                setTimeout( function(){
                    me.widget();
                } , 10 );
            },
            widget : function(){
                var me = this;

                var line = new BrokenLine({               //线条
                    id : "line",
                    context : {
                        y           : me.line.y,
                        pointList   : me.line.list,
                        strokeStyle : me.line.strokeStyle,
                        lineWidth   : me.line.lineWidth,
                        lineType    : me.line.lineType
                    }
                });
                me.sprite.addChild(line);
                me._line = line;


                if(me.text.enabled){
                    var txt = new Text(me.text.content, {           //文字
                        context : me.text
                    })
                    this.txt = txt
                    me.sprite.addChild(txt)

                    if(_.isNumber(me.text.x)){
                        txt.context.x = me.text.x, txt.context.y = me.text.y
                    }else{
                        txt.context.x = this.w - txt.getTextWidth() 
                        txt.context.y = me.line.y - txt.getTextHeight()
                    }
                }

                me._done();
                me.filter( me );
            },
            _done : function(){
                _.isFunction( this._doneHandle ) && this._doneHandle.apply( this , [] );
            },
            reset : function(opt , i){
                opt && _.deepExtend(this, opt);
                if( this.line.y != this._line.context.y ){
                    this._line.animate({
                        y: this.line.y
                    }, {
                        duration: 500,
                        easing: 'Back.Out' //Tween.Easing.Elastic.InOut
                    });
                }
            }
        }
        return markLine
    } 
);
