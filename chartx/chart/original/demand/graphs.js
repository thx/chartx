define(
    "chartx/chart/original/demand/graphs", [
        "canvax/index",
        'chartx/utils/simple-data-format',
        "canvax/shape/Circle",
        "chartx/chart/original/demand/group",
        "canvax/shape/Sector"
    ],
    function(Canvax , dataFormat , Circle , Group , Sector) {
        var Graphs = function(opt) {
            this.sprite = null;

            this.w = 0;
            this.h = 0;
            //圆心原点坐标
            this.center ={
                name : "center",
                r : 30,
                fillStyle : "#70629e",
                fontSize : 15,
                fontColor: "#ffffff",
                margin : 20 //最近ring到太阳的距离
            };

            this.back = {
                fillStyle : null,
                strokeStyle: null,
                lineWidth : 1
            }

            this.groups = {
                field : "group",
                data : []
            };
            this._groups = [];
            this.group = {}; //透传给 group 的参数


            this.coordinate = opt.coordinate; //坐标系，这里会引入极坐标系
            this.dataFrame = opt.dataFrame;

            _.deepExtend(this, opt.options);

            this.init();
        };

        Graphs.prototype = {
            init: function() {
                this.sprite = new Canvax.Display.Sprite({
                    id: "graphsEl"
                });
                this.dataHandle();
                window.chart = this;
                //this._coordinateTest();
            },
            draw: function(){
                var me = this;
                var cx = this.coordinate.center.x;
                var cy = this.coordinate.center.y;

                

                var nextGroupRStart = this.center.r + this.center.margin;
                
                _.each( this.groups.data , function( d , i ){
                    var maxR = me.coordinate.maxR - me.center.margin;
                    var toR = parseInt( nextGroupRStart + maxR*( (d.org.length-1) / (me.dataFrame.org.length - 1) ) , 10 );
                    var _g = new Group({
                        data : d,
                        ind : i,
                        coordinate: me.coordinate,
                        options: _.extend({
                            rRange : {
                                start : nextGroupRStart,
                                to : toR
                            }
                        } , me.group)
                    });

                    nextGroupRStart = _g.rRange.to;
                    me._groups.push( _g );
                    //me.sprite.addChild( _g.sprite );
                } );

                for( var i=me._groups.length-1 ; i>=0 ; i-- ){
                    me.sprite.addChild( new Circle({
                        context : {
                            x : me.coordinate.center.x,
                            y : me.coordinate.center.y,
                            r : me._groups[i].rRange.to,
                            lineWidth : me._getBackProp( me.back.lineWidth , i),
                            strokeStyle : me._getBackProp( me.back.strokeStyle , i),
                            fillStyle: me._getBackProp( me.back.fillStyle , i),
                            globalAlpha:1
                        }
                    }) );
                    
                    
                };

                _.each( me._groups , function(g){
                    me.sprite.addChild( g.sprite );
                } );


                //绘制中心实心圆
                this._center = new Circle({
                    context : {
                        x : cx,
                        y : cy,
                        fillStyle : this.center.fillStyle,
                        r : this.center.r
                    }
                });
                //绘制实心圆上面的文案
                this._label = new Canvax.Display.Text(this.center.name, {
                    context: {
                        x: cx,
                        y: cy,
                        fontSize: this.center.fontSize,
                        textAlign: "center",
                        textBaseline: "middle",
                        fillStyle: this.center.fontColor
                    }
                });

                this.sprite.addChild( this._center );
                this.sprite.addChild( this._label );


            },
            dataHandle: function(){
                var groupFieldInd = _.indexOf(this.dataFrame.fields , this.groups.field);
                if( groupFieldInd >= 0 ){
                    //有分组字段，就还要对dataFrame中的数据分下组，然后给到 groups 的data
                    var titles = this.dataFrame.org[0];
                    var _dmap = {}; //以分组的字段值做为key

                    _.each( this.dataFrame.org , function( row , i ){
                        if( i ){
                            //从i==1 行开始，因为第一行是titles
                            if( !_dmap[ row[groupFieldInd] ] ){
                                //如果没有记录，先创建
                                _dmap[ row[groupFieldInd] ] = [
                                    _.clone( titles )
                                ]
                            };
                            _dmap[ row[groupFieldInd] ].push( row );
                        }
                    } );

                    for( var r in _dmap ){
                        this.groups.data.push( dataFormat( _dmap[r] ) );
                    };
                } else {
                    //如果分组字段不存在，则认为数据不需要分组，直接全部作为 group 的一个子集合
                    this.groups.data.push( this.dataFrame );
                };
            },
            _getBackProp: function( p , i ){
                
                var groupInd = i;
                var res = null;
                if( _.isFunction( p ) ){
                    res = p.apply( this , [ {
                        groupInd : groupInd,
                        groups : this._groups
                    } ] );
                };
                if( _.isString( p ) || _.isNumber( p ) ){
                    res = p;
                };
                if( _.isArray( p ) ){
                    res = p[i]
                };
                return res
            },
            _coordinateTest: function(){
                var r = 230;
                var arcs = this.coordinate.getRadiansAtR( r );
                var me = this;
                _.each( arcs, function( arc ){
                    var sector = new Sector({
                        context: {
                            x: me.coordinate.center.x,
                            y: me.coordinate.center.y,
                            r: r,
                            startAngle: arc[0].radian*180/Math.PI,
                            endAngle: arc[1].radian*180/Math.PI, //secc.endAngle,
                            strokeStyle: "#ccc",
                            lineWidth:1
                        },
                    });
                    me.sprite.addChild( sector );
                } );
            }
        };
        return Graphs;
    }
);