KISSY.add("charts/index" , function( S ){

   window.Site = {
        local: !! ~location.search.indexOf('local'),
        debug: !! ~location.search.indexOf('debug'),
        build: !! ~location.search.indexOf('build')
   };

   var chartsUrl = "http://g.tbcdn.cn/thx/canvax";
   Site.local && ( chartsUrl = "./" )

   KISSY.config({
        packages: [{
            name  : 'charts',
            path  :  chartsUrl,
            debug :  Site.debug
        }]
   });

   function canvasSupport() {
        return !!document.createElement('canvas').getContext;
   }; 
   
   //要预加载的文件列表
   var preFiles = [
       "http://g.tbcdn.cn/thx/canvax/library/underscore.js",
       "http://g.tbcdn.cn/thx/canvax/index.js"
   ];

   //如果不支持canvas，自动加载flashcanvas
   if ( !canvasSupport() ) {
       preFiles.push("http://g.tbcdn.cn/thx/canvax/library/flashCanvas/flashcanvas.js");
   };

   var preIsReady   = false;

   //临时的任务队列。如果预加载的资源还没准备完毕，就先push到这里。
   var currTaskList = [];
   var chartRute = function( chart , callback ){
       if(!preIsReady && preFiles.length > 0){
         //说明预加载的文件还没加载好，先把任务放入缓存队列
         if( chart && callback ) {
             currTaskList.push( {
                 chart    : chart ,
                 callback : callback
             } );
         };

         (function(){
            var fun = arguments.callee;
            S.getScript( preFiles.shift() , {
              success : function(){
                 if(preFiles.length>0){
                   fun();
                 } else {
                   preIsReady = true;
                   //如果临时任务队列中有任务。执行任务
                   if( currTaskList.length > 0 ){
                       (function(){
                           var fun = arguments.callee;
                           var task = currTaskList.shift();
                           useConstructor( task.chart , function( chart ){
                               task.callback( chart );
                               //然后看有没有下一个任务
                               if( currTaskList.length > 0 ){
                                   fun();
                               }
                           } );
                       })();
                   }
                 }
              }
            } );
         })();
       } else {
         //直接执行任务
         useConstructor( chart , callback);
       }
   };
   
   function useConstructor( chart , callback ){
       S.use("charts/chart/"+chart.name.toLowerCase()+"/"+chart.name , function(S , Chart ){
            chart = new Chart( chart.el );
            callback( chart );
       });
   }

   chartRute();

   var Charts = {};

   Charts.BrokenLine = function( el ){
       this.name = "BrokenLine";
       this.el   = el;
       var me    = this;
       this._readyHand = null;
       this.done = function( fun ){
            if( this.chart ){ 
                fun.apply( this , [ this.chart ] );
            } else {
                this._readyHand = fun;
            }
       };
       chartRute( this , function( chart ){
           me.chart = chart;
           if( me._readyHand ) {
              //如果有_readyHand
              me.done( me._readyHand );
           }
       });
   }

   return Charts;
} , {
   requires : [
   ]
})
