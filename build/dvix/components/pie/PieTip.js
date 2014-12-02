define(
  "dvix/components/pie/PieTip",
  [
      "canvax/index",
      "canvax/shape/Circle",
      "canvax/shape/Rect",
      "dvix/utils/tools"
  ],
  function (Canvax, Circle, Rect, Tools) {
    var PieTip = function (opt) {
      this.w = 100;
      this.h = 50;
      this.data = [[1, 2]];


      this.text = {
        disX: 4,
        disY: 4
      }

      this.back = {
        enabled: 1,
        disX: 8,
        disY: 8,
        strokeStyle: '#333333',
        thinkness: 1.5,
        fillStyle: '#FFFFFF',
        radius: [4, 4, 4, 4]
      }

      this.sprite = null;
      this.widgetSp = null;
      this.txtSp = null;
      this.backSp = null;

      this.init(opt)
    };

    PieTip.prototype = {
      init: function (opt) {
        var self = this;
        self._initConfig(opt);
        self.sprite = new Canvax.Display.Sprite();
        self.backSp = new Canvax.Display.Sprite();
        self.txtSp = new Canvax.Display.Sprite();
        self.sprite.context.visible = false;
        self.sprite.addChild(self.backSp);
        self.sprite.addChild(self.txtSp);
      },
      setX: function ($n) {
        this.sprite.context.x = $n
      },
      setY: function ($n) {
        this.sprite.context.y = $n
      },

      draw: function (config) {
        var self = this;
        self._widget()
      },

      //初始化配置
      _initConfig: function (opt) {
        var self = this;
        self.title = opt.name ? opt.name : 'title';
        self.percentage = opt.txt ? opt.txt : '%0';
      },
      _reset: function (opt) {
        var self = this;
        self.backSp.removeAllChildren();
        self.txtSp.removeAllChildren();
        self._initConfig(opt.__data);
        self.draw();
      },
      _widget: function () {
        var self = this;
        self.backSp.addChild(new Rect({
          context: {
            width: self.w,
            height: self.h,
            strokeStyle: '#333333',
            lineWidth: 1.5,
            fillStyle: '#FFFFFF',
            radius: [4, 4, 4, 4],
            globalAlpha: 0.5
          }
        }));

        self.txtSp.addChild(new Canvax.Display.Text(self.title, {
          context: {
            x: 10,
            y: 5,
            fillStyle: '#000000',
            fontSize: 15,
            fontWeight: 'normal'
            //fontFamily: 'Arial'
          }
        }))

        self.txtSp.addChild(new Canvax.Display.Text(self.percentage, {
          context: {
            x: 10,
            y: 26,
            fillStyle: '#000000',
            fontSize: 10,
            fontWeight: 'normal'
            //fontFamily: 'Arial'
          }
        }))
      }
    };

    return PieTip;

  })
