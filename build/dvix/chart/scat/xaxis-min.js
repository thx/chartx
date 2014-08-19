KISSY.add('dvix/chart/scat/xaxis-min', function (a, b, c) {
    var d = function () {
        this.xDis = 0, d.superclass.constructor.apply(this, arguments);
    };
    return a.extend(d, b, {
        _initDataSection: function (a) {
            var a = _.flatten(a), b = c.section(a);
            return this._baseNumber = b[0], 1 == b.length && b.push(100), b;
        },
        _trimXAxis: function (a, b) {
            var c = [];
            this.xDis = b / (a.length - 1);
            for (var d = 0, e = a.length; e > d; d++) {
                var f = {
                        content: a[d],
                        x: this.xDis * d
                    };
                c.push(f);
            }
            return c;
        }
    }), d;
}, {
    requires: [
        'dvix/components/xaxis/xAxis',
        'dvix/utils/datasection'
    ]
});