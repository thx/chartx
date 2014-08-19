KISSY.add(function( S , Canvax , Rect , Tween ){
 
    var Graphs = function( opt , data ){
        this.w = 0;
        this.h = 0;
       
        this.pos = {
            x : 0,
            y : 0
        }


        this._colors = ["#6f8cb2" , "#c77029" , "#f15f60" , "#ecb44f" , "#ae833a" , "#896149"];


        this.bar = {
            width : 12
        }


        this.bar.width = 12;

        this.sprite = null ;

        _.deepExtend(this , opt);

        this.init( data );

    };

    Graphs.prototype = {
        init : function(){
            this.sprite = new Canvax.Display.Sprite({ id : "graphsEl" });
        },
        setX:function($n){
            this.sprite.context.x = $n
        },
        setY:function($n){
            this.sprite.context.y = $n
        },
        getBarFillStyle : function( i , ii , value){
            var barFillStyle = null;
            
            if( _.isArray( this.bar.fillStyle ) ){
                barFillStyle = this.bar.fillStyle[ii]
            }
            if( _.isFunction( this.bar.fillStyle ) ){
                barFillStyle = this.bar.fillStyle( i , ii , value );
            }
            if( !barFillStyle || barFillStyle=="" ){
                barFillStyle = this._colors[ii];
            }
            return barFillStyle;
        },
        checkBarW : function( xDis ){
            if( this.bar.width >= xDis ){
                this.bar.width = xDis-1;
            }
        },
        draw : function(data , opt){
            _.deepExtend(this , opt);
            if( data.length == 0 ){
                return;
            }

            //这个分组是只x方向的一维分组
            var barGroupLen = data[0].length;

            for( var i = 0 ; i < barGroupLen ; i++ ){
                var sprite = new Canvax.Display.Sprite({ id : "barGroup"+i });
                for( var ii = 0 , iil = data.length ; ii < iil ; ii++ ){
                    var barData = data[ii][i];

                       var rect = new Rect({
                        context : {
                            x         : Math.round(barData.x - this.bar.width/2),
                            y         : barData.y,
                            width     : this.bar.width,
                            height    : Math.abs(barData.y),
                            fillStyle : this.getBarFillStyle( i , ii , barData.value ),
                            radius    : [this.bar.width/2 , this.bar.width/2, 0 , 0]
                        }
                    });
                    sprite.addChild( rect );
                }
                this.sprite.addChild( sprite );
            }

            this.setX( this.pos.x );
            this.setY( this.pos.y );
        },
        /**
         * 生长动画
         */
        grow : function(){
            var self  = this;
            var timer = null;
            var growAnima = function(){
               var bezierT = new Tween.Tween( { h : 0 } )
               .to( { h : self.h }, 500 )
               .onUpdate( function (  ) {
                   self.sprite.context.scaleY = this.h / self.h;
               } ).onComplete( function(){
                   cancelAnimationFrame( timer );
               }).start();
               animate();
            };
            function animate(){
                timer    = requestAnimationFrame( animate ); 
                Tween.update();
            };
            growAnima();
        }
    }; 

    return Graphs;

} , {
    requires : [
        "canvax/",
        "canvax/shape/Rect",
        "canvax/animation/Tween"
    ]
})
