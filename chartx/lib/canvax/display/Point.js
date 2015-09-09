define(
    "canvax/display/Point",
    [],
    function(){
        var Point = function(x,y){
            if(arguments.length==1 && typeof arguments[0] == 'object' ){
               var arg=arguments[0]
               if( "x" in arg && "y" in arg ){
                  this.x = arg.x*1;
                  this.y = arg.y*1;
               } else {
                  var i=0;
                  for (var p in arg){
                      if(i==0){
                        this.x = arg[p]*1;
                      } else {
                        this.y = arg[p]*1;
                        break;
                      }
                      i++;
                  }
               }
               return;
            }
            x || (x=0);
            y || (y=0);
            this.x = x*1;
            this.y = y*1;
        };
        return Point;
    }
);
