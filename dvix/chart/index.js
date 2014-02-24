KISSY.add("dvix/chart/" , function( S , Dvix ){
  
    var Canvax = Dvix.Canvax;

    var Chart  = function(){
        arguments.callee.superclass.constructor.apply(this, arguments);

    };

    Canvax.Base.creatClass( Chart , Canvax.Event.EventDispatcher , {
        reSet : function(){
           this.canvax && this.canvax.reSet();
        }
    });

    Chart.Canvax = Canvax;

    return Chart;
    
} , {
    requires : [
        "dvix/"
        ]
})
