KISSY.add("dvix/components/yaxis/yAxis" , function( S , Dvix , Datasection , Tools ){
    var Canvax = Dvix.Canvax;
    var yAxis = function( chart , opt ){
        this.chart      = chart;//必选择，属于那个图表。很多数据的从这个上面去去
        this.dataMode   = opt.dataMode  || 0;//1为换算成百分比
        this.fields     = opt.fields    || [];
        this.TextStyle  = opt.TextStyle || null;

        this.dataOrg    = [];//从brokenline.data 得到的yAxisd的源数据
        this.data       = [];
        this.sprite     = null;
    };

    yAxis.prototype = {
        getyAxisData : function(){
          //获取yAxis的数据
          var self      = this;
          var data      = self.chart.data;

          if (self.fields.length == 0){
             //如果用户没有配置fields，那么就默认除开以外的所有字段都要显示
             for (var i = 0 , l = data[0].length ; i<l ; i++){
                 if ( data[0][i] !== self.chart.xAxis.field ){
                    self.fields.push( data[0][i] );
                 }
             }
          }

          S.each( self.fields , function(field , ind){
               var arr=[];
               S.each(data , function(item , i){
                   if(i==0){
                       return;
                   }
                   arr.push( item[ self.chart.fieldList[field].index ] );
               });
               self.dataOrg.push(arr); 
          });

          if ( self.dataMode==1){
              //需要转换为百分比
              S.each( self.dataOrg , function(data ,i){
                 self.dataOrg[i] = Tools.getArrScales(data);
              } );
          }
          
        },
        yAxisLayout : function(){
          var self  = this;

          //用self.dataOrg的原始数据得到计算出实际在self 上 要显示的数据
          self.data = Datasection.section( Tools.getChildsArr( self.dataOrg ) , 5 );

          //计算data里面字符串最宽的值
          var max=0;
          S.each( self.data , function(data , i){
            max = Math.max( max , data.toString().length );
          });

          self.sprite = new Canvax.Display.Sprite({
             context : {
               x     : 0,
               y     : self.chart.yMarginTop,
               width : (max + 1) * self.chart.oneStrSize.en.width,
               //height = 总高减去 top 预留 部分 减去x的高，x的高固定为 英文字符的高*2
               height: self.chart.height - self.chart.yMarginTop - Math.round( self.chart.oneStrSize.en.height*2 )
             }
          });

        },
        yAxisDraw : function(){
          var self     = this;
          var ySpriteC = self.sprite.context;
          S.each(self.data , function( item , i ){
             var x = ySpriteC.width;
             var y = ySpriteC.height - i*self.chart._yBlock;
             self.sprite.addChild(new Canvax.Display.Text(
                item , {
                  context : {
                      x  : x - self.chart.oneStrSize.en.width,
                      y  : y,
                      fillStyle:"blank",
                      textAlign:"right",
                      textBaseline:"middle"
                  }
                })
             );
          })
        }
    };

    return yAxis;

} , {
    requires : [
       "dvix/",
       "dvix/utils/datasection",
       "dvix/utils/tools",

    ] 
})
