KISSY.ready( function(S){
   KISSY.use("visualization/ , anim , node " , function( S , Charts , uploading , Anim ){
      var el = S.all("#loading");
      var ul = new Charts.upLoading( el );
      ul.done(function( chart ){
          chart.draw();
      });

      window.ul = ul;

   }); 
} )
