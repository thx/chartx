KISSY.add('dvix/chart/bar/xaxis-min', function (a, b) {
    var c = function () {
        this.xDis1 = 0, c.superclass.constructor.apply(this, arguments);
    };
    return a.extend(c, b, {
        _trimXAxis: function (a, b) {
            var c = [];
            this.xDis1 = b / a.length;
            for (var d = 0, e = a.length; e > d; d++) {
                var f = {
                        content: a[d],
                        x: this.xDis1 * (d + 1) - this.xDis1 / 2
                    };
                c.push(f);
            }
            return c;
        }
    }), c;
}, { requires: ['dvix/components/xaxis/xAxis'] });