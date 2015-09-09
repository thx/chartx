define(
    "canvax/utils/ImagesLoader",
    [
        "canvax/core/Base",
        "canvax/event/EventDispatcher"
    ],
    function(Base , EventDispatcher ){
        var ImagesLoader = function( urls ){
            arguments.callee.superclass.constructor.apply(this, arguments);
            this.urls  = urls || [];   //要加载的images
            this.images= []; //正在加载的img
            this.loads = 0;  //已经加载了多少回来
            this.init();
        };
     
        Base.creatClass( ImagesLoader , EventDispatcher , {
            init      : function(){
                this.images.length = this.urls.length;
            },
            _loadHand : function( i , callback ) {
                var img  = new Image();
     
               
                var self = this;
             
     
                img.onload = function () {
                    //if (img.complete == true) {
                    
                    //把这个img 查到 它的url在urls中对应的index中去
                    self.images.splice( i , 1 , img );
                    callback(i , img);
                    
                    //}
                    //alert(i)
                }
                return img;
     
     
                /*
                //做浏览器嗅探添加不同的侦听
                var appname = navigator.appName.toLowerCase();
     
                if (appname.indexOf("netscape") == -1) {
                    //ie
                    img.onreadystatechange = function () {
                        if (img.readyState == "complete") {
                            callback(i , img);
                        }
                    };
                } else {
                    //标准浏览器
                    img.onload = function () {
                        //if (img.complete == true) {
                            callback(i , img);
                        //}
                    }
                }
                return img;
                */
     
            },
            _load    : function( i , src , callback ){
                //必须先在src赋值前注册事件
                this._loadHand( i , callback ).src = src+"?t="+new Date().getTime();
            },
            start   : function(){
                //开始加载
                var self = this;
     
                if(this.urls.length > 0){
                   for( var i = 0,l = this.urls.length ; i < l ; i++ ){
                      var url = this.urls[ i ];
     
                      self._load( i , url , function( i , img ){
                           //回传对应的索引 和 img对象
                           self.loads = self.loads+1 ;
     
                           if( self.hasEvent("secSuccess") ){
                               self.fire( {
                                   index : i,
                                   img   : img,
                                   type  : "secSuccess"
                               } );
                           } 
     
                           if(self.loads == l){
                              //已经load完了
                              if( self.hasEvent("success") ){
                                  //alert('loads' + self.loads);
                                  self.fire( {
                                     images : self.images,
                                     type   : "success"
                                  } );
                              }
                           }
                      } );
                   }
                }
            }
            
        });
     
        return ImagesLoader;
    } 
) 
