define(
    "chartx/components/line/Graphs" ,
    [
        "canvax/index",
        "canvax/shape/Rect",
        "chartx/utils/tools",
        "canvax/animation/Tween",
        "chartx/components/line/Group",
        "chartx/utils/deep-extend"
    ],
    function( Canvax , Rect, Tools, Tween , Group ){
        var Graphs = function(opt){
            this.w       = 0;   
            this.h       = 0; 
            this.y       = 0;

            this.style   = {
                    normals : ['#458AE6', '#39BCC0', '#5BCB8A', '#94CC5C', '#C3CC5C', '#E6B522', '#E68422'],
                    overs   : ['#135EBF', '#2E9599', '#36B26A', '#78A64B', '#9CA632', '#BF9E39', '#BF7C39']
            }
    
            this.line   = {
                node        :{
                    enabled     : 1,
                    mode        : 0,
                    r           : {
                        normals : [2,2,2,2,2,2,2],
                        overs   : [3,3,3,3,3,3,3]
                    },
                    fillStyle   :{
                        normals : ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'],
                        overs   : this.style.overs
                    },
                    strokeStyle :{
                        normals : this.style.normals,
                        overs   : ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF']
                    },
                    lineWidth   : {
                        normals : [2,2,2,2,2,2,2],
                        overs   : [2,2,2,2,2,2,2]
                    }
                },
                strokeStyle: {
                    normals     : this.style.normals,
                    overs       : this.style.overs
                },
                alpha      : {
                    normals     : [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
                    overs       : [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
                },
                smooth : true
            }
    
            this.data       = [];                          //二维 [[{x:0,y:-100,...},{}],[]]
            this.disX       = 0;                           //点与点之间的间距
            this.groups     = [];                          //群组集合     
    
            this.iGroup     = 0;                           //群组索引(哪条线)
            this.iNode      = -1;                          //节点索引(那个点)
    
            this._nodesInfoList = [];                      //多条线同个节点索引上的节点信息集合
    
            this.sprite     = null;  
            this.induce     = null;                      
    
            this.init(opt)
        };
    
        Graphs.prototype = {
    
            init:function(opt){
                _.deepExtend( this , opt );
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
                var self  = this;
                _.deepExtend( this , opt );
                self._widget()
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
            },
            //styleType , normals , groupInd
            _getColor : function( opt ){
                var color = null;
                if( _.isArray( opt.styleType ) ){
                    color = opt.styleType[ groupInd ]
                }
                if( _.isFunction( opt.styleType ) ){
                    color = opt.styleType( groupInd );
                }
                if( !color || color=="" ){
                    color = opt.normals[ groupInd ];
                }
                return color;
            },

            _widget:function(){
                var self  = this;
                
                for(var a = 0,al = self.data.length; a < al; a++){
                    
                    var group = new Group({
                        _groupInd : a,
                        node   :{
                            enabled     : self.line.node.enabled,
                            mode        : self.line.node.mode,
                            r           : {
                                normal  : self.line.node.r.normals[a],
                                over    : self.line.node.r.overs[a]
                            },
                            fillStyle   : {
                                normal  : self.line.node.fillStyle.normals[a],
                                over    : self.line.node.fillStyle.overs[a],
                            },
                            strokeStyle : {
                                normal  : self.line.node.strokeStyle.normals[a],
                                over    : self.line.node.strokeStyle.overs[a],
                            },
                            lineWidth   :{
                                normal  : self.line.node.lineWidth.normals[a],
                                over    : self.line.node.lineWidth.overs[a]
                            }
                        },
                        line   :{
                            strokeStyle : {
                                normal  : self.line.strokeStyle.normals[a],
                                over    : self.line.strokeStyle.overs[a]
                            },
                            smooth      : self.line.smooth
                        },
                        fill   :{
                            strokeStyle : {
                                normal  : self.line.strokeStyle.normals[a],
                                over    : self.line.strokeStyle.overs[a]
                            },
                            alpha       : self.line.alpha.normals[a]
                        }
                    });
                    
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
                        globalAlpha : 0
                    }
                })
                self.sprite.addChild(self.induce)
    
                self.induce.on("hold mouseover", function(e){
                    e.tipsInfo = self._getInfoHandler(e);
                })
                self.induce.on("drag mousemove", function(e){
                    e.tipsInfo = self._getInfoHandler(e);
                })
                self.induce.on("release mouseout", function(e){
                    var o = {
                        iGroup : self.iGroup,
                        iNode  : self.iNode
                    }
                    e.tipsInfo = o;
                    self.iGroup = 0, self.iNode = -1
                })
            },
            _getInfoHandler:function(e){
                var x = e.point.x, y = e.point.y - this.h;
                var tmpINode = this.disX == 0 ? 0 : parseInt( (x + (this.disX / 2) ) / this.disX  );
                
                var tmpIGroup = Tools.getDisMinATArr(y, _.pluck(this._nodesInfoList , "y" ));
                this._nodesInfoList = []                 //节点信息集合
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
            }
        };
    
        return Graphs;
    
    } 
)
