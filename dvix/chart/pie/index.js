KISSY.add(function (S, Chart, Pie, Graphs, PieTip) {
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

      this._startDraw(opt);                         //开始绘图

      this._drawEnd();                           //绘制结束，添加到舞台
      
      if (this._eventMap['complete'] && this._eventMap['complete'].length > 0) {
        for (var i = 0; i < this._eventMap['complete'].length; i++) {
          this._eventMap['complete'][i].call(this);
        }
      }

      this._arguments = arguments;

    },
    getList: function () {
      var self = this;
      var list = [];
      var item;
      if (self._pie) {
        var sectorList = self._pie.getList();
        if (sectorList.length > 0) {
          for (var i = 0; i < sectorList.length; i++) {
            item = sectorList[i];
            list.push({
              name: item.sector.__data.name,
              index: item.sector.__dataIndex,
              color: item.color,
              r: item.r,
              percentage: item.sector.__data.percentage
            });
          }
        }
      }
      return list;
    },
    show: function (index) {
      this._pie && this._pie.showHideSector(index);
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
      var r0 = parseInt(opt.innerRadius || 0);
      var maxInnerRadius = r * 2 / 3;
      r0 = r0 >= 0 ? r0 : 0;
      r0 = r0 <= maxInnerRadius ? r0 : maxInnerRadius;
      var pieX = w / 2;
      var pieY = h / 2;
      opt = opt || {};
      opt.pie = {
        x: pieX,
        y: pieY,
        r0: r0,
        r: r,
        boundWidth: w,
        boundHeight: h
      };
      if (opt.tip.enabled) {
        self._tip = new PieTip(opt);
        opt.tipCallback = {
          position: function (point) {
            if (self._tip) {
              self._tip.sprite.context.visible = true;
              self._tip.sprite.context.x = point.x + 5;
              self._tip.sprite.context.y = point.y - 5;
            }
          },
          isshow: function (show) {
            self._tip.sprite.context.visible = show;
          },
          update: function (opt) {
            self._tip._reset(opt);
          }
        }
      }
      self._pie = new Pie(opt, this.dataFrame);
    },
    _startDraw: function (opt) {
      this._pie.draw(opt);
    },
    _drawEnd: function () {
      this.core.addChild(this._pie.sprite);
      if (this._tip) this.stageTip.addChild(this._tip.sprite);
    }
  });

}, {
  requires: [
        'dvix/chart/',
        'dvix/components/pie/Pie',
        'dvix/components/line/Graphs',
        'dvix/components/pie/PieTip'
    ]
});
