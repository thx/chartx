KISSY.ready( function(S){
   KISSY.use("charts/ , charts/chart/uploading/ , anim , node " , function( S , Charts , uploading , Anim ){
      var el = S.all("#loading");
      var ul = new uploading( el );
      ul.draw();

      window.ul = ul;

   }); 
} )
