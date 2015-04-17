KISSY.add("chartx/index" , function( S ){

   window.Site = {
        local : !! ~location.search.indexOf('local'),
        daily : !! ~location.search.indexOf('daily'),
        debug : !! ~location.search.indexOf('debug'),
        build : !! ~location.search.indexOf('build')
   };
   var dvixVersion   = "1.0.0";
   var dvixUrl       = "http://g.tbcdn.cn/thx/charts";

   var canvaxVersion = "1.0.0";
   var canvaxUrl     = "http://g.tbcdn.cn/thx/canvax";

   if( Site.local ){
       dvixUrl = "./";
   }

   if( Site.daily ){
       dvixUrl = "http://g.assets.daily.taobao.net/thx/canvax/1.0.0/";
   } 

   KISSY.config({
        packages: [{
            name  : 'chartx'   ,
            path  :  dvixUrl ,
            debug :  Site.debug
        },{
            name  : 'canvax' , 
            path  : 'http://g.tbcdn.cn/thx/',
            debug : Site.debug
        }]
   });

   function canvasSupport() {
        return !!document.createElement('canvas').getContext;
   };
   
   //要预加载的文件列表
   var preFiles = [
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
       S.use("chartx/chart/"+chart.name.toLowerCase()+"/" , function(S , Chart ){
            chart = new Chart( chart.el );
            callback( chart );
       });
   }

   chartRute();

   var Charts = {};

   function createChart( chartName ){
      return function( el ){
          this.name = chartName;
          this.el   = el;
          var me    = this;
          this._readyHand = [];
          this.done = function( fun ){
              if( this.chart ){ 
                  fun.apply( this , [ this.chart ] );
              } else {
                  this._readyHand.push( fun );
              }
          };

          chartRute( this , function( chart ){
              me.chart = chart;
              if( me._readyHand.length > 0 ) {
                  //如果有_readyHand
                  for( var i = 0 , fl = me._readyHand.length ; i < fl ; i++ ){
                     me.done( me._readyHand[i] );
                  }
              }
          });
      }
   }

   Charts.BrokenLine = createChart( "brokenline" );
   Charts.upLoading  = createChart( "uploading"  );

   return Charts;
} );
