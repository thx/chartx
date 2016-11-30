define(
    "chartx/chart/original/demand/group", [
        "canvax/index",
        "canvax/shape/Circle",
        "canvax/shape/Sector"
    ],
    function(Canvax , Circle , Sector) {
        var Graphs = function(opt) {
            this.sprite = null;

            this.data = opt.data;
            this.ind = opt.ind;
            this.coordinate = opt.coordinate;

            this.rRange = {
                start : 0, to : 0
            };

            //星球
            this.circle = {
                maxR : 15,
                minR : 5,
                fillStyle : '#f2fbfb',
                name : 'circle',
                r : 15
            };

            this.layout = {
                type : "radian"
            };

            this.pit = {
                r : 30
            };


            this.maxRingNum = 0;
            this.ringNum = 0;

            _.deepExtend( this, opt.options );

            //circle.maxR 绝对不能大于最大 占位pit.r
            if( this.circle.maxR > this.pit.r ){
                this.pit.r = this.circle.maxR * 1.3
            };

            this.init();
        };

        Graphs.prototype = {
            init: function() {
                var me = this;
                this.sprite = new Canvax.Display.Sprite({
                    id : "group_"+this.ind,
                    context : {
                        x : this.coordinate.center.x,
                        y : this.coordinate.center.y
                    }
                });


                //计算该group中可以最多分布多少ring
                if( !this.maxRingNum ){
                    this.maxRingNum = parseInt((this.rRange.to - this.rRange.start) / (this.pit.r*2) , 10 );

                    //如果可以划10个环，但是其实数据只有8条， 那么就 当然是只需要划分8ring
                    this.ringNum = Math.min( this.maxRingNum , this.data.org.length-1 );
                };

                this._resetrRangeTo();

                //根据数据创建n个星球
                var plants = [];
                var titles = this.data.org[0];
                _.each( this.data.org , function( row , i ){
                    if( i>0 ){
                        //构建一个星球
                        var plant = {
                            data : {},
                            fillStyle : null,
                            pit: null //假设这个plant是个萝卜，那么pit就是这个萝卜的坑
                        };
                        _.each( titles, function( field , fi ){
                            plant.data[ field ] = row[fi];
                        } );
                        plants.push( plant );

                        plant.fillStyle = me._getProp( me.circle.fillStyle , i , plants.data);
                    }
                } );
                
                this._rings = this["_setRings_"+ this.layout.type +"Range"]( plants );

                this.draw();
            },
            draw: function(){
                var me = this;
                _.each( this._rings , function( ring , i ){
                    var _ringCtx = {
                        rotation : 0
                    };
                    if( ring.arcs.length == 1 && ring.arcs[0][0].radian == 0 && ring.arcs[0][1].radian == Math.PI*2 ){
                        //如果这个是一个整个的内圆，那么就做个随机的旋转
                        _ringCtx.rotation = parseInt( Math.random()*360 );
                    };
                    var _ringSp = new Canvax.Display.Sprite({
                        context : _ringCtx
                    });

                    _.each( ring.plants, function( p , ii){
                        if( !p.pit ){
                            //如果这个萝卜没有足够的坑位可以放，很遗憾，只能扔掉了
                            return;
                        };
                        var point = me.coordinate.getPointInRadian( p.pit.middle , ring.r );
                        var r = me._getProp( me.circle.r );
                        var circleCtx = {
                            x : point.x,
                            y : point.y,
                            r : r,
                            fillStyle: me._getProp( me.circle.fillStyle ),
                            lineWidth : 2,
                            strokeStyle : "#fff"
                        };

                        var circle = new Circle({
                            context : circleCtx
                        });

                        circle.plant = p;
                        circle.ringInd = i;
                        circle.plantInd = ii;

                        _ringSp.addChild( circle );

                        circle.on("panstart mouseover", function(e){
                            e.eventInfo = me._getInfoHandler(e);
                            this.context.r ++;
                        });
                        circle.on("panmove mousemove", function(e){
                            e.eventInfo = me._getInfoHandler(e);
                        });
                        circle.on("panend mouseout", function(e){
                            e.eventInfo = {};
                            this.context.r --;
                        });
                        circle.on("tap click", function(e){
                            e.eventInfo = me._getInfoHandler(e);
                        });
                        circle.on("doubletap dblclick", function(e){
                            e.eventInfo = me._getInfoHandler(e);
                        });


                        //然后添加label
                        //绘制实心圆上面的文案
                        var _label = new Canvax.Display.Text( p.data.name , {
                            context: {
                                x: point.x,
                                y: point.y + r +3,
                                fontSize: 15,
                                textAlign: "center",
                                textBaseline: "top",
                                fillStyle: "#666",
                                rotation : -_ringCtx.rotation,
                                rotateOrigin : {
                                    x : 0,
                                    y : -(r + 3)
                                }
                            }
                        });

                        _ringSp.addChild( _label );
                    } );

                    me.sprite.addChild( _ringSp );
                } );
            },
            _getInfoHandler: function( e ){
                var target = e.target;
                var node = {
                    iGroup : this.ind,
                    iNode  : target.plantInd,
                    node   : target.plant
                };
                return node
            },
            _resetrRangeTo: function(){
                //重新计算修改rRange.to的值
                this.rRange.to = this.rRange.start + this.ringNum * this.pit.r * 2;
            },
            _getDiffRadian: function( start , to ){
                var _adiff = to - start;
                if( to < start ){
                    _adiff = ((to + Math.PI*2) - start) % (Math.PI*2);
                }
                return _adiff;
            },
            //根据弧度对应可以排列多少个星球的占比来分段
            _setRings_radianRange: function( plants ){
                var me = this;
                var _rings = [];
                for( var i=0,l=this.ringNum ; i<l ; i++ ){
                    var _r = i*this.pit.r*2 + this.pit.r + this.rRange.start;
                    //该半径上面的弧度集合
                    var arcs = this.coordinate.getRadiansAtR( _r );

                    //测试代码begin---------------------------------------------------
                    //用来绘制弧度的辅助线
                    /*
                    _.each( arcs, function( arc ){
                        var sector = new Sector({
                            context: {
                                //x: me.coordinate.center.x,
                                //y: me.coordinate.center.y,
                                r: _r,
                                startAngle: arc[0].radian*180/Math.PI,
                                endAngle: arc[1].radian*180/Math.PI, //secc.endAngle,
                                strokeStyle: "#ccc",
                                lineWidth:1
                            },
                        });
                        me.sprite.addChild( sector );
                    } );
                    */

                    //测试代码end------------------------------------------------------

                    //该半径圆弧上，可以绘制一个星球的最小弧度值
                    var minRadianItem = Math.atan( this.pit.r / _r );

                    _rings.push( {
                        arcs : arcs,
                        pits : [], //萝卜坑
                        plants : [], //将要入坑的萝卜
                        r: _r, //这个ring所在的半径轨道
                        max: 0 //这个环上面最多能布局下的plant数量
                    } );

                };

                var allPlantsMax = 0; //所有ring里面

                //计算每个环的最大可以创建星球数量,然后把所有的数量相加做分母。
                //然后计算自己的比例去plants里面拿对应比例的数据
                _.each( _rings , function( ring , i ){
                    //先计算上这个轨道上排排站一共可以放的下多少个星球
                    //一个星球需要多少弧度
                    var minRadian = Math.asin( me.pit.r / ring.r ) * 2;
                    var _count = 0;
                    _.each( ring.arcs , function( arc ){
                        var _adiff = me._getDiffRadian( arc[0].radian , arc[1].radian );
                        if( _adiff >= minRadian ){
                            var _arc_count = parseInt( _adiff/minRadian , 10 );
                            _count += _arc_count;
                            //这个弧段里可以放_count个坑位
                            for(var p=0 ; p<_arc_count ; p++){
                                var pit = {
                                    hasRadish: false, //是否已经有萝卜(一个萝卜一个坑)
                                    start : (arc[0].radian + minRadian*p + Math.PI*2)%(Math.PI*2)
                                }
                                pit.middle = (pit.start+minRadian/2+Math.PI*2)%(Math.PI*2);
                                pit.to = (pit.start+minRadian+Math.PI*2)%(Math.PI*2);

                                ring.pits.push( pit );

                                //测试占位情况代码begin---------------------------------------------
                                /*
                                var point = me.coordinate.getPointInRadian( pit.middle , ring.r )
                                me.sprite.addChild(new Circle({
                                    context:{
                                        x : point.x,
                                        y : point.y,
                                        r : me.pit.r,
                                        fillStyle: "#ccc",
                                        strokeStyle: "red",
                                        lineWidth: 1,
                                        globalAlpha:0.3
                                    }
                                }));
                                */
                                //测试占位情况代码end-----------------------------------------------
                                
                            };

                        } else {
                            //这个arc圆弧上面放不下一个坑位

                        }
                    } );
                    ring.max = _count;
                    allPlantsMax += _count;

                    //坑位做次随机乱序
                    ring.pits = _.shuffle( ring.pits );

                });

                //allPlantsMax有了后作为分明， 可以给每个ring去分摊plant了
                var preAllCount = 0;
                _.each( _rings , function( ring , i ){
                    var num = parseInt( ring.max/allPlantsMax * plants.length );
                    var endNum = preAllCount+num;
                    ring.plants = plants.slice( preAllCount , (i==_rings.length-1 ? plants.length-1 : endNum) ) ;
                    preAllCount += num;

                    //给每个萝卜分配一个坑位
                    _.each( ring.plants , function( plant , ii ){
                        if( ii >= ring.pits.length ){
                            //如果萝卜已经比这个ring上面的坑要多，就要扔掉， 没办法的
                            return;
                        }
                        var pits = _.filter( ring.pits , function( pit ){
                            return !pit.hasRadish ;
                        } );

                        var targetPit = pits[ parseInt(Math.random()*pits.length) ];
                        targetPit.hasRadish = true;
                        plant.pit = targetPit;
                    } );
                } );

                return _rings;
            },
            //索引区间分段法
            _setRings_indexRange: function( plants ){
                var me = this;
                //每一ring上面有多少个星球
                var ringPlantsNum = Math.ceil( plants.length / this.ringNum );
            },
            //值区间分段法
            //todo:这样确实就很可能数据集中在两段中间没有
            _setRings_valRange: function( plants ){
                var me = this;
                //先对数据更具坐标系统的xAxis做一次排序，越大的越靠近太阳
                var cxf = me.coordinate.xAxis.field;
                plants.sort( function(a , b){
                    return b.data[ cxf ] - b.data[ cxf ];
                } );

                var xAxisMax = _.max( this.data.data[ cxf ] );
                var xAxisMin = _.min( this.data.data[ cxf ] );

                //所在同一ring上的对应val区间
                var ringVal = ( xAxisMax - xAxisMin ) / this.ringNum; 

                var _rings = [];
                _.each( plants , function( plant , i ){
                    var ind = parseInt((plant.data[cxf] - xAxisMin) / ringVal , 10);
                    if( !_rings[ind] ){
                        _rings[ind] = {
                            plants : []
                        };
                    };
                    _rings[ind].plants.push( plant );
                } );
                return _rings
            },
            _getProp: function( p , i , nodeData ){
                var groupInd = this.ind;
                var nodeInd = i;
                if( _.isFunction( p ) ){
                    return p.apply( this , [ {
                        groupInd : groupInd,
                        nodeInd: nodeInd,
                        nodeData: nodeData
                    } ] );
                };
                if( _.isString( p ) ){
                    return p;
                };
            }
        };
        return Graphs;
    }
);