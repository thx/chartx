KISSY.add("dvix/chart/" , function( S , Canvax ){
    var $ = S.all;
    var Chart = function(node){
        
        this.element       =  $(node); //chart 在页面里面的容器节点，也就是要把这个chart放在哪个节点里
        this.width         =  parseInt( this.element.width() );  //图表区域宽
        this.height        =  parseInt( this.element.height() ); //图表区域高

        //Canvax实例
        this.canvax        =  new Canvax({
            el : this.element
        });
        this.stage         =  new Canvax.Display.Stage({
            id : "main",
            context : {
                x : 0.5,
                y : 0.5
            }
        });

        this.canvax.addChild( this.stage );
        
        arguments.callee.superclass.constructor.apply(this, arguments);
        this.init.apply(this , arguments);
    };

    Chart.Canvax = Canvax;

    Chart.extend = function(props, statics, ctor) {
        var me = this;
        var BaseChart = function() {
            me.apply(this , arguments);
            if (ctor) {
                ctor.apply(this, arguments);
            }
        };
        BaseChart.extend = me.extend;
        return S.extend(BaseChart, me, props, statics);
    };

    
    S.extend( Chart , Canvax.Event.EventDispatcher , {
        init   : function(){},
        rotate : function( angle ){
            var currW = this.width;
            var currH = this.height;
            this.width  = currH;
            this.height = currW;

            var self = this;
            _.each( self.stage.children , function( sprite ){
                sprite.context.rotation       = angle || -90;
                sprite.context.x              = ( currW - currH ) / 2 ;
                sprite.context.y              = ( currH - currW ) / 2 ;
                sprite.context.rotateOrigin.x = self.width  * sprite.context.$model.scaleX / 2;
                sprite.context.rotateOrigin.y = self.height * sprite.context.$model.scaleY / 2;
            });
        },
     
        /**
         * 把原始的数据
         * field1 field2 field3
         *   1      2      3
         *   2      3      4
         * 这样的数据格式转换为内部的
         * [{field:'field1',index:0,data:[1,2]} ......]
         * 这样的结构化数据格式。
         */
        _initData  : function( data , opt ){

            this.dataFrame.org = data;
            opt.yAxis && opt.yAxis.fields && _.extend(this.dataFrame.yAxis.fields , opt.yAxis.fields);
            opt.xAxis && opt.xAxis.field  && (this.dataFrame.xAxis.field = opt.xAxis.field);

            var total = [];
            var arr = this.dataFrame.org;

            for(var a = 0, al = arr[0].length; a < al; a++){
                var o = {};
                o.field = arr[0][a];
                o.index = a;
                o.data  = [];
                total.push(o);
            }

            for(var a = 1, al = arr.length; a < al; a++){
                for(var b = 0, bl = arr[a].length; b < bl; b++){
                    total[b].data.push(arr[a][b]);
                }     
            }
            this.dataFrame.data = total;
            //已经处理成[o,o,o]   o={field:'val1',index:0,data:[1,2,3]}

            var arr = this.dataFrame.data;


            /*
             * 先设置xAxis的数据
             */
            var xField = this.dataFrame.xAxis.field;
            if( !xField || xField=="" ){
                this.dataFrame.xAxis.org   = arr[0].data;
                this.dataFrame.xAxis.field = arr[0].field;
            } else {
                //如果有配置好的xAxis字段
                this.dataFrame.xAxis.org = _.findWhere( arr , { field : xField } ).data;
            }

            /*
             * 然后设置对应的yAxis数据
             */
            var yFields = this.dataFrame.yAxis.fields;
            if( yFields.length == 0 ){
                //如果yFields没有，那么就自动获取除开xField 的所有字段
                this.dataFrame.yAxis.org = _.pluck( _.reject( arr , function( obj ){
                   return obj.field != this.dataFrame.xAxis.field;
                } ) , "data" );
            } else {
                //如果有配置yFields，那么就按照配置的来啊
                this.dataFrame.yAxis.org = _.pluck( _.filter( arr , function( obj ){
                   return _.some( yFields , function( field ){
                       return obj.field == field;
                   } ); 
                } ) , "data" );
            }

        }
    });

    return Chart;

} , {
    requires : [
        "canvax/",
        "node"
        ]
})
