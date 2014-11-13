
KISSY.add(function( S , Canvax ){
    var $ = S.all;
    var Chart = function(node , data , opts){
        this.el            =  $(node); //chart 在页面里面的容器节点，也就是要把这个chart放在哪个节点里
        this.width         =  parseInt( this.el.width() );  //图表区域宽
        this.height        =  parseInt( this.el.height() ); //图表区域高

        //Canvax实例
        this.canvax        =  new Canvax({
            el : this.el
        });
        this.stage         =  new Canvax.Display.Stage({
            id : "main"
        });

        this.canvax.addChild( this.stage );

        //为所有的chart添加注册事件的能力
        arguments.callee.superclass.constructor.apply(this, arguments);

        this.init.apply(this , arguments);

        _.deepExtend( this , opts );

        //数据集合，由_initData 初始化
        this.dataFrame = this._initData(data, this);
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
        draw   : function(){},
        /*
         * 清除整个图表
         **/
        clear : function(){
            _.each( this.canvax.children , function( stage , i ){
                stage.removeAllChildren();
            } );
        },
        /**
         * 容器的尺寸改变重新绘制
         */
        resize : function(){
            this.clear();
            this.width   = parseInt(this.el.width());
            this.height  = parseInt(this.el.height());
            this.canvax.resize();
            this.draw();
        },
        /**
         * reset有两种情况，一是data数据源改变， 一个options的参数配置改变。
         * @param obj {data , options}
         */
        reset : function( obj ){
            if( !obj || _.isEmpty(obj)){
                return;
            }
            //如果要切换新的数据源
            if( obj.options ){
                //注意，options的覆盖用的是deepExtend
                //所以只需要传入要修改的 option部分
                _.deepExtend( this , opts );
            }
            if( obj.data ){
                //数据集合，由_initData 初始化
                this.dataFrame = this._initData( data , this );
            }
            this.clear();
            this.draw();
        },
        
        _rotate : function( angle ){
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
                //org        : [],   //最原始的数据  
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

            var arr = data;
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
        "node",
        'dvix/utils/deep-extend'
        ]
})
