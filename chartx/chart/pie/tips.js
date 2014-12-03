define('chartx/chart/pie/tips',
  [
      "canvax/index",
      "canvax/shape/Line",
      "canvax/shape/Circle",
      "chartx/components/tips/tip",
      "chartx/utils/deep-extend"
  ],
  function (Canvax, Line, Circle, Tip) {
    var Tips = function (opt, data, tipDomContainer) {
      this.sprite = null;
      this._tip = null;
      this.init(opt, data, tipDomContainer);
    };

    Tips.prototype = {
      init: function (opt, data, tipDomContainer) {
        _.deepExtend(this, opt);
        this.sprite = new Canvax.Display.Sprite({
          id: "tips"
        });
        this._tip = new Tip(opt, tipDomContainer);
      },
      show: function (e) {
        var tipsPoint = this._getTipsPoint(e);
        this.sprite.addChild(this._tip.sprite);
        this._tip.show(e);
      },
      move: function (e) {
        this._resetPosition(e);
        this._tip.move(e);
      },
      hide: function (e) {
        this.sprite.removeAllChildren();
        this._tip.hide(e);
      },
      _getTipsPoint: function (e) {
        return e.target.localToGlobal(e.info.nodesInfoList[e.info.iGroup]);
      },
      _resetPosition: function (e) {
        var tipsPoint = this._getTipsPoint(e);
      }
    }
    return Tips
  });
