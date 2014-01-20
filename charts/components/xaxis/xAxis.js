KISSY.add("charts/components/xaxis/xAxis" , function( S , Canvax ){
   var xAxis = function( chart , opt ){
       this.chart      = chart ;       //必选择，属于那个图表。很多数据的从这个上面去去
       this.field      = opt.field     || null;
       this.TextStyle  = opt.TextStyle || null;
       this.lineColor  = opt.lineColor || "#D6D6D6";
       this.customPL   = opt.customPL  || null;

       this.dataOrg    = [];//从brokenline.data获得的xAxis 的 源数据，下面的data的数据从这里计算而来
       this.data       = [];
       this.xPointList = [];
       this.sprite     = null;
   }; 

   xAxis.prototype = {
       /*
        *@data      chart的数据源
        *@fieldList 上面的data数据中的第一行字段集合
       */
       getxAxisData: function(){
          //获取xAxis的数据
          var self  = this;
          var data  = self.chart.data;
          if (!self.field){
             //如果用户没有配置field字段，那么就默认索引1为的数据类型字段
             self.field = data[0][0];
          };
          console.log(self.field)
          self.dataOrg.length = 0;
          for(var d=1,dl = data.length ; d<dl ; d++){
             self.dataOrg.push( data[d][ self.chart.fieldList[self.field].index] );
          }
          console.log(self.dataOrg)
       },
       xAxisLayout : function(){
          var self  = this;
          var yContext = self.chart.yAxis.sprite.context;
          var xHeight  = Math.round( self.chart.oneStrSize.en.height*2 );
          self.sprite = new Canvax.Display.Sprite({
             context : {
               x     : yContext.width,
               y     : self.chart.height - xHeight,
               width : self.chart.width  - yContext.width,
               height: xHeight
             }
          });
        },
        //x轴专属，计算x的xPointList
        getxAxisPoints : function( pointList , groupWidth ){
          var self = this;
    
          //如果有用户自定义的x轴数据
          if( self.customPL ){
              var c_list = self.customPL( pointList );
              var speed  = parseInt( (pointList.length - 1) / (c_list.length-1) );
              if( c_list.constructor == Array && c_list.length > 0 ){
                  //外面传入的数据只有text
                  S.each(c_list , function(p , i){
                      var newP = {
                          x   : pointList[ i * speed ][0],//i*speed*groupWidth - i,
                          text: p
                      }
                      self.xPointList.push( newP );
                  });
              }
          };

          //计算xAxis的xPointList
          if( self.xPointList.length == 0 ){
              S.each(pointList,function(p , i){
                  //TODO:这里目前只做简单的push，如果节点过多的话，还要多做一层处理
                  self.xPointList.push({
                      x    : p[0] ,
                      text : self.dataOrg[i]
                  });
              });
          };
        },
        xAxisDraw : function(){
          var self     = this;
          var xSpriteC = self.sprite.context;
          var pCount   = self.xPointList.length;
          S.each( self.xPointList , function( o , i ){
              var x = o.x ;
              //和折线一样，最后一个刻度做hack处理
              if(i == (pCount-1)) {
                  //x = xSpriteC.width
              }
              self.sprite.addChild(new Canvax.Shapes.Line({
                  context : {
                      xStart      : x,
                      yStart      : 0,
                      xEnd        : x,
                      yEnd        : 5,
                      lineWidth   : 1,
                      strokeStyle : self.lineColor
                  }
              }));

              var textOpt = {
                  x   : x,
                  y   : 5,
                  fillStyle:"blank",
                  //textBackgroundColor:"red"
                  //textBaseline:"middle"
              }
              if(i>0){
                  textOpt.textAlign="center";
                  if(i == (pCount-1)){
                      textOpt.textAlign="right";
                  }
              } 
              self.sprite.addChild(new Canvax.Display.Text(
                o.text.toString()
                ,
                {
                  context : textOpt
                })
              );
          })
        }
   };

   return xAxis;

} , {
   requires : [
       "canvax/"
   ]
})
