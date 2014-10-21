KISSY.add(function (S, Chart, Tools, DataSection, EventType, Pie, Graphs, PieTip) {
  /*
  *@node chart在dom里的目标容器节点。
  */
  var Canvax = Chart.Canvax;

  return Chart.extend({
    init: function (node) {
      this.config = {
        mode: 1,
        event: {
          enabled: 1
        }
      }

      this.stageBg = new Canvax.Display.Sprite({
        id: 'bg'
      });
      this.core = new Canvax.Display.Sprite({
        id: 'core'
      });
      this.stageTip = new Canvax.Display.Stage({
        id: 'stageTip'
      });
      this.canvax.addChild(this.stageTip);
      this.stageTip.toFront();
      //this.stage.addChild(this.stageBg);
      this.stage.addChild(this.core);
    },
    draw: function (data, opt) {
      //根据data 和 opt中yAxis xAxis的field字段来分配this.dataFrame中的yAxis数据和xAxis数据      
      this.dataFrame = this._initData(data, opt);

      this._initModule(opt);                      //初始化模块  

      this._startDraw();                         //开始绘图

      this._drawEnd();                           //绘制结束，添加到舞台

      this._arguments = arguments;

    },
    _initData: function (data, opt) {
      var dataFrame = {};
      dataFrame.org = data;
      dataFrame.data = [];

      if (S.isArray(data)) {
        for (var i = 0; i < data.length; i++) {
          var obj = {};
          if (S.isArray(data[i])) {
            obj.name = data[i][0];
            obj.y = parseFloat(data[i][1]);
            obj.sliced = false;
            obj.selected = false;
          }
          else if (typeof data[i] == 'object') {
            obj.name = data[i].name;
            obj.y = parseFloat(data[i].y);
            obj.sliced = data[i].sliced || false;
            obj.selected = data[i].selected || false;
          }

          if (obj.name) dataFrame.data.push(obj);
        }
      }
      return dataFrame;
    },
    clear: function () {
      this.stageBg.removeAllChildren()
      this.core.removeAllChildren()
      this.stageTip.removeAllChildren();
    },
    reset: function (data, opt) {
      this.clear()
      this.width = parseInt(this.element.width());
      this.height = parseInt(this.element.height());
      this.draw(data, opt)
    },
    _initModule: function (opt) {
      var self = this;
      var w = self.width;
      var h = self.height;
      var r = Math.min(w, h) * 2 / 3 / 2;
      var pieX = w / 2;
      var pieY = h / 2;
      opt = opt || {};
      opt.pie = {
        x: pieX,
        y: pieY,
        r: r,
        tipCallback: {
          position: function (point) {
            if (self._tip) {
              self._tip.sprite.context.visible = true;
              self._tip.sprite.context.x = point.x + 5;
              self._tip.sprite.context.y = point.y - 5;
            }
          },
          isshow: function (show) {
            console.log(show);
            self._tip.sprite.context.visible = show;
          },
          update: function (opt) {
            self._tip._reset(opt);
          }
        }
      };
      this._pie = new Pie(opt, this.dataFrame);
      this._tip = new PieTip(opt);
    },
    _startDraw: function () {
      debugger
      this._pie.draw();
      this._pie.grow();
      this._tip.draw();
    },

    _drawEnd: function () {
      this.core.addChild(this._pie.sprite);
      this.stageTip.addChild(this._tip.sprite);
    }
  });

}, {
  requires: [
        'dvix/chart/',
        'dvix/utils/tools',
        'dvix/utils/datasection',
        'dvix/event/eventtype',
        'dvix/components/pie/Pie',
        'dvix/components/line/Graphs',
        'dvix/components/tips/PieTip'
    ]
});
