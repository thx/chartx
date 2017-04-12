define(
    "chartx/chart/scat/graphs",
    [
        "canvax/index",
        "canvax/shape/Circle",
        "canvax/shape/Rect",
        "canvax/animation/Tween",
        "chartx/chart/theme"
    ],
    function( Canvax , Circle , Rect , Tween , Theme ){

        var Graphs = function( opt , dataFrame ){
            this.zAxis = dataFrame.zAxis;
            this.xAxis = dataFrame.xAxis;
            this.yAxis = dataFrame.yAxis;
            this.dataFrame = dataFrame;
            this.label     = {
                field : [],
                enabled : true
            }; //label的字段
            this.w = 0;
            this.h = 0;

            this.pos = {
                x : 0,
                y : 0
            };

            this.circle = {
                maxR    : 20,  //圆圈默认最大半径
                minR    : 3,
                r       : null,
                normalR : 10,
                fillStyle: function(){}
            };

            this._colors  = Theme.colors;

            this.sprite   = null;

            this._circles = [];  //所有圆点的集合

            _.deepExtend( this , opt );

            this.init( );
        };

        Graphs.prototype = {
            init : function(){
                this.sprite = new Canvax.Display.Sprite({ id : "graphsEl" });
            },
            setX:function($n){
                this.sprite.context.x = $n
            },
            setY:function($n){
                this.sprite.context.y = $n
            },
            _getLabel      : function( iGroup , iNode ){
                var labelField = this.label.field[ iGroup ];
                if( labelField ) {
                    var label = null;
                    _.each( this.dataFrame.data , function( d , i ){
                        if( d.field == labelField ){
                            label = d.data[iNode];
                        }
                    } );
                    return label;
                }
            },
            _getCircleNode : function( iGroup , iNode , value ){
                var node = {
                    iGroup : iGroup,
                    iNode  : iNode,
                    xAxis  : {
                        field : this.xAxis.field[iGroup],
                        value : this.xAxis.org[iGroup][iNode]
                    },
                    yAxis  : {
                        field : this.yAxis.field[iGroup],
                        value : value
                    },
                    label  : this._getLabel( iGroup , iNode ),
                    zAxis  : null
                }
                if( this.zAxis.field[iGroup] ){
                    node.zAxis = {
                        field : this.zAxis.field[iGroup],
                        value : this.zAxis.org[iGroup][iNode]
                    }
                }
                return node;
            },
            getCircleFillStyle : function( i , ii , value , circleNode ){
                var fillStyle = this.circle.fillStyle;

                if( _.isArray( fillStyle ) ){
                    fillStyle = fillStyle[ii]
                }
                if( _.isFunction( fillStyle ) ){
                    //fillStyle = fillStyle( i , ii , value );
                    //fillStyle = fillStyle( {
                    //    iGroup : ii,
                    //    iNode  : i,
                    //    value  : value
                    //} );
                    //fillStyle   = fillStyle(this._getCircleNode(ii , i , value));
                    fillStyle   = fillStyle( circleNode );
                }
                if( !fillStyle || fillStyle=="" ){
                    fillStyle = this._colors[ii];
                }
                return fillStyle;
            },
            getR : function(d){
                var r = this.circle.r;
                if( _.isFunction(r) ){
                    return r(d)
                } else {
                    return r;
                };
            },
            draw : function(data , opt){
                
                var self = this;
                _.deepExtend(this , opt);
                if( data.length == 0 ){
                    return;
                };

                self.data = data;

                this.induce = new Rect({
                    id    : "induce",
                    context:{
                        y           : -this.h,
                        width       : this.w,
                        height      : this.h,
                        fillStyle   : '#000000',
                        globalAlpha : 0,
                        cursor      : 'pointer'
                    }
                });

                this.sprite.addChild(this.induce);

                this.induce.on("panstart mouseover", function(e){
                    e.eventInfo = null;
                });
                this.induce.on("panmove mousemove", function(e){
                    e.eventInfo = null;
                });


                //这个分组是只x方向的一维分组
                var barGroupLen = data[0].length;

                var zMax = 1;

                if( this.zAxis.field && this.zAxis.field.length > 0 ){
                    zMax = _.max( _.flatten(this.zAxis.org) );
                }

                for( var i = 0 ; i < barGroupLen ; i++ ){
                    var sprite = new Canvax.Display.Sprite();
                    for( var ii = 0 , iil = data.length ; ii < iil ; ii++ ){
                        var d = data[ii][i];

                        var zAxisV  = this.zAxis.org[ii] && this.zAxis.org[ii][i];

                        if (zAxisV == 0 ) {
                            continue
                        };

                        var r = this.getR(d) || (zAxisV ? Math.max(this.circle.maxR*(zAxisV/zMax) , this.circle.minR) : this.circle.normalR );
                        var circleNode = this._getCircleNode(ii , i , d.value);

                        var fillStyle  = this.getCircleFillStyle( i , ii , d.value , circleNode );
                        if( d.value == null || d.value == undefined || d.value === "" ){
                            continue;
                        }

                        var circle = new Circle({
                            hoverClone : false,
                            context : {
                                x           : d.x,
                                y           : d.y,
                                fillStyle   : fillStyle,
                                r           : r,
                                globalAlpha : 0,
                                cursor      : "pointer"
                            }
                        });
                        sprite.addChild( circle );

                        circle.iGroup = ii;
                        circle.iNode  = i;
                        circle.r      = r;
                        circle.label  = circleNode.label;
                        if( zAxisV != undefined || zAxisV != null ){
                            circle.zAxis  = {
                                field : this.zAxis.field,
                                value : zAxisV,
                                org   : this.zAxis.org
                            }
                        }

                        circle.on("panstart mouseover", function(e){
                            e.eventInfo = self._getInfoHandler(e);
                            this.context.globalAlpha = 0.9;
                            this.context.r ++;
                        });
                        circle.on("panmove mousemove", function(e){
                            e.eventInfo = self._getInfoHandler(e);

                        });
                        circle.on("panend mouseout", function(e){
                            e.eventInfo = {};
                            this.context.globalAlpha = 0.7;
                            this.context.r --;
                        });
                        circle.on("tap click", function(e){
                            e.eventInfo = self._getInfoHandler(e);
                        });

                        this._circles.push( circle );

                        if( circleNode.label && circleNode.label != "" && this.label.enabled ){
                            var y = d.y-r;
                            if( y + this.h <= 20 ){
                                y = -(this.h - 20);
                            }
                            var label = new Canvax.Display.Text( circleNode.label , {
                                context: {
                                    x            : d.x,
                                    y            : y,
                                    fillStyle    : fillStyle,
                                    textAlign    : "center",
                                    textBaseline : "bottom"
                                }
                            });
                            if( circle.context.r * 2 > label.getTextWidth() ){
                                label.context.y = d.y;
                                label.context.textBaseline = "middle";
                                label.context.fillStyle = "black"
                            }
                            sprite.addChild( label );
                        }
                    }
                    this.sprite.addChild( sprite );
                };

                this.setX( this.pos.x );
                this.setY( this.pos.y );
            },
            _getInfoHandler : function(e){
                var target = e.target;
                var node = {
                    iGroup        : target.iGroup,
                    iNode         : target.iNode,
                    label         : target.label,
                    nodesInfoList : this._getNodeInfo(target.iGroup, target.iNode)
                };
                return node
            },
            _getNodeInfo : function( iGroup , iNode ){
                var arr  = [];
                arr.push( this.data[iGroup][iNode] );
                return arr;
            },
            /**
             * 生长动画
             */
            grow : function(){
                var self  = this;
                var timer = null;

                var growAnima = function(){
                   var bezierT = new Tween.Tween( { h : 0 } )
                   .to( { h : 100 }, 500 )
                   .onUpdate( function () {
                       for( var i=0 , l=self._circles.length ; i<l ; i++ ){
                           var _circle = self._circles[i];
                           _circle.context.globalAlpha = this.h / 100 * 0.7;
                           _circle.context.r = this.h / 100 * _circle.r;
                       }
                   } ).onComplete( function(){
                       cancelAnimationFrame( timer );
                   }).start();
                   animate();
                };
                function animate(){
                    timer    = requestAnimationFrame( animate );
                    Tween.update();
                };
                growAnima();
            }
        };
        return Graphs;
    }
);
