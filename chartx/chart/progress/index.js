define(
    "chartx/chart/progress/index",
    [
        "canvax/index",
        "chartx/chart/index",
        "canvax/shape/Sector",
        "canvax/shape/Circle",
        "canvax/animation/Tween",
        "chartx/utils/simple-data-format",
        "chartx/components/legend/index",
        "chartx/components/tips/tip",
        "chartx/chart/theme"
    ],
    function( Canvax , Chart ,Sector , Circle , Tween , DataFormat , Legend , Tip , Theme ){
     
        return Chart.extend({
            init : function( el ,  data , opts ){
                this._opts       = opts;

                var me = this;
                this.barWidth    = 12;
                this.axisWidth   = null;//背景轴的width，默认等于barWidth
                this.normalColor = '#E6E6E6';
                this.progColor   = Theme.colors;//['#58c4bc','#3399d5','#716fb4','#f4c646','#4fd2c4','#999','#7270b1'];
                this.startAngle  = -90;
                this.angleCount  = 360;
                this.currRatio   = 0; //当前比率
                this.barDis      = 4; //如果有多组progress，则代表两bar之间的间距
                this.field       = null;
            
                this.dataType    = "account"; //默认是占比，如果是绝对值"absolute"则需要自己另外计算占比
                this.dataCount   = 100;

                //进度文字
                this.text        = {
                    enabled   : 1,
                    fillStyle : "#666",
                    format    : null,
                    fontSize  : 30
                };

                _.deepExtend( this , opts );

                !this.axisWidth && ( this.axisWidth = this.barWidth )

                !this.r && (this.r = Math.min( this.width , this.height ) / 2);

                this.tweens = [];

                this._initFieldAndData(data);

                //legend;
                var me = this;

                //重新计算dataCount
                if( me.dataType == "absolute" ){
                    this.dataCount = 0;
                    for( var f in me.dataFrame.data ){
                        this.dataCount += me.dataFrame.data[f][0];
                    } 
                }; 

                if(this.field && this.field.length >= 1){
                    //设置legendOpt
                    var legendOpt = _.deepExtend({
                        label  : function( info ){
                            var value = info.value;
                            if( me.dataType == "absolute" ){
                                value = (info.value / me.dataCount * 100).toFixed(2);
                            }
                            return info.field+"："+ value +"%";
                        }
                    } , this._opts.legend);
                    
                    this._legend = new Legend( this._getLegendData() , legendOpt );
                    this.stage.addChild( this._legend.sprite );
                    this._legend.pos( {
                        x : this.width-this._legend.w,
                        y : this.height/2 - this._legend.h/2
                    } );
                    this.width -= this._legend.w;
                    
                };

                this._tip    = new Tip(this.tips, this.canvax.getDomContainer());
                this._tip._getDefaultContent = function(e){
                    return me._getTipsDefaultContent.apply( me , arguments );
                };
                this.stage.addChild( this._tip.sprite );
            },
            _destroy : function(){
                _.each( this.tweens , function( t ){
                    t.stop();
                    Tween.remove(t);
                } );
            },
            _initFieldAndData : function( data ){
                if( this.field ){
                    this.currRatio = {};
                    if(  _.isString( this.field ) ){
                        this.field = [ this.field ]
                    }
                    if(this.field.length > 1){
                        this.text.enabled = 0;
                    };
                    //有field配置才需要处理data
                    this.dataFrame = this._initData(data);
                    
                    var me = this;
                    _.each( this.field , function( field ){
                        me.currRatio[ field ] = 0;//me.dataFrame.data[field][0];
                    } );    
                    
                };
            },
            _initData : DataFormat,
            draw      : function(){
                var me = this;
                if( this.field ){
                    _.each( this.field , function( field , i ){
                        me.drawGroup(i);
                        var s = me.dataFrame.data[field][0];
                        if( me.dataType == "absolute" ){
                            s = (s / me.dataCount * 1000 / 10).toFixed(2);
                        }
                        me.setRatio( s , field , i );
                    } );
                } else {
                    this.drawGroup(0); 
                }
                this.inited = true;
            },
            getColor  : function( colors , i ){
                if(_.isString(colors)){
                    return colors;
                }
                if(_.isArray(colors)){
                    return colors[i]
                }
            },
            drawGroup : function( i ){

                var sprite = new Canvax.Display.Sprite({
                    id     : "group_"+i
                });
                this.stage.addChild( sprite );
                var r   = this.r - (Math.max( this.barWidth , this.axisWidth )+this.barDis)*i;
                var br  = r - ( this.barWidth - this.axisWidth )/2;
                var br0 = r - this.axisWidth - ( this.barWidth - this.axisWidth )/2
                sprite.addChild( this._getCircle( this.startAngle , r - this.barWidth/2 , this.axisWidth/2 , this.normalColor ) );
                sprite.addChild( this._getCircle( this.startAngle + this.angleCount , r - this.barWidth/2 , this.axisWidth/2 , this.normalColor ) );
                
                sprite.addChild( new Sector({
                   context : {
                        x  : this.width / 2,
                        y  : this.height / 2,
     
                        r  : br,
                        r0 : br0,
                        startAngle : this.startAngle ,
                        endAngle   : this.startAngle + this.angleCount,
                        fillStyle  : this.normalColor,
                        lineJoin   : "round"
                      }
                }) );

                var progColor = this.getColor( this.progColor , i );
     
                this._circle = this._getCircle( this.startAngle , r-this.barWidth/2 , this.barWidth/2 , progColor );

                this._circle.id = "circle_"+i;
                sprite.addChild( this._circle );
                sprite.addChild( this._circle.clone() );
                var speedSec = new Sector({
                   id : "speed_"+i,
                   context : {
                        x  : this.width  / 2,
                        y  : this.height / 2,
                        r  : r,
                        r0 : r - this.barWidth,
                        startAngle : this.startAngle ,
                        endAngle   : this.startAngle ,
                        fillStyle  : progColor,
                        lineJoin   : "round",
                        cursor     : "pointer"
                    }
                });
                speedSec.ind = i;
                sprite.addChild( speedSec );

                //bindevent
                var me = this;
                speedSec.on( "panstart mouseover" ,function(e){
                    e.tipsInfo = me._setTipsInfo(this , e);
                    me._tip.show( e );
                });
                speedSec.on( "panstart mousemove" ,function(e){
                    e.tipsInfo = me._setTipsInfo(this , e);
                    me._tip.move( e );
                });
                speedSec.on( "panstart mouseout" ,function(e){
                    me._tip.hide( e );
                });

                if( this.text.enabled ){
                    this.stage.addChild( new Canvax.Display.Text( "0%",
                        {
                            id  : "centerRatioText",
                            context : {
                                x  : this.width  / 2,
                                y  : this.height / 2,
                                fillStyle   : this.text.fillStyle,
                                fontSize    : this.text.fontSize,
                                textAlign   : "center",
                                textBaseline: "middle"
                            }
                  	    }
                    ));
                };
            },
            
            _setTipsInfo : function( el , e ){
                var i = el.ind;
                var info = { dataCount : this.dataCount };
                if( this.field ){
                    info.field = this.field[i];
                    info.value = this.dataFrame.data[ this.field[i] ][0]
                } else {
                    info.value = this.currRatio;
                }
                return info;
            },
            _getTipsDefaultContent : function( info ){
                var value = info.value;
                if( this.dataType == "absolute" ){
                    value = (info.value / this.dataCount * 100).toFixed(2);
                };
                return info.field ? (info.field+"："+ value +"%") : ( value +"%" );
            },
            _getCircle : function( angle , r , cr , fillStyle){
                var radian = Math.PI / 180 * angle;
                var c = new Circle({
                    xyToInt : false,
                    context : {
                        x   : Math.cos( radian ) * r + this.width  / 2,
                        y   : Math.sin( radian ) * r + this.height / 2,
                        r   : cr,
                        fillStyle : fillStyle
                    }
                });
                return c;
            },
            _resetCirclePos : function( angle , i ){
                var radian = Math.PI / 180 * angle;
                //var r      = this.r-this.barWidth/2;
                var r      = this.r - (Math.max( this.barWidth , this.axisWidth )+this.barDis)*i - this.barWidth/2;
                var x      = Math.cos( radian ) * r + this.width  / 2;
                var y      = Math.sin( radian ) * r + this.height / 2;
                var circle = this.stage.getChildById("group_"+i).getChildById("circle_"+i);
                circle.context.x = x;
                circle.context.y = y;
            },
            //设置比例0-100
            _setRatio : function( s , i ){
                var currAngle = s / 100 * this.angleCount + this.startAngle;
                this.stage.getChildById("group_"+i).getChildById("speed_"+i).context.endAngle = currAngle;
                this._resetCirclePos( currAngle , i );
            },
            _animate  : function( s , field , i ){
                var self  = this;
                var timer = null;
                var currRatio = self._getCurrRatio( field );
                var times = 1000 * Math.abs(s - currRatio) / 100;
                times = s / 100 * 1000 ;

                var growAnima = function(){
                   var tween = new Tween.Tween( { r : currRatio } )
                   .to( { r : s } , times )
                   .easing( Tween.Easing.Quadratic.Out )
                   .onUpdate( function (  ) {
                       
                       self._setRatio( this.r , i );
                       self._setCurrRatio( field , this.r );
                       self.fire("ratioChange" , { currRatio : this.r } );

                       var txt = this.r.toFixed(2) + "%";
                       if( _.isFunction( self.text.format ) ){
                           txt = self.text.format( this.r );
                       }
                       if( self.text.enabled ){
                           self.stage.getChildById("centerRatioText").resetText( txt );
                       }

                   } ).onComplete( function(){
                       cancelAnimationFrame( timer );
                   }).start();
                   self.tweens.push( tween );
                   animate();
                };
                function animate(){
                    timer    = requestAnimationFrame( animate ); 
                    Tween.update();
                };
                growAnima();

            },
            _getCurrRatio : function( field ){
                if( this.field ){
                    return this.currRatio[field];
                }
                return this.currRatio;
            },
            _setCurrRatio : function( field , ratio ){
                if( this.field ){
                    this.currRatio[field] = ratio;
                };
                this.currRatio = ratio;
            },
            setRatio  : function( s , field ){
                var self  = this;
                if( !self.field ){
                    self._animate(s , "" , 0);
                } else {
                    _.each( self.field , function( _field , i ){
                        if( field ){
                            if( field == _field ){
                                setTimeout(function(){
                                    self._animate( s , field , i );
                                } , 200*i);    
                            }
                        } else {
                            self._animate( _field , i );
                        }
                    } );
                }
            },
            //只有field为多组数据的时候才需要legend
            _getLegendData : function(){
                var me   = this;
                var data = [];
                _.each(this.field , function( f , i ){
                    data.push({
                        field : f,
                        value : me.dataFrame.data[f][0],
                        fillStyle : me.getColor( me.progColor , i )
                    });
                });
                return data;
            }
        });
     
    }
)
