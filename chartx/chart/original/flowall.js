define(
    'chartx/chart/original/flowall',
    [
        'chartx/chart/index',
        'chartx/chart/original/flowall/dataformat',
        'chartx/chart/original/flowall/layout',
        'canvax/shape/Rect',
        'canvax/shape/Path',
        'chartx/components/tips/tip'
    ],
    function( Chart , DataFormat , Layout , Rect , Path , Tip ){
        var Canvax = Chart.Canvax;
        return Chart.extend({
            init : function( el , data , opts){
                this.padding = {
                    top:10,right:10,bottom:10,left:10
                };
                this.graphs  = {
                    w : this.width  - this.padding.left - this.padding.right,
                    h : this.height - this.padding.top  - this.padding.bottom,
                    node  : {
                        text : {
                            format : function( v ){ },
                            formatVal : function(v){return v},
                            fillStyle : "white",
                            fontSize  : 12,
                            valFontSize : 18
                        }
                    },
                    edge : {
                        
                    }
                };

                _.deepExtend( this , opts );
                this.layout = Layout( this._initData( data, opts ) , this.graphs );    
            },
            draw : function(){
                this._initModule();
                this._widget();
                this.inited = true;
            },
            _initModule : function(){
                this.edgeSprite = new Canvax.Display.Sprite({
                    id  : "edgeSprite",
                    context : {
                        x : this.padding.left,
                        y : this.padding.top
                    }
                });
                this.stage.addChild( this.edgeSprite );

                this.nodeSprite = new Canvax.Display.Sprite({
                    id : "nodeSprite",
                    context : {
                        x : this.padding.left,
                        y : this.padding.top
                    }
                });
                this.stage.addChild( this.nodeSprite );

                this.txtSprite = new Canvax.Display.Sprite({
                    id : "txtSprite",
                    context : {
                        x : this.padding.left,
                        y : this.padding.top
                    }
                });
                this.stage.addChild( this.txtSprite );
                this.stageTip = new Canvax.Display.Sprite({
                    id      : 'tip'
                });
                this.stage.addChild( this.stageTip );
                this._tip    = new Tip(this.tips, this.canvax.getDomContainer());
                this._tip._getDefaultContent = this._getTipDefaultContent;
                this.stageTip.addChild( this._tip.sprite );
            },
            _getTipDefaultContent : function( info ){
                var node    = info.node;
                if( node ){
                    var label   = node.label || node.node;
                    return label+"总人数</br><span style='color:"+node.fillStyle+"'>"+node.value+"</span>";
                }
                var edge    = info.edge
                if( edge ){
                    var label   = edge.to.label || edge.to.node;
                    return label+"转化人数</br><span style='color:"+edge.to.fillStyle+"'>"+edge.to.flowin+"</span>("+ parseInt(edge.to.flowin/edge.to.value*100) +"%)";
                }
            },
            _initData : DataFormat,
            _widget   : function(){
                var me = this;
                _.each(me.layout.nodes , function( node ){
                    var rect = new Rect({
                        id     : node.node,
                        hoverClone : false,
                        context : {
                            x : node.pos.x,
                            y : node.pos.y,
                            width : node.w,
                            height: node.h,
                            fillStyle : node.fillStyle,
                            cursor : "pointer",
                            radius : [2]
                        }
                    });

                    rect.node = node;
                    rect.hover(function(e){
                        this.context.r ++;
                        me._setEventInfo(e , this);
                        me._tip.show( e );
                    } , function(){
                        this.context.r --;
                        me._tip.hide();
                    });
                    rect.on("mousemove" , function(e){
                        me._setEventInfo(e , this);
                        me._tip.move(e)
                    });
                    rect.on("click" , function(e){
                        e.node = this.node;
                        me.fire( "click" , e );
                    });
                    me.nodeSprite.addChild( rect );

                
                    var textOpt = me.graphs.node.text;
                    var label = textOpt.format( node.node ) || node.label || node.node;

                    var txt = new Canvax.Display.Text( label ,
                       {
                        context : {
                            x  : node.pos.x+10,
                            y  : node.pos.y+node.h/2,
                            fillStyle   : textOpt.fillStyle,
                            fontSize    : textOpt.fontSize,
                            textAlign   : "left",
                            textBaseline: "middle"
                       }
                  	});

                    var vtxt = new Canvax.Display.Text( textOpt.formatVal(node.value) ,
                       {
                        context : {
                            x  : node.pos.x+10,
                            y  : node.pos.y+Math.max(node.h*2/3 , 28),
                            fillStyle   : textOpt.fillStyle,
                            fontSize    : textOpt.valFontSize,
                            textAlign   : "left",
                            textBaseline: "middle"
                       }
                  	});
                    me.txtSprite.addChild( vtxt );

                    if( node.h < txt.getTextHeight() ){
                        txt.context.y = node.pos.y+node.h;
                        txt.context.textBaseline = "top";
                        txt.context.fillStyle = "#999";
                        
                        vtxt.context.y = node.pos.y+node.h+1;
                        vtxt.context.textBaseline = "top";
                        vtxt.context.x = node.pos.x+txt.getTextWidth()+12;
                        vtxt.context.fillStyle = node.fillStyle;
                        vtxt.context.fontSize = 12
                    } else {
                        if( node.h>30 ){
                            txt.context.textBaseline = "top";
                            txt.context.y            = node.pos.y+3;
                            txt.context.fontSize     = 12; 
                        } else {
                            vtxt.context.y = node.pos.y+node.h/2;
                            vtxt.context.x = node.pos.x+txt.getTextWidth()+12;
                            vtxt.context.textBaseline = "middle";
                            vtxt.context.fillStyle = textOpt.fillStyle;
                            vtxt.context.fontSize = 12
                        }
                    }

                    me.txtSprite.addChild( txt );
                });
                
                _.each( me.layout.edges , function( edge , key ){
                    //线条
                    var path = new Path({
                        id   : key,
                        context : {
                            path        : edge.path,
                            fillStyle   : edge.to.fillStyle,
                            globalAlpha : 0.3
                        }
                    });
                    path.edge = edge;
                    path.on("mouseover" , function(e){
                        me._setEventInfo(e , this);
                        me._tip.show( e );
                    });

                    path.on("mousemove" , function(e){
                        me._setEventInfo(e , this);
                        me._tip.move( e );
                    });

                    path.on("mouseout" , function(e){
                        me._tip.hide( e );
                    });

                    me.edgeSprite.addChild( path );

                } );
                
            },
            _setEventInfo : function( e , el ){
                e.eventInfo = {
                    el : el,
                    node   : el.node,
                    edge : el.edge
                }
            }
        })
    }
);
