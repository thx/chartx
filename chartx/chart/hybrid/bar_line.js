define(
    "chartx/chart/hybrid/bar_line",
    [
        'canvax/index',
        'chartx/chart/bar/index',
        'chartx/chart/line/index',
        'chartx/components/tips/tip'
    ],
    function( Canvax , Bar , Line , Tip ){
        //再柱状图的基础上开发柱折混合图表
        return Bar.extend( {
            init:function(node , data , opts){
                _.deepExtend( this , opts );
                this.dataFrame = this._initData( data );
            }
        });
    }
);
