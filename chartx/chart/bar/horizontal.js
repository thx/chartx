define(
    "chartx/chart/bar/horizontal",
    [
        'chartx/chart/bar/index'
    ],
    function( Bar ){
        return Bar.extend( {
            init:function(node , data , opts){
                this._opts = opts;
                _.deepExtend( this , opts );
                _.deepExtend( this , {
                    xAxis : {
                        text : {
                            rotation : 90
                        }
                    },
                    yAxis : {
                        text : {
                            rotation : 90
                        }
                    }
                } );
                this.dataFrame = this._initData( data );
            },
            draw:function(){
                this._setStages();
                this._initModule();                        //初始化模块
                this._startDraw({ w : this.height , h : this.width });                         //开始绘图
                this._horizontal();
                this._drawEnd();                         //绘制结束，添加到舞台
            },
            _horizontal : function(){
                var me = this;
                
                _.each( [me.core.context , me.stageBg.context ] , function( ctx ){
                    ctx.x += (me.width  - me.height) / 2;
                    ctx.y += (me.height - me.width ) / 2;
                    ctx.rotation = 90;
                    ctx.rotateOrigin.x = me.height/2;
                    ctx.rotateOrigin.y = me.width/2;
                    
                    ctx.scaleOrigin.x  = me.height/2;
                    ctx.scaleOrigin.y  = me.width/2;
                    ctx.scaleX         = -1;
                });

                _.each( me._graphs.txtsSp.children , function(text){
                    var ctx  = text.context;
                    var rect = text.getRect();
                    
                    ctx.scaleOrigin.x = rect.x + rect.width/2;
                    ctx.scaleOrigin.y = rect.y + rect.height/2 ;
                    ctx.scaleX        = -1;
                    ctx.rotation      = 90;
                    ctx.rotateOrigin.x =  rect.x + rect.width/2;
                    ctx.rotateOrigin.y =  rect.y + rect.height/2;
                    //ctx.x            += rect.width
                } );

            
                //把x轴文案做一次镜像反转
                _.each( this._xAxis.sprite.children , function( xnode ){
                    var text = xnode.children ? xnode.children[0] : xnode;
                    var ctx  = text.context;
                    var rect = text.getRect();
                    ctx.scaleOrigin.x = rect.x + rect.width/2;
                    ctx.scaleOrigin.y = rect.y + rect.height/2;
                    ctx.scaleY        = -1
                } );
                //把y轴文案做一次镜像反转
                _.each( this._yAxis.sprite.children , function( ynode ){
                    var text = ynode.children ? ynode.children[0] : ynode;
                    var ctx  = text.context;
                    var rect = text.getRect();
                    ctx.scaleOrigin.x = rect.x + rect.width/2;
                    ctx.scaleOrigin.y = rect.y + rect.height/2;
                    ctx.scaleY        = -1
                } );

            }
        });
    }
);
