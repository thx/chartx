define(
    "chartx/chart/original/demand",
    [
        'chartx/chart/index',
        'chartx/utils/simple-data-format',
        'chartx/chart/original/demand/graphs',
        'chartx/components/polar/polar'
    ],
    function(Chart , dataFormat , Graphs , Polar){
        /*
         *@node chart在dom里的目标容器节点。
        */
        var Canvax = Chart.Canvax;
    
        return Chart.extend( {
            init:function(node, data, opts){
                this._node = node;
                this._data = data;
                this._opts = opts;

                this._graphs = null;
                this._coordinate = null;

                this.dataFrame = this.initData( data );
            },
            draw:function(){
                this._initModule(); //初始化模块  

                this._startDraw(); //开始绘图

                this._drawEnd(); //绘制结束，添加到舞台
                
                this.inited = true;
            },
            _initModule : function(){
                var w = this.width - this.padding.left - this.padding.right;
                var h = this.height - this.padding.top - this.padding.bottom;

                //初始化坐标系统
                this._coordinate = new Polar( _.deepExtend({
                    w : w,
                    h : h
                } , this._opts.coordinate ));

                this._graphs = new Graphs({
                    coordinate : this._coordinate, //极坐标系统
                    options : this.graphs,
                    dataFrame : this.dataFrame                    
                });
            },
            _startDraw: function(){
                this._graphs.draw();
            },
            _layout: function(){
                var _gsc = this._graphs.sprite.context;
                _gsc.x = this.padding.left;
                _gsc.y = this.padding.top;
            },
            _drawEnd: function(){
                this.stage.addChild( this._graphs.sprite );
            },
            initData: dataFormat
           
        });
    
    } 
);
