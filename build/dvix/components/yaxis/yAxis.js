KISSY.add("dvix/components/yaxis/yAxis" , function( S , Dvix , Tools ){
    var Canvax = Dvix.Canvax;
    var yAxis = function(opt){
        this.w = 0;

        this.dis        = opt.dis       || 6;         //线到文本的距离

        this.line = {
                 enabled : 1,                         //是否有line
                 width   : 6,
                 height  : 3,
                 strokeStyle   : '#BEBEBE'
        }

        this.data       = [];      //{y:-100, content:'1000'}
        this.sprite     = null;
        this.txtSp      = null;
        this.lineSp     = null;

        this.init(opt)
    };

    yAxis.prototype = {
        init:function(){
          var self  = this;

          self.sprite = new Canvax.Display.Sprite();
          
        },
        setX:function($n){
          this.sprite.context.x = $n
        },
        setY:function($n){
          this.sprite.context.y = $n
        },
        draw : function(){
          var self  = this;
          this.data = [{y:0,content:'00000'},{y:-100,content:'10000'},{y:-200,content:'20000'},{y:-300,content:'30000'}]
          
          self._widget()
        },

        _widget:function(){
          var self  = this;
          var arr = this.data

          self.txtSp  = new Canvax.Display.Sprite(),  self.sprite.addChild(self.txtSp)
          self.lineSp = new Canvax.Display.Sprite(),  self.sprite.addChild(self.lineSp)

          var maxW = 0;
          for(var a = 0, al = arr.length; a < al; a++){
              var o = arr[a]
              var x = 0, y = o.y
              var content = Tools.numAddSymbol(o.content)
              //文字
              var txt = new Canvax.Display.Text(content,
                   {
                    context : {
                        x  : x,
                        y  : y,
                        fillStyle   :"blank",
                        // textBackgroundColor:'#0000ff',
                        textAlign   :"right",
                        textBaseline:"middle"
                   }
              })
              self.txtSp.addChild(txt);
              maxW = Math.max(maxW, txt.getTextWidth());

              //线条
              var line = new Canvax.Shapes.Line({
                  id      : a,
                  context : {
                      x           : 0,
                      y           : y,
                      xEnd        : self.line.width,
                      yEnd        : 0,
                      lineWidth   : self.line.height,
                      strokeStyle : self.line.strokeStyle
                  }
              })
              self.lineSp.addChild(line)
          }
          self.txtSp.context.x  = maxW;
          self.lineSp.context.x = maxW + self.dis

          if(self.line.enabled){
            self.w = maxW + self.dis + self.line.width
          }else{
            self.lineSp.context.visible = false
            self.w = maxW 
          }
        }
    };

    return yAxis;

} , {
    requires : [
       "dvix/",
       "dvix/utils/tools",
    ] 
})
