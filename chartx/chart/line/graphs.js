define(
    "chartx/chart/line/graphs", [
        "canvax/index",
        "canvax/shape/Rect",
        "chartx/utils/tools",
        "chartx/chart/line/group",
        "chartx/chart/line/markcolumn",
        "canvax/core/Base",
        "canvax/event/EventDispatcher"
    ],
    function(Canvax, Rect, Tools, Group, markColumn, CanvaxBase , CanvaxEventDispatcher) {
        var Graphs = function(opt, root) {
            this.w = 0;
            this.h = 0;
            this.y = 0;

            //这里所有的opt都要透传给 group
            this.opt = opt;
            this.root = root;
            this.ctx = root.stage.context2D;
            this.dataFrame = opt.dataFrame || root.dataFrame; //root.dataFrame的引用
            this.data = []; //二维 [[{x:0,y:-100,...},{}],[]]

            //field默认从this.dataFrame.yAxis.field获取
            this.field = this.dataFrame.yAxis.field;

            //一个记录了原始yAxis.field 一些基本信息的map
            //{ "uv" : {ind : 0 , _yAxis : , line} ...}
            this._yAxisFieldsMap = {};
            this._setyAxisFieldsMap( this.field );

            
            this.disX = 0; //点与点之间的间距
            this.groups = []; //群组集合     

            this.iGroup = 0; //群组索引(哪条线)
            this.iNode = -1; //节点索引(那个点)

            this.sprite = null;
            this.induce = null;

            this.eventEnabled = true;

            //TODO:
            //暂时继承CanvaxEventDispatcher 只有 DisplayObject才行， 以为其他对象没有_eventMap
            //临时加上
            this._eventMap = {};

            this.init(opt);
        };
        CanvaxBase.creatClass( Graphs , CanvaxEventDispatcher , {
            init: function(opt) {
                this.opt = opt;
                _.deepExtend(this, opt);
                this.sprite = new Canvax.Display.Sprite();
            },
            setX: function($n) {
                this.sprite.context.x = $n
            },
            setY: function($n) {
                this.sprite.context.y = $n
            },
            getX: function() {
                return this.sprite.context.x
            },
            getY: function() {
                return this.sprite.context.y
            },
            draw: function(opt) {
                _.deepExtend(this, opt);

                this.disX = this._getGraphsDisX();

                this.data = this._trimGraphs();
                
                this._widget(opt);
                
                var me = this;
                _.each( this.groups , function( group ){
                    me._yAxisFieldsMap[group.field].line = group.line;
                } );
            },
            reset: function(opt , dataFrame) {
                var me = this;

                if(dataFrame){
                    me.dataFrame = dataFrame;
                    me.data = me._trimGraphs();
                };

                if( opt ){
                    _.deepExtend(me, opt);
                    if( opt.yAxisChange ){
                        me.yAxisFieldChange( opt.yAxisChange , this.dataFrame);
                    };
                };

                this.disX = this._getGraphsDisX();

                for (var a = 0, al = me.field.length; a < al; a++) {
                    var group = me.groups[a];
                    group.reset({
                        data: me.data[ group.field ]
                    });
                };
            },
            //_yAxis, dataFrame
            _trimGraphs: function( ) {
                var self = this;
                //柱折混合图里面会把_yAxis设置为_yAxisR
                var _yAxis = self._yAxis || self.root._yAxis;
                var _dataFrame = self.dataFrame || self.root.dataFrame;

                var maxYAxis = _yAxis.dataSection[_yAxis.dataSection.length - 1];
                var tmpData = {}; //{"uv":[{}.. ,"click"]}
                var center = [];
                function __trimGraphs(_fields, _center, _firstLay) {
                    for (var i = 0, l = _fields.length; i < l; i++) {

                        var field = _fields[i];
                        
                        if (_firstLay && self.root.biaxial && i > 0) {
                            self._yAxisFieldsMap[ field ].yAxisInd = 1; //1代表右边的y轴
                            _yAxis = self.root._yAxisR;
                            maxYAxis = _yAxis.dataSection[_yAxis.dataSection.length - 1];
                        };

                        if (_.isArray( field )) {
                            var __center = [];
                            _center.push(__center);
                            __trimGraphs( field, __center );
                        } else {
                            var maxValue = 0;
                            _center[i] = {};

                            //单条line的全部data数据
                            var _lineData = _dataFrame.getFieldData(field);
                            if( !_lineData ) return;

                            var _groupData = [];
                            for (var b = 0, bl = _lineData.length; b < bl; b++) {

                                //不能用x轴组件的x值， 要脱离关系， 各自有自己的一套计算方法，以为x轴的数据是可能完全自定义的
                                //var x = self.root._xAxis.data[b].x;
                                //下面这个就是 完全自己的一套计算x position的方法
                                //var x = b * self.root._xAxis.xGraphsWidth / (bl-1);
                                
                                var x = self.root._xAxis.getPosX( {
                                    ind : b,
                                    dataLen : bl,
                                    layoutType : self.root.xAxis.layoutType
                                } );
                                
                                var y = -(_lineData[b] - _yAxis._bottomNumber) / (maxYAxis - _yAxis._bottomNumber) * _yAxis.yGraphsHeight
                                y = isNaN(y) ? 0 : y
                                _groupData.push( {
                                    value: _lineData[b],
                                    x: x,
                                    y: y
                                } );

                                maxValue += _lineData[b]
                            };

                            tmpData[ field ] = _groupData;

                            _center[i].agValue = maxValue / bl;
                            _center[i].agPosition = -(_center[i].agValue - _yAxis._bottomNumber) / (maxYAxis - _yAxis._bottomNumber) * _yAxis.yGraphsHeight;
                        }
                    }
                };

                __trimGraphs( self._getYaxisField(), center, true);

                //均值
                _dataFrame.yAxis.center = center;
                return tmpData;
            },
            /**
             * 生长动画
             */
            grow: function(callback) {
                var gi = 0;
                var gl = this.groups.length;
                var me = this;
                _.each(this.groups, function(g, i) {
                    g._grow(function(){
                        gi++;
                        callback( g );
                        if( gi == gl ){
                            me.fire("growComplete");
                        }
                    });
                });
                return this;
            },
            _setyAxisFieldsMap: function( fields ) {
                var me = this;
                me._yAxisFieldsMap = {};
                _.each(_.flatten( fields ), function(field, i) {
                    var _yAxisF = me._yAxisFieldsMap[field];
                    if( _yAxisF ){
                        me._yAxisFieldsMap[field].ind = i;
                    } else {
                        me._yAxisFieldsMap[field] = {
                            ind: i,
                            yAxisInd: 0 //0为依赖左边的y轴，1为右边的y轴
                        };
                    }
                });
            },
            //如果add的field是之前_yAxisFieldsMap中没有的，默认都是添加到左边的y轴
            _addNewField: function( field ){
                if( !this._yAxisFieldsMap[field] ){
                    var maxInd;
                    for( var f in this._yAxisFieldsMap ){
                        if( isNaN( maxInd ) ){
                            maxInd = 0;
                        };
                        maxInd = Math.max( this._yAxisFieldsMap[f].ind , maxInd );
                    };
                    this._yAxisFieldsMap[field] = {
                        ind : isNaN( maxInd )? 0 : ++maxInd,
                        yAxisInd : 0
                    };
                };
            },
            _getYaxisField: function(i) {
                return this.field;
            },
            creatFields: function( field , fields){
                var me = this;
                var fs = [];
                _.each( fields , function( f , i ){
                    if( _.isArray(f) ){
                        fs.push( me.creatFields( field , f ) );
                    } else {
                        if( field == f ){
                            fs.push( f );
                        } else {
                            fs.push( null );
                        }
                    }
                } );
                return fs;
            },
            /*
            * 如果配置的yAxis有修改
            */
            yAxisFieldChange : function( yAxisChange , dataFrame ){
                this.dataFrame = dataFrame;
                this.data = this._trimGraphs();

                var me = this;
                _.isString( yAxisChange ) && (yAxisChange = [yAxisChange]);

                //如果新的yAxis.field有需要del的
                for( var i=0,l=me.field.length ; i<l ; i++ ){
                    var _f = me.field[i];
                    var dopy = _.find( yAxisChange , function( f ){
                        return f == _f
                    } );
                    if( !dopy ){
                        me.remove(i);
                        me.field.splice( i , 1 );
                        delete me._yAxisFieldsMap[ _f ];
                        i--;
                        l--;
                    };
                };

                //然后把新的field设置好
                this.field = this.dataFrame.yAxis.field;
                //remove掉被去掉的field后，重新整理下 _yAxisFieldsMap
                me._setyAxisFieldsMap( this.field );


                //新的field配置有需要add的
                _.each( yAxisChange , function( opy , i ){
                    var fopy = _.find( me.groups ,function( f ){
                        return f.field == opy;
                    } );
                    if( !fopy ){
                        me.add(opy);
                    };

                } );

                _.each( me.groups , function( g , i ){
                    g.update( _.extend({
                        _groupInd : i
                    } , me.opt ));
                } );

                
            },
            //add 和 remove 都不涉及到 _yAxisFieldsMap 的操作,只有reset才会重新构建 _yAxisFieldsMap
            add: function(field , opt) {

                _.deepExtend(this, opt);

                this._addNewField( field );
                
                this.data = this._trimGraphs();
                
                var creatFs = this.creatFields(field , this._getYaxisField());
                
                this._setGroupsForYfield( creatFs );
                
                this.update();
            },
            /*
             *删除 ind
             **/
            remove: function(i) {
                this.groups.splice(i, 1)[0].destroy();
                this.data = this._trimGraphs();
                this.update();
            },
            /*
             * 更新下最新的状态
             **/
            update: function(opt) {
                var self = this;
                _.each(this.groups, function(g, i) {
                    g.update({
                        data: self.data[ g.field ]
                    });
                });
            },
            _setGroupsForYfield: function(fields) {

                var gs = [];
                var self = this;
                for (var i = 0, l = fields.length; i < l; i++) {
                    
                    //只有biaxial的情况才会有双轴，才会有 下面isArray(fields[i])的情况发生
                    if (_.isArray(fields[i])) {
                        self._setGroupsForYfield(fields[i]);
                    } else {
                        var _groupData = this.data[ fields[i] ];
                        if( !(fields[i] && _groupData) )  continue;

                        var _sort = self.root._yAxis.sort;
                        var _biaxial = self.root.biaxial;
                        var _yAxis = self.root._yAxis; 

                        //记录起来该字段对应的应该是哪个_yAxis
                        var yfm = self._yAxisFieldsMap[fields[i]];

                        if (_.isArray(_sort)) {
                            _sort = (_sort[yfm.yAxisInd] || "asc");
                        };
                        if (_biaxial) {
                            if (yfm.yAxisInd > 0) {
                                _yAxis = self.root._yAxisR
                            };
                        };

                        var _groupInd = yfm.ind;

                        var group = new Group(
                            fields[i],
                            _groupInd,
                            self.opt,
                            self.ctx,
                            _sort,
                            _yAxis,
                            self.h,
                            self.w
                        );
                        group.draw({
                            data: _groupData,
                            resize : self.resize
                        });
                        self.sprite.addChildAt(group.sprite , i);

                        var insert = false;
                        //在groups数组中插入到比自己_groupInd小的元素前面去
                        for( var gi=0,gl=self.groups.length ; gi<gl ; gi++ ){
                            if( _groupInd < self.groups[gi]._groupInd ){
                                self.groups.splice( gi , 0 , group );
                                insert=true;
                                break;
                            }
                        };
                        //否则就只需要直接push就好了
                        if( !insert ){
                            self.groups.push(group);
                        };
                        gs.push( group );
                    }
                };
                return gs;
            },
            _widget: function(opt) {
                var self = this;

                self._setGroupsForYfield( self.field );
                self.induce = new Rect({
                    id: "induce",
                    context: {
                        y: -self.h,
                        width: self.w,
                        height: self.h,
                        fillStyle: '#000000',
                        globalAlpha: 0,
                        cursor: 'pointer'
                    }
                });

                self.sprite.addChild(self.induce);

                if (self.eventEnabled) {

                    self.induce.on("panstart mouseover", function(e) {
                        e.eventInfo = self._getInfoHandler(e);
                    })
                    self.induce.on("panmove mousemove", function(e) {
                        e.eventInfo = self._getInfoHandler(e);
                    })
                    self.induce.on("panend mouseout", function(e) {
                        e.eventInfo = self._getInfoHandler(e);
                        self.iGroup = 0, self.iNode = -1
                    })
                    self.induce.on("tap click", function(e) {
                        e.eventInfo = self._getInfoHandler(e);
                    })
                }
                self.resize = false;
            },
            _getInfoHandler: function(e) {
                debugger
                var x = e.point.x,
                    y = e.point.y - this.h;
                //todo:底层加判断
                x = x > this.w ? this.w : x;

                var tmpINode = this.disX == 0 ? 0 : parseInt((x + (this.disX / 2)) / this.disX);

                var _nodesInfoList = []; //节点信息集合

                for (var a = 0, al = this.groups.length; a < al; a++) {
                    var o = this.groups[a].getNodeInfoAt(tmpINode);
                    o && _nodesInfoList.push(o);
                };

                var tmpIGroup = Tools.getDisMinATArr(y, _.pluck(_nodesInfoList, "y"));

                this.iGroup = tmpIGroup, this.iNode = tmpINode;
                //iGroup 第几条线   iNode 第几个点   都从0开始
                var node = {
                    iGroup: this.iGroup,
                    iNode: this.iNode,
                    nodesInfoList: _.clone(_nodesInfoList)
                };
                return node;
            },
            getNodesInfoOfx: function( x ){
                var _nodesInfoList = []; //节点信息集合
                for (var a = 0, al = this.groups.length; a < al; a++) {
                    var o = this.groups[a].getNodeInfoOfX(x);
                    o && _nodesInfoList.push(o);
                };
                var node = {
                    iGroup: -1,
                    iNode: -1,
                    nodesInfoList: _.clone(_nodesInfoList)
                };
                return node;
            },
            createMarkColumn: function( x , opt ){
                var ml = new markColumn( opt );
                this.sprite.addChild( ml.sprite );
                ml.h = this.induce.context.height;
                ml.y = -ml.h;
                var e = {
                    eventInfo :  this.getNodesInfoOfx(x)
                }
                ml.show( e , {x : x} );

                return ml;
            },
            //每两个点之间的距离
            _getGraphsDisX: function() {
                var dsl = this.dataFrame.org.length - 1;
                var n = this.w / (dsl - 1);
                if (dsl == 1) {
                    n = 0
                }
                return n
            },
        });
        
        return Graphs;
    }
);