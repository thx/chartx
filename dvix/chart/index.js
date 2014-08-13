var DvixSite = {
        local : !! ~location.search.indexOf('local'),
        daily : !! ~location.search.indexOf('daily'),
        debug : !! ~location.search.indexOf('debug'),
        build : !! ~location.search.indexOf('build')
    };

if(  (/daily.taobao.net/g).test(location.host)  ){
    DvixSite.daily = true;
}

var canvaxVersion = "2014.07.25";
var canvaxUrl     = "http://g.tbcdn.cn/thx/canvax/"+ canvaxVersion +"/";
if( DvixSite.daily ){
    canvaxVersion = '2014.07.25';
    canvaxUrl     = "http://g.assets.daily.taobao.net/thx/canvax/" + canvaxVersion + "/";
}
if( DvixSite.local ){
    //本地环境测试
    canvaxUrl = "http://nick.daily.taobao.net/canvax"
}

KISSY.config({
    packages: [{
        name  : 'canvax' , 
        path  :  canvaxUrl,
        debug :  DvixSite.debug,
        combine : !DvixSite.local
    }]
});

KISSY.add("dvix/chart/" , function( S , Dvix ){
    var $ = S.all;
    var Chart = function(node){
        this.element       =  $(node); //chart 在页面里面的容器节点，也就是要把这个chart放在哪个节点里
        this.width         =  parseInt( this.element.width() );  //图表区域宽
        this.height        =  parseInt( this.element.height() ); //图表区域高

        //Canvax实例
        this.canvax        =  new Dvix.Canvax({
            el : this.element
        });
        this.stage         =  new Dvix.Canvax.Display.Stage({
            id : "main",
            context : {
                x : 0.5,
                y : 0.5
            }
        });

        this.canvax.addChild( this.stage );
        
        this.init.apply(this , arguments);
    };

    Chart.Canvax = Dvix.Canvax;

    Chart.extend = function(props, statics, ctor) {
        var me = this;
        var BaseChart = function(a) {
            me.call(this, a);
            if (ctor) {
                ctor.call(this, a);
            }
        };
        BaseChart.extend = me.extend;
        return S.extend(BaseChart, me, props, statics);
    };
    Chart.prototype = {
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
        _initData  : function( data ){

            this.dataFrame.org = data;

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
            for(var a = 0, al = arr.length; a < al; a++){
                var o = arr[a];

                //如果没有配置xAxis的字段。
                if(!this.dataFrame.xAxis.field){

                    //那么默认第一个字段就为xAxis的数据字段
                    if(a == 0){
                        this.dataFrame.xAxis.org = o.data
                    }

                    //如果yAxis的字段集合（yAxis可以为集合）也没有配置
                    if(this.dataFrame.yAxis.fields.length == 0){

                        //那么除开第一个字段外（因为这个时候第一个字段为xAxis字段）都默认设置为yAxis字段
                        if(a != 0){
                            this.dataFrame.yAxis.org.push(o.data)
                        }

                    } else {
                        //当然，如果yAxis有配置，自然 所有的 配置里面都设置为yAxis字段
                        for(var b = 0, bl = this.dataFrame.yAxis.fields.length; b < bl; b++){
                            if(o.field == this.dataFrame.yAxis.fields[b]){
                                this.dataFrame.yAxis.org[b] = o.data
                            }
                        }
                    }
                } else {
                    //如果有配置xAxis字段，当然，就用配置的xAxis了
                    if(o.field == this.dataFrame.xAxis.field){
                        this.dataFrame.xAxis.org = o.data
                    }
                    //那么y呢？
                    //如果y有配置就用除开xAxis以外的所有字段
                    if(this.dataFrame.yAxis.fields.length == 0){
                        if(o.field != this.dataFrame.xAxis.field){
                            this.dataFrame.yAxis.org.push(o.data)
                        }
                    } else {
                        //没有就用x以外的所有字段
                        for(var b = 0, bl = this.dataFrame.yAxis.fields.length; b < bl; b++){
                            if(o.field == this.dataFrame.yAxis.fields[b]){
                                this.dataFrame.yAxis.org[b] = o.data
                            }
                        } 
                    }
                }
            }
        }
    };

    return Chart;

} , {
    requires : [
        "dvix/",
        "node"
        ]
})
