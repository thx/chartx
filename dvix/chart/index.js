window.FlashCanvasOptions = {
    swfPath: "http://g.tbcdn.cn/thx/canvax/1.0.0/canvax/library/flashCanvas/"
};
KISSY.add(function( S , Canvax ){
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

            var dataFrame  =  {    //数据框架集合
                org        : [],   //最原始的数据  
                data       : [],   //最原始的数据转化后的数据格式：[o,o,o] o={field:'val1',index:0,data:[1,2,3]}
                yAxis      : {     //y轴
                    field  : [],   //字段集合 对应this.data
                    org    : []    //二维 原始数据[[100,200],[1000,2000]]
                },
                xAxis      : {     //x轴
                    field  : [], //字段 对应this.data
                    org    : []    //原始数据['星期一','星期二']
                }
            }

            var arr = dataFrame.org = data;
            var fileds = arr[0]; //所有的字段集合

            _.extend( dataFrame.yAxis , opt.yAxis );
            _.extend( dataFrame.xAxis , opt.xAxis );

     
            var total = [];

            for(var a = 0, al = fileds.length; a < al; a++){
                var o = {};
                o.field = fileds[a];
                o.index = a;
                o.data  = [];
                total.push(o);
            }

            for(var a = 1, al = arr.length; a < al; a++){
                for(var b = 0, bl = arr[a].length; b < bl; b++){
                    total[b].data.push(arr[a][b]);
                }     
            }

            dataFrame.data = total;
            //已经处理成[o,o,o]   o={field:'val1',index:0,data:[1,2,3]}


            var getDataOrg = function( $field , totalList ){
                var arr = _.filter( totalList , function( obj ){
                    return _.some( $field , function( field ){
                        return obj.field == field;
                    } ); 
                } );
                //这个时候的arr只是totalList的过滤，还没有完全的按照$field 中的排序
                var newData = [];
                for( var i=0,l=$field.length; i<l ; i++ ){
                    for( var ii=0,iil=arr.length ; ii<iil ; ii++ ){
                         if( $field[i] == arr[ii].field ){
                             newData.push( arr[ii].data );
                             break;
                         }
                    }
                }
                return newData;
            }

            /*
             * 先设置xAxis的数据
             */
            var xField = dataFrame.xAxis.field;
            if( !xField || xField=="" || (_.isArray(xField) && xField.length == 0) ){
                dataFrame.xAxis.org = [ total[0].data  ];
                xField = dataFrame.xAxis.field = [ total[0].field ];
            } else {
                //如果有配置好的xAxis字段
                if( _.isString(xField) ){
                    xField = [xField];
                }
                dataFrame.xAxis.org = getDataOrg( xField , total ); 
            }

            /*
             * 然后设置对应的yAxis数据
             */
            var yField = dataFrame.yAxis.field;
            if( !yField || yField=="" || (_.isArray(yField) && yField.length == 0) ){
                //如果yField没有，那么就自动获取除开xField 的所有字段    
                yField = _.difference( fileds , xField );
            } else if( _.isString( yField ) ){
                yField = [ yField ];
            }             
            dataFrame.yAxis.field = yField;
            dataFrame.yAxis.org   = getDataOrg( yField , total );
            
            return dataFrame;
        }
    });

    return Chart;

} , {
    requires : [
        "canvax/",
        "node"
        ]
})
