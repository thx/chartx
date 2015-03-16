define(
    "chartx/components/line/Graphs" ,
    [
        "canvax/index",
        "canvax/shape/Rect",
        "chartx/utils/tools",
        "canvax/animation/Tween",
        "chartx/components/line/Group"
    ],
    function( Canvax , Rect, Tools, Tween , Group ){
        var Graphs = function(opt,root){
            this.w       = 0;   
            this.h       = 0; 
            this.y       = 0;

            //这里所有的opt都要透传给group
            this.opt     = opt;
            this.root    = root;
            this.ctx     = root.stage.context2D

            this.data       = [];                          //二维 [[{x:0,y:-100,...},{}],[]]
            this.disX       = 0;                           //点与点之间的间距
            this.groups     = [];                          //群组集合     
    
            this.iGroup     = 0;                           //群组索引(哪条线)
            this.iNode      = -1;                          //节点索引(那个点)
    
            this._nodesInfoList = [];                      //多条线同个节点索引上的节点信息集合
    
            this.sprite     = null;  
            this.induce     = null;                         

            this.event      = {
                enabled       : 0
            }    
    
            this.init(opt)
        };
    
        Graphs.prototype = {
    
            init:function(opt){
                //_.deepExtend( this , opt );
                this.opt = opt;
                this.sprite = new Canvax.Display.Sprite();
            },
            setX:function($n){
                this.sprite.context.x = $n
            },
            setY:function($n){
                this.sprite.context.y = $n
            },
            getX:function(){
                return this.sprite.context.x
            },
            getY:function(){
                return this.sprite.context.y
            },
    
            draw:function(opt){
                _.deepExtend( this , opt );
                this._widget()
            },
            /**
             * 生长动画
             */
            grow : function(){
                var self  = this;
                var timer = null;
                var growAnima = function(){
                   var bezierT = new Tween.Tween( { h : 0 } )
                   .to( { h : self.h }, 300 )
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
            },

            _widget:function(){
                var self  = this;
                
                for(var a = 0,al = self.data.length; a < al; a++){
                    
                    var group = new Group(
                        a , //_groupInd
                        self.opt,
                        self.ctx
                    );
                    
                    group.draw({
                        data   : self.data[a],
                    })
                    self.sprite.addChild(group.sprite);
                    self.groups.push(group);
                    
                }
                
                self.induce = new Rect({
                    id    : "induce",
                    context:{
                        y           : -self.h,
                        width       : self.w,
                        height      : self.h,
                        fillStyle   : '#000000',
                        globalAlpha : 0,
                        cursor      : self.event.enabled ? 'pointer' : ''
                    }
                })
                self.sprite.addChild(self.induce)
    
                self.induce.on("hold mouseover", function(e){
                    e.tipsInfo = self._getInfoHandler(e);
                    self._fireHandler(e)
                })
                self.induce.on("drag mousemove", function(e){
                    e.tipsInfo = self._getInfoHandler(e);
                    self._fireHandler(e)
                })
                self.induce.on("release mouseout", function(e){
                    e.tipsInfo = self._getInfoHandler(e);
                    self._fireHandler(e)
                    var o = {
                        iGroup : self.iGroup,
                        iNode  : self.iNode
                    }
                    e.tipsInfo = o;
                    self.iGroup = 0, self.iNode = -1
                })
                self.induce.on("click", function(e){
                    e.tipsInfo = self._getInfoHandler(e);
                    self._fireHandler(e)
                })
            },
            _getInfoHandler:function(e){
                var x = e.point.x, y = e.point.y - this.h;
                var tmpINode = this.disX == 0 ? 0 : parseInt( (x + (this.disX / 2) ) / this.disX  );
                
                var tmpIGroup = Tools.getDisMinATArr(y, _.pluck(this._nodesInfoList , "y" ));
                this._nodesInfoList = [];                 //节点信息集合
                
                for (var a = 0, al = this.groups.length; a < al; a++ ) {
                    var o = this.groups[a].getNodeInfoAt(tmpINode)
                    this._nodesInfoList.push(o);
                }
                this.iGroup = tmpIGroup, this.iNode = tmpINode
                var node = {
                    iGroup        : this.iGroup,
                    iNode         : this.iNode,
                    nodesInfoList : _.clone(this._nodesInfoList)
                }
                return node;
            },
            _fireHandler:function(e){
                var self = this
                var o = {
                    eventType : e.type,
                    iGroup    : e.tipsInfo.iGroup + 1,
                    iNode     : e.tipsInfo.iNode + 1
                }
                self.root.event.on(o)
            }
        };
    
        return Graphs;
    
    } 
)
