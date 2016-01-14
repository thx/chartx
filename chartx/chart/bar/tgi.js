define(
    "chartx/chart/bar/tgi",
    [
        'chartx/chart/bar/index'
    ],
    function( Bar ){
        return Bar.extend( {
            _init:function(node , data , opts){

            },
            draw:function(){
                this._setStages();
                this._initModule();                        //初始化模块
                this._startDraw();                         //开始绘图
                this._drawEnd();                         //绘制结束，添加到舞台
            }
        });
    }
);
