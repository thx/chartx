import Canvax from "canvax"

const _ = Canvax._;
const Text = Canvax.Display.Text;
const Circle = Canvax.Shapes.Circle;


export default class PlanetGroup
{
    constructor(opt, dataFrame , _graphs)
    {
    
        this._opt = opt;
        this.dataFrame = dataFrame;
        this._graphs = _graphs;
        this.root = _graphs.root;
        this._coord = this.root._coord;

        this.field = null;

        this.iGroup = 0;
        this.groupLen = 1;

        //分组可以绘制的半径范围
        this.rRange = {
            start : 0, 
            to : 0
        };

        this.width  = 0;
        this.height = 0;

        this.node = {
            shapeType : "circle",
            maxR : 30,//15
            minR : 5,
            lineWidth : 1,
            strokeStyle : "#fff",
            fillStyle : '#f2fbfb',
            lineAlpha : 0.6,
            radius : 15, //也可以是个function,也可以配置{field:'pv'}来设置字段， 自动计算r

            focus : {
                enabled : true,
                lineAlpha : 0.7,
                lineWidth : 2,
                strokeStyle : "#fff", //和bar.fillStyle一样可以支持array function
            },

            select : {
                enabled : false,
                lineAlpha : 1,
                lineWidth : 2,
                strokeStyle : "#fff", //和bar.fillStyle一样可以支持array function
                triggerEventType : "click"
            }
        };
        selectInds: [], //会从外面的index中传入一个统一的selectInds 引用

        this.label = {
            enabled   : true,
            fontColor : "#666",
            fontSize  : 13,
            align : "center",  //left center right
            verticalAlign : "middle", //top middle bottom
            position  : "center" //center,bottom,auto,function
        };

        this.sort = "desc";
        this.sortField = null;

        this.layoutType = "radian";
        
        //坑位，用来做占位
        this.pit = {
            radius : 30
        };

        this.planets = [];
        
        this.maxRingNum = 0;
        this.ringNum = 0;

        _.extend( true, this, opt );

        //circle.maxR 绝对不能大于最大 占位 pit.radius
        if( this.node.maxR > this.pit.radius ){
            this.pit.radius = this.node.maxR
        };
        
        this.init();
    }

    init()
    {
        var me = this;
        this.sprite = new Canvax.Display.Sprite({
            id : "group_"+this.iGroup,
            context : {
                x : this._coord.origin.x,
                y : this._coord.origin.y
            }
        });

        this._trimGraphs();

        this.draw();
    }

    _trimGraphs()
    {
        var me = this;


        if( (this._coord.maxR - this.rRange.to)/(this.pit.radius*2) < this.groupLen-1-this.iGroup ){
            //要保证后面的group至少能有意个ringNum
            this.rRange.to = this._coord.maxR - (this.groupLen-1-this.iGroup)*this.pit.radius*2;
        };
        if( this.rRange.to - this.rRange.start < this.pit.radius*2 ){
            this.rRange.to = this.rRange.start + this.pit.radius*2;
        };

        //计算该group中可以最多分布多少ring
        if( !this.maxRingNum ){
            this.maxRingNum = parseInt((this.rRange.to - this.rRange.start) / (this.pit.radius*2) , 10 );
            
            /* TODO: 这个目前有问题
            //如果可以划10个环，但是其实数据只有8条， 那么就 当然是只需要划分8ring
            //this.ringNum = Math.min( this.maxRingNum , this.dataFrame.length );
            */
            this.ringNum = this.maxRingNum
        };

        //重新计算修改 rRange.to的值
        this.rRange.to = this.rRange.start + this.ringNum * this.pit.radius * 2;

        //根据数据创建n个星球
        var planets = [];

        var dataLen  = this.dataFrame.length;
        for( var i=0; i<dataLen; i++ ){  
            
            var rowData = this.dataFrame.getRowData(i);
            var planetLayoutData = {
                groupLen    : this.groupLen,
                iGroup      : me.iGroup,
                iNode       : i,
                node        : null, //canvax元素
                rowData     : rowData,

                //下面这些都只能在绘制的时候确定然后赋值
                iRing       : null,
                iPlanet     : null,
                fillStyle   : null,
                color       : null, //给tips用
                strokeStyle : null,
                
                pit         : null, //假设这个planet是个萝卜，那么 pit 就是这个萝卜的坑

                ringInd     : -1,

                field       : me.field,
                label       : rowData[me.field],

                focused     : false,
                selected    : !!~_.indexOf( this.selectInds, rowData.__index__ )
            };

            planets.push( planetLayoutData );
        };

        if( me.sortField ){
            planets = planets.sort( function(a , b){
                var field = me.sortField;
                if( me.sort == "desc" ){
                    return b.rowData[ field ] - a.rowData[ field ];
                } else {
                    return a.rowData[ field ] - b.rowData[ field ];
                }
            } );
            //修正下 排序过后的 iNode
            _.each( planets, function( planet , i ){
                planet.iNode = i;
            } );
        };

        this._rings = this["_setRings_"+ this.layoutType +"Range"]( planets );

        this.planets = planets;
    }

    //根据弧度对应可以排列多少个星球的占比来分段
    _setRings_radianRange( planets )
    {
        var me = this;
        var _rings = [];

        for( var i=0,l=this.ringNum ; i<l ; i++ ){
            var _r = i*this.pit.radius*2 + this.pit.radius + this.rRange.start;

            if( !me._graphs.center.enabled ){
                _r = i*this.pit.radius*2 + this.rRange.start;
            };

            //该半径上面的弧度集合
            var arcs = this._coord.getRadiansAtR( _r , me.width, me.height );

            //测试代码begin---------------------------------------------------
            //用来绘制弧度的辅助线
            /*
            _.each( arcs, function( arc ){
                var sector = new Canvax.Shapes.Sector({
                    context: {
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
            var minRadianItem = Math.atan( this.pit.radius / _r );

            _rings.push( {
                arcs    : arcs,
                pits    : [], //萝卜坑
                planets : [], //将要入坑的萝卜
                radius  : _r, //这个ring所在的半径轨道
                max     : 0 //这个环上面最多能布局下的 planet 数量
            } );

        };

        var allplanetsMax = 0; //所有ring里面

        //计算每个环的最大可以创建星球数量,然后把所有的数量相加做分母。
        //然后计算自己的比例去 planets 里面拿对应比例的数据
        _.each( _rings , function( ring , i ){
            //先计算上这个轨道上排排站一共可以放的下多少个星球
            //一个星球需要多少弧度
            var minRadian = Math.asin( me.pit.radius / ring.radius ) * 2;
            if( ring.radius == 0 ){
                //说明就在圆心
                minRadian = Math.PI*2;
            };

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
                        };
                        pit.middle = (pit.start+minRadian/2+Math.PI*2) % (Math.PI*2);
                        pit.to     = (pit.start+minRadian+Math.PI*2) % (Math.PI*2);

                        ring.pits.push( pit );

                        //测试占位情况代码begin---------------------------------------------
                        /*
                        var point = me._coord.getPointInRadianOfR( pit.middle , ring.radius )
                        me.sprite.addChild(new Circle({
                            context:{
                                x : point.x,
                                y : point.y,
                                r : me.pit.radius,
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
            allplanetsMax += _count;

            //坑位做次随机乱序
            ring.pits = _.shuffle( ring.pits );
        });

        //allplanetsMax有了后作为分明， 可以给每个ring去分摊 planet 了
        var preAllCount = 0;
        _.each( _rings , function( ring , i ){

            if( preAllCount >= planets.length ){
                return false;
            };
            
            var num = Math.ceil( ring.max/allplanetsMax * planets.length );
            num = Math.min( ring.max , num );

            ring.planets = planets.slice( preAllCount , preAllCount + num );
            if( i == _rings.length - 1 ){
                ring.planets = planets.slice( preAllCount );
            };
            preAllCount += num;

            //给每个萝卜分配一个坑位
            _.each( ring.planets , function( planet , ii ){
                
                if( ii >= ring.pits.length ){
                    //如果萝卜已经比这个ring上面的坑要多，就要扔掉， 没办法的
                    return;
                };

                var pits = _.filter( ring.pits , function( pit ){
                    return !pit.hasRadish ;
                } );

                var targetPit = pits[ parseInt(Math.random()*pits.length) ];
                targetPit.hasRadish = true;
                planet.pit = targetPit;
            } );
        } );

        return _rings;
    }

    _getDiffRadian( _start , _to )
    {
        var _adiff = _to - _start;
        if( _to < _start ){
            _adiff = ((_to + Math.PI*2) - _start) % (Math.PI*2);
        }
        return _adiff;
    }

    //索引区间分段法 待实现
    _setRings_indexRange( planets )
    {
    }

    //值区间分段法
    //todo:这样确实就很可能数据集中在两段中间没有 待实现
    _setRings_valRange( planets )
    {
    }

    draw()
    {
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

            _.each( ring.planets, function( p , ii){
                if( !p.pit ){
                    //如果这个萝卜没有足够的坑位可以放，很遗憾，只能扔掉了
                    return;
                };

                var point = me._coord.getPointInRadianOfR( p.pit.middle , ring.radius );

                var r = me._getRProp( me.node.radius , i, ii , p);

                //计算该萝卜在坑位（pit）中围绕pit的圆心可以随机移动的范围（r）
                var _transR = me.node.maxR - r;
                //然后围绕pit的圆心随机找一个点位，重新设置Point
                var _randomTransR = parseInt(Math.random()*_transR);
                var _randomAngle = parseInt(Math.random()*360);
                var _randomRadian= _randomAngle*Math.PI / 180;
                if( _randomTransR != 0 ){
                    //说明还是在圆心， 就没必要重新计算point
                    point.x += Math.sin(_randomRadian) * _randomTransR;
                    point.y += Math.cos(_randomRadian) * _randomTransR;
                };

                var node = me.node;
                if( p.selected ){
                    node = me.node.select;
                };

                var _fillStyle = me._getProp( me.node.fillStyle , p );
                var _strokeStyle = me._getProp( node.strokeStyle , p );
                var _lineAlpha = me._getProp( node.lineAlpha, p );
                var _lineWidth = me._getProp( node.lineWidth, p );

                var circleCtx = {
                    x : point.x,
                    y : point.y,
                    r : r,
                    fillStyle: _fillStyle,
                    lineWidth : _lineWidth,
                    strokeStyle : _strokeStyle,
                    lineAlpha : _lineAlpha,
                    cursor: "pointer"
                };

                //设置好p上面的fillStyle 和 strokeStyle
                p.color = p.fillStyle = _fillStyle;
                p.strokeStyle = _strokeStyle;
                p.iRing = i;
                p.iPlanet = ii;
                
                var _circle = new Circle({
                    hoverClone: false,
                    context : circleCtx
                });

                _circle.on("mousedown mouseup panstart mouseover panmove mousemove panend mouseout tap click dblclick", function(e) {
                    
                     e.eventInfo = {
                         title : null,
                         nodes : [ this.nodeData ]
                     };
                     if( this.nodeData.label ){
                         e.eventInfo.title = this.nodeData.label;
                     };

                     if( me.node.focus.enabled ){
                        if( e.type == "mouseover" ){
                            me.focusAt( this.nodeData );
                        }
                        if( e.type == "mouseout" ){
                            me.unfocusAt( this.nodeData );
                        }
                    };
            
                     //fire到root上面去的是为了让root去处理tips
                     me.root.fire( e.type, e );

                     if( me.node.select.enabled && e.type == me.node.select.triggerEventType ){
                        //如果开启了图表的选中交互
                        //TODO:这里不能
                        if( this.nodeData.selected ){
                            //说明已经选中了
                            me.unselectAt( this.nodeData );
                        } else {
                            me.selectAt( this.nodeData );
                        }
                    };
                    me._graphs.triggerEvent( me.node , e );
                 });

                //互相用属性引用起来
                _circle.nodeData = p;
                p.nodeElement = _circle;

                _circle.ringInd = i;
                _circle.planetIndInRing = ii;

                _ringSp.addChild( _circle );

                //然后添加label
                //绘制实心圆上面的文案
                //x,y 默认安装圆心定位，也就是position == 'center'
                var _labelCtx = {
                    x: point.x,
                    y: point.y, //point.y + r +3
                    fontSize: me.label.fontSize,
                    textAlign: me.label.align,
                    textBaseline: me.label.verticalAlign,
                    fillStyle: me.label.fontColor,
                    rotation : -_ringCtx.rotation,
                    rotateOrigin : {
                        x : 0,
                        y : 0 //-(r + 3)
                    }
                };
                var _label = new Canvax.Display.Text( p.label , {
                    context: _labelCtx
                });

                var _labelWidth = _label.getTextWidth();
                var _labelHeight = _label.getTextHeight();

                if( _labelWidth > r*2 ){
                    _labelCtx.fontSize = me.label.fontSize - 3;
                };

                //最开始提供这个function模式，是因为还没有实现center,bottom,auto
                //只能用function的形式用户自定义实现
                //现在已经实现了center,bottom,auto，但是也还是先留着吧，也不碍事
                if( _.isFunction( me.label.position ) ){
                    var _pos = me.label.position( {
                        node : _circle,
                        circleR : r,
                        circleCenter : {
                            x : point.x,
                            y : point.y
                        },
                        textWidth : _labelWidth,
                        textHeight : _labelHeight
                    } );
                    _labelCtx.rotation = -_ringCtx.rotation;
                    _labelCtx.rotateOrigin = {
                        x : -( _pos.x - _labelCtx.x ),
                        y : -( _pos.y - _labelCtx.y )
                    };
                    _labelCtx.x = _pos.x;
                    _labelCtx.y = _pos.y;
                };
                
                if( me.label.position == 'auto' ){
                    if( _labelWidth > r*2){
                        setPositionToBottom();
                    };
                };
                if( me.label.position == 'bottom' ){
                    setPositionToBottom();
                };
                function setPositionToBottom(){
                    _labelCtx.y = point.y + r +3;
                    _labelCtx.textBaseline = "top";
                    _labelCtx.rotation = -_ringCtx.rotation;
                    _labelCtx.rotateOrigin = {
                        x : 0,
                        y : -(r + 3)
                    };
                }

                //TODO:这里其实应该是直接可以修改 _label.context. 属性的
                //但是这里版本的canvax有问题。先重新创建文本对象吧
                _label = new Canvax.Display.Text( p.label , {
                    context: _labelCtx
                });
            
                //互相用属性引用起来
                _circle.labelElement = _label;
                _label.nodeData = p;
                p.labelElement = _label;

                _ringSp.addChild( _label );
            } );

            me.sprite.addChild( _ringSp );
        } );
    }

    _getRProp( r, ringInd, iNode, nodeData )
    {
        var me = this;

        if( _.isString(r) && _.indexOf( me.dataFrame.fields, r ) > -1 ){
            if( this.__rValMax == undefined && this.__rValMax == undefined ){
                this.__rValMax = 0;
                this.__rValMin = 0;
                _.each( me.planets , function( planet ){
                    me.__rValMax = Math.max( me.__rValMax , planet.rowData[ r ] );
                    me.__rValMin = Math.min( me.__rValMin , planet.rowData[ r ] );
                } );
            };
            var rVal = nodeData.rowData[ r ];
            
            return me.node.minR + (rVal-this.__rValMin)/(this.__rValMax-this.__rValMin) * (me.node.maxR - me.node.minR);
        };
        return me._getProp(r , nodeData);
    }

    _getProp( p, nodeData )
    {
        var iGroup = this.iGroup;
        if( _.isFunction( p ) ){
            return p.apply( this , [ nodeData, iGroup ] );
            //return p( nodeData );
        };
        return p;
    }

    getPlanetAt( target ){
        var planet = target;
        if( _.isNumber( target ) ){
            _.each( this.planets , function( _planet ){
                if(_planet.rowData.__index__ == target){
                    planet = _planet;
                    return false;
                }
            } );
        };
        return planet;
    }

    selectAt( ind ){
        if( !this.node.select.enabled ) return;
        var planet = this.getPlanetAt( ind );
        planet.selected = true;
        planet.nodeElement.context.lineWidth = this._getProp( this.node.select.lineWidth , planet );
        planet.nodeElement.context.strokeStyle = this._getProp( this.node.select.strokeStyle , planet );
        planet.nodeElement.context.lineAlpha = this._getProp( this.node.select.lineAlpha , planet ); 
    }
    unselectAt( ind ){
        if( !this.node.select.enabled ) return;
        var planet = this.getPlanetAt( ind );
        planet.selected = false;
        planet.nodeElement.context.lineWidth = this._getProp( this.node.lineWidth , planet );
        planet.nodeElement.context.lineAlpha = this._getProp( this.node.lineAlpha , planet );
    }

    getSelectedNodes(){
        return _.filter( this.planets, function( planet ){
            return planet.selected;
        } );
    }

    focusAt( ind ){
        if( !this.node.focus.enabled ) return;
        var planet = this.getPlanetAt( ind );
        if( planet.selected ) return;
        planet.focused = true;
        planet.nodeElement.context.lineWidth = this._getProp( this.node.focus.lineWidth , planet );
        planet.nodeElement.context.strokeStyle = this._getProp( this.node.focus.strokeStyle , planet );
        planet.nodeElement.context.lineAlpha = this._getProp( this.node.focus.lineAlpha , planet ); 
    }
    unfocusAt( ind ){
        if( !this.node.focus.enabled ) return;
        var planet = this.getPlanetAt( ind );
        if( planet.selected ) return;
        planet.focused = false;
        planet.nodeElement.context.lineWidth = this._getProp( this.node.lineWidth , planet );
        planet.nodeElement.context.lineAlpha = this._getProp( this.node.lineAlpha , planet );
    }

}