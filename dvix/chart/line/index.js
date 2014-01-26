KISSY.add("dvix/chart/line/" , function( S , Dvix , Tools , xAxis , yAxis, Back){
    /*
     *@node chart在dom里的目标容器节点。
    */
    var Canvax = Dvix.Canvax;
    window.Canvax = Canvax
    var Line = function( node ){
        this.title         =  "line";
        this.type          =  null;
        this.oneStrSize    =  null;
        this.element       =  null;//chart 在页面里面的容器节点，也就是要把这个chart放在哪个节点里
        this.canvax        =  null;
        this.width         =  0;
        this.height        =  0;
        this.data          =  null;
        this.dataRange     =  { //在上面的data池里面，当前可视尺寸内能现实的data范围，为以后的添加左右拖放放大缩小等扩展功能做准备
             start     :  0,
             to        :  0
        };
        this.fieldList     =  { //从上面的data获取得到的第一条数据的field字段列表
            title      :   "",
            index      :   0
        };
        this.barWidth      =  1;
        this.spaceWidth    =  5; //默认为5，实际上会在_calculateDataRange中计算出来
        this.spaceWidthMin =  1;
        this.xAxis         =  null;
        this.yAxis         =  null;
        this.back          =  null;
        this.graphs =  {
            barColor   : ["#458AE6" , "#39BCC0" , "#5BCB8A"],
            lineColor  : "#D6D6D6",
            sprite     : null
        };

        this.customPL  = function(arr){
            return arr;
        }

	   	this.init.apply(this , arguments);
    };

    Line.prototype = {

        _yBlock    : 0, //y轴方向，分段取整后的值
        _yOverDiff : 0, //y轴方向把分段取整后多余的像素

        init : function( node ){
          var self = this;

          self.element = node;
          self.width   = parseInt(node.width());
          self.height  = parseInt(node.height());
          
          self.canvax = new Canvax({
              el : self.element
          })

          self.stage = new Canvax.Display.Stage({
              id      : 'core',
              context : {
                  x : 0.5,
                  y : 0.5
              }
          });
          self.stageBG = new Canvax.Display.Stage({
              id      : 'bg',
              context : {
                  x : 0.5,
                  y : 0.5
              }
          });

          //先探测出来单个英文字符和单个的中文字符所占的高宽
          self.oneStrSize = Tools.probOneStrSize();
        },
        draw : function(data , options){
          var self = this;

          //初始化数据和配置
          self._config(data , options);
          
          //从chart属性的data 里面获取yAxis xAxis的源data
          self._initData();

          // //所有数据准备好后，终于开始绘图啦
          self._startDraw();

          // //绘制结束，添加到舞台
          self._drawEnd();
        },
        _config  : function( data , options){
          var self  = this;
          self.data = data;

          for ( var i=0,l=data[0].length; i<l ; i++ ){
              self.fieldList[ data[0][i] ] = {
                 index : self._getIndexForField( data[0][i] , data[0] )
              };
          }

          self.xAxis = new xAxis(options.xAxis);

          self.yAxis = new yAxis(options.yAxis);

          self.back = new Back(options.back);

          if(options){
              // S.mix(self , options , undefined , undefined , true);
          }
        },
        _getIndexForField:function( field , arr ){
          for( var i=0,l=arr.length ; i<l;i++){
             if ( field === arr[i] ){
                return i;
             }
          }
        },
        _initData:function(){
          var self = this;
        },
 
        _startDraw : function(){
          var self = this;
          // self._graphsDraw();
          var x
          var y = this.height - self.xAxis.h

          self.yAxis.draw();
          self.yAxis.setY(y)

          x = self.yAxis.w

          self.xAxis.draw({w:self.width - self.yAxis.w});
          self.xAxis.setX(x), self.xAxis.setY(y)

          self.back.draw({
              w    : self.width - self.yAxis.w,
              h    : y - 10,
              xAxis:{
                  // w   : 400,
                  data:[{y:0},{y:-100},{y:-200},{y:-300},{y:-400},{y:-500},{y:-600},{y:-700}]
              },
              yAxis:{
                  h : 300,
                  data:[{x:100},{x:200},{x:300},{x:400},{x:500},{x:600},{x:700}],
              }
          });
          self.back.setX(x), self.back.setY(y)
          // self.xAxis.xAxisDraw();
        },
        _drawEnd : function(){
          var self = this;
         
          self.stageBG.addChild(self.back.sprite)

          self.stage.addChild(self.yAxis.sprite);
          self.stage.addChild(self.xAxis.sprite);
          // self.stage.addChild( self.xAxis.sprite );
          // self.stage.addChild( self.graphs.sprite );
          self.canvax.addChild( self.stageBG );
          self.canvax.addChild( self.stage );
        },
        _graphsLayout : function(){
          var self   = this;
          var yContext = self.yAxis.sprite.context;
          self.graphs.sprite = new Canvax.Display.Sprite({
             context : {
               x     : yContext.width,
               y     : yContext.y,
               width : self.width - yContext.width,
               height: yContext.height
             }
          });
        },
        _calculateDataRange : function(){
          //计算当前可视范围内能显示的data的范围，和spaceWidth barWidth
          var self     = this;
          var gSpriteC = self.graphs.sprite.context;
          var dl       = self.data.length-1;//因为第一行是field，所以要 -1

          //数据需要截断的情况
          self.dataRange.start = 1;
          if ( (self.barWidth + self.spaceWidthMin) * dl > gSpriteC.width ){
             self.dataRange.to = parseInt( gSpriteC.width / (self.barWidth + self.spaceWidthMin));
          } else {
             self.dataRange.to = dl;
          }

          //@gwidth 单个分组的bar+space的宽度 ，，，，，  重新计算barWidth spaceWidth
          var gwidth = (gSpriteC.width - self.barWidth) / (self.dataRange.to - self.dataRange.start);
          self.spaceWidth = gwidth - self.barWidth;

          //真正绘制之前 还要计算y轴的相关数据
          self._yBlock    = parseInt( gSpriteC.height / (self.yAxis.data.length - 1));
          //v方向均分后还多余的部分px
          self._yOverDiff =  gSpriteC.height - self._yBlock *( self.yAxis.data.length - 1 );

        },
        _graphsDraw : function(){
          //开始真正绘图
          //先画背景框
          var self          = this;
          var data          = self.data;
          var yAxis         = self.yAxis;
          var xAxis         = self.xAxis;
          var graphs        = self.graphs;
          var gSpriteC    = graphs.sprite.context;
          

          //画背景虚线
          for ( var i=0,l=yAxis.data.length-1 ; i<l ; i++ ){
             var linex = - self.oneStrSize.en.width + 2;
             var liney = Math.round( i * self._yBlock ) + self._yOverDiff; 
             graphs.sprite.addChild(new Canvax.Shapes.Line({
                 context : {
                     xStart      : linex,
                     yStart      : liney,
                     xEnd        : linex + gSpriteC.width + self.oneStrSize.en.width - 2,
                     yEnd        : liney,
                     lineType    : "dashed",
                     lineWidth   : 1,
                     strokeStyle : graphs.lineColor
                 }
             }));
          };

          //画左边线
          graphs.sprite.addChild(new Canvax.Shapes.Line({
              id : "line-left",
              context : {
                  xStart      : 0,
                  yStart      : -gSpriteC.y,
                  xEnd        : 0,
                  yEnd        : gSpriteC.height,
                  lineWidth   : 1,
                  strokeStyle : graphs.lineColor
              }
          }));

          //画下边线
          graphs.sprite.addChild(new Canvax.Shapes.Line({
              id : "line-bottom",
              context : {
                  xStart      : 0,
                  yStart      : gSpriteC.height,
                  xEnd        : self.width - gSpriteC.x,
                  yEnd        : gSpriteC.height,
                  lineWidth   : 1,
                  strokeStyle : graphs.lineColor
              }
          }));

          var dataRange = self.dataRange;
          var maxY      = 0;//yAxis方向最大值
          var minY      = 0;//yAxis方向最小

          S.each( yAxis.data , function(item ,i){
            maxY = Math.max(maxY,item);
            minY = Math.min(minY,item);
          } );

          //一条数据分组占据的width
          var groupWidth = self.barWidth + self.spaceWidth;

          S.each( yAxis.fields , function(field , fi){
              var pointList = [];

              for (var d = dataRange.start ; d<=dataRange.to ; d++){
                  var groupI = d - dataRange.start; 
                  var x = Math.round( groupI * ( groupWidth ) );

                  var itemHeight = gSpriteC.height - Math.round((gSpriteC.height - self._yOverDiff) * ( data[d][ self.fieldList[field].index ] / (maxY-minY) ));
                  pointList.push( [x , itemHeight] );
              };

              //这个时候的数据要给xAxis保留一份
              self.xAxis.getxAxisPoints( pointList , groupWidth );

              //设置原点
              var gs_origin = (yAxis.data.length - 1 - S.indexOf( 0 , yAxis.data )) * self._yBlock -  graphs.sprite.context.height;
              graphs.sprite.addChild( new Canvax.Shapes.BrokenLine({
                  context : {
                      pointList   : self.customPL( pointList ),
                      strokeStyle : 'red',
                      lineWidth   : 1,
                      x           : 0,
                      y           : gs_origin
                  }
              }) );

          });
        }
    };
    return Line;
} , {
    requires: [
        'dvix/',
        'dvix/utils/tools',
        'dvix/components/xaxis/xAxis',
        'dvix/components/yaxis/yAxis',
        'dvix/components/back/Back',
    ]
});
