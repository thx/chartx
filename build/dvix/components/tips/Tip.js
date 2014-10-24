KISSY.add('dvix/components/tips/Tip', function (S, Canvax, Rect) {
    var Tip = function (opt, tipDomContainer) {
        this.tipDomContainer = tipDomContainer;
        this.cW = 0;    //容器的width
        //容器的width
        this.cH = 0;    //容器的height
        //容器的height
        this.dW = 0;    //html的tips内容width
        //html的tips内容width
        this.dH = 0;    //html的tips内容Height
        //html的tips内容Height
        this.sprite = null;
        this.context = null;    //tips的详细内容
        //tips的详细内容
        this._tipDom = null;
        this._back = null;    //所有调用tip的 event 上面 要附带有符合下面结构的info属性
                              //会deepExtend到this.indo上面来
        //所有调用tip的 event 上面 要附带有符合下面结构的info属性
        //会deepExtend到this.indo上面来
        this.info = {
            nodesInfoList: [],
            //符合iNode的所有Group上面的node的集合
            iGroup: 0,
            //数据组的索引对应二维数据map的x
            iNode: 0    //数据点的索引对应二维数据map的y
        };
        //数据点的索引对应二维数据map的y
        this.init(opt);
    };
    Tip.prototype = {
        init: function (opt) {
            _.deepExtend(this, opt);
            this.sprite = new Canvax.Display.Sprite({ id: 'Tip' });
        },
        show: function (e) {
            var stage = e.target.getStage();
            this.cW = stage.context.width;
            this.cH = stage.context.height;
            this._initContext(e);
            this._initBack(e);
            this.setPosition(e);
        },
        move: function (e) {
            this._setContext(e);
            this.setPosition(e);
        },
        hide: function () {
            this.sprite.removeAllChildren();
            this._removeContext();
        },
        /**
         *@pos {x:0,y:0}
         */
        setPosition: function (e) {
            var pos = e.pos || e.target.localToGlobal(e.point);
            var x = this._checkX(pos.x);
            var y = this._checkY(pos.y);
            this.sprite.context.x = x;
            this.sprite.context.y = y;
            this._tipDom.css({
                visibility: 'visible',
                left: x + 'px',
                top: y + 'px'
            });
        },
        /**
         *context相关-------------------------
         */
        _initContext: function (e) {
            this._tipDom = S.all('<div class=\'chart-tips\' style=\'visibility:hidden;position:absolute;<D-r>display:inline-block;*display:inline;*zoom:1;padding:6px;\'></div>');
            this.tipDomContainer.append(this._tipDom);
            this._setContext(e);
        },
        _removeContext: function () {
            this._tipDom.remove();
            this._tipDom = null;
        },
        _setContext: function (e) {
            this._tipDom.html(this._getContext(e));
            this.dW = this._tipDom.outerWidth();
            this.dH = this._tipDom.outerHeight();
        },
        _getContext: function (e) {
            var tipsContext = this.context;
            _.deepExtend(this.info, e.info || {});
            if (!tipsContext) {
                tipsContext = this._getDefaultContext(e);
            }
            return tipsContext;
        },
        _getDefaultContext: function (e) {
            var str = '<table>';
            var self = this;
            _.each(self.info.nodesInfoList, function (node, i) {
                str += '<tr style=\'color:' + node.fillStyle + '\'><td>' + self.prefix[i] + '</td><td>' + node.value + '</td></tr>';
            });
            str += '</table>';
            return str;
        },
        /**
         *Back相关-------------------------
         */
        _initBack: function (e) {
            var opt = {
                    x: 0,
                    y: 0,
                    width: this.dW,
                    height: this.dH,
                    lineWidth: 1,
                    strokeStyle: '#333333',
                    fillStyle: '#ffffff',
                    radius: [5]
                };
            this._back = new Rect({
                id: 'tipsBack',
                context: opt
            });
            this.sprite.addChild(this._back);
        },
        /**
         *获取back要显示的x
         *并且校验是否超出了界限
         */
        _checkX: function (x) {
            var w = this.dW + 2;    //后面的2 是 两边的linewidth
            //后面的2 是 两边的linewidth
            if (x < 0) {
                x = 0;
            }
            if (x + w > this.cW) {
                x = this.cW - w;
            }
            return x;
        },
        /**
         *获取back要显示的x
         *并且校验是否超出了界限
         */
        _checkY: function (y) {
            var h = this.dH + 2;    //后面的2 是 两边的linewidth
            //后面的2 是 两边的linewidth
            if (y < 0) {
                y = 0;
            }
            if (y + h > this.cH) {
                y = this.cH - h;
            }
            return y;
        }
    };
    return Tip;
}, {
    requires: [
        'canvax/',
        'canvax/shape/Rect',
        'dvix/utils/deep-extend'
    ]
});