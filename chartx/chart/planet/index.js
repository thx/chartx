define(
    "chartx/chart/planet/index",
    [
        'chartx/chart/index',
        'chartx/utils/tools',
        'chartx/utils/datasection',
        'chartx/components/planet/Graphs',
        './tips',
        'chartx/utils/deep-extend',
    ],
    function(Chart, Tools, DataSection, Graphs, Tips, InfoCircle){
        /*
         *@node chart在dom里的目标容器节点。
        */
        var Canvax = Chart.Canvax;
    
        return Chart.extend( {
    
            init:function(node, data, opts){
                this.event         = {
                    enabled : 1
                }

                this.cx            = '';                    //圆心
                this.cy            = ''        
    
                this._back         =  null;
                this._graphs       =  null;
                this._tips         =  null;
    
                this.stageTip = new Canvax.Display.Sprite({
                    id      : 'tip'
                });
                this.stageCore     = new Canvax.Display.Sprite({
                    id      : 'core'
                });
                this.stageBg  = new Canvax.Display.Sprite({
                    id      : 'bg'
                });
    
                this.stage.addChild(this.stageBg);
                this.stage.addChild(this.stageCore);
                this.stage.addChild(this.stageTip);

                _.deepExtend(this, opts);
                // this.dataFrame = this._initData(data, this);
                this.dataFrame = this._initData(data, opts);
                console.log(this.dataFrame)

            },
            draw:function(){
                if( this.rotate ) {
                    this._rotate( this.rotate );
                }
                this._initModule();                        //初始化模块  
    
                this._startDraw();                         //开始绘图
    
                this._drawEnd();                           //绘制结束，添加到舞台
              
                this._arguments = arguments;
    
            },
            _initModule:function(){
                this._back   = new Graphs(this.back);
                this._graphs = new Graphs(this.graphs);
                // this._tips   = new Tips(this.tips , this.dataFrame , this.canvax.getDomContainer());
            },
            // _initData:function(data , opt){
            //     console.log(data)
            //     console.log(opt)
            // },
            _startDraw : function(){
                var self  = this;

                self.cx = self.cx != '' ? self.cx : 60, self.cy = self.cy != '' ? self.cy : parseInt(self.height / 2)

                var data = [ 
                    [ 
                        {x:self.cx, y:self.cy, r:{normal:800}, fillStyle:{normal:''}, lineWidth:{normal:2}, strokeStyle:{normal:'#ccbfdf'}},
                    ],
                    [
                        {x:self.cx, y:self.cy, r:{normal:600}, fillStyle:{normal:''}, lineWidth:{normal:2}, strokeStyle:{normal:'#ccbfdf'}},
                    ],
                    [
                        {x:self.cx, y:self.cy, r:{normal:400}, fillStyle:{normal:''}, lineWidth:{normal:2}, strokeStyle:{normal:'#ccbfdf'}},
                    ],
                    [ 
                        {x:self.cx, y:self.cy, r:{normal:150}, fillStyle:{normal:''}, lineWidth:{normal:2}, strokeStyle:{normal:'#ccbfdf'}},
                    ],
                ]
                this._graphs.draw({
                    w    : this.width,
                    h    : this.height,
                    data : data
                }) 


                var data = [ 
                    [ 
                        {x:self.cx, y:self.cy, r:{normal:50}, fillStyle:{normal:'#9a5fe2'}, text:{content:'品牌', fillStyle:{normal:'#ffffff'}, fontSize:{normal:16}}},
                      
                    ],
                    [ 
                        {x:189, y:145, r:{normal:50}, fillStyle:{normal:'#9a5fe2'}, text:{content:'测试1_1'}},
                        {x:170, y:300, r:{normal:30}, fillStyle:{normal:'#9a5fe2'}, text:{content:'测试1_2'}},
                      
                    ],
                    [
                        {x:307, y:123, r:{normal:60}, fillStyle:{normal:'#a275e9'}, text:{content:'测试2_1'}},
                    ],
                    [
                        {x:417, y:370, r:{normal:25}, fillStyle:{normal:'#b498e5'}, text:{content:'测试3_1'}},
                    ],
                ]


                this._graphs.draw({
                    w    : this.width,
                    h    : this.height,
                    data : data
                })
            },
    
            _drawEnd:function(){
                this.stageBg.addChild(this._back.sprite)
                this.stageCore.addChild(this._graphs.sprite);
                // this.stageTip.addChild(this._tips.sprite);
            }
        });
    
    } 
);
