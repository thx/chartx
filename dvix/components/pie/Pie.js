KISSY.add("dvix/components/pie/Pie", function (S, Canvax, Sector, Line, Tools) {
  var Pie = function (opt, data) {
    this.data = data;
    this.sprite = null;
    this.init(opt);
    this.defaultColors = ['#95CEFF', '#434348', '#90ED7D', '#F7A35C', '#8085E9', '#F15C80', '#E4D354', '#8085E8', '#8D4653', '#91E8E1'];
    this.colorIndex = 0;
  };

  Pie.prototype = {
    init: function (opt) {
      debugger
      _.deepExtend(this, opt);
      this.sprite = new Canvax.Display.Sprite();
      this._configData();
      this._configColors();
    },
    setX: function ($n) {
      this.sprite.context.x = $n
    },
    setY: function ($n) {
      this.sprite.context.y = $n
    },
    _configColors: function (opt) {

    },
    draw: function (opt) {
      this.setX(this.pie.x);
      this.setY(this.pie.y);
      this._widget();
    },
    //配置数据
    _configData: function () {
      var self = this;
      self.total = 0;
      self.currentAngle = 0;
      var data = self.data.data;

      if (data.length && data.length > 0) {
        if (data.length == 1) {
          S.mix(data[0], {
            start: 0,
            end: 360,
            percentage: 100,
            txt: 100 + '%'
          })
        }
        else {
          for (var i = 0; i < data.length; i++) {
            self.total += data[i].y;
          }
          if (self.total > 0) {
            for (var j = 0; j < data.length; j++) {
              var percentage = data[j].y / self.total;
              var angle = 360 * percentage;
              S.mix(data[j], {
                start: self.currentAngle,
                end: self.currentAngle + angle,
                percentage: (percentage * 100).toFixed(1),
                txt: (percentage * 100).toFixed(1) + '%'
              })
              self.currentAngle += angle
            }
          }
        }
      }
    },

    _widget: function () {
      var self = this;
      var data = self.data.data;
      if (data.length > 0 && self.total > 0) {
        for (var i = 0; i < data.length; i++) {
          var colors = self.colors ? self.colors : self.defaultColors;
          if (self.colorIndex >= colors.length) self.colorIndex = 0;
          var sector = new Sector({
            context: {
              r0: 1,
              r: self.pie.r,
              startAngle: data[i].start,
              endAngle: data[i].end,
              fillStyle: colors[self.colorIndex]
              //clockwise: true
            }
          });
          sector.hover(function () {
            this.context.fillStyle = 'red';
          }, function () {
            this.context.fillStyle = 'green';
          })
          self.colorIndex++;
          self.sprite.addChild(sector);
        }
      }

    }
  };

  return Pie;

}, {
  requires: [
        "canvax/",
        "canvax/shape/Sector",
        "canvax/shape/Line",
        "dvix/utils/tools",
        "dvix/utils/deep-extend"
    ]
})
