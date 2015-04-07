KISSY.ready( function(S){
 
   var data    = [];
   var options = {}

   Chartx.create.progress("loading" , data , options).then(function( chart ){
       chart.draw();
   })
} );
