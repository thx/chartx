KISSY.add('dvix/utils/deep-extend-min', function () {
    (function () {
        var a, b, c, d, e, f, g = [].slice;
        c = function (a) {
            var b, d;
            return !_.isObject(a) || _.isFunction(a) ? a : _.isDate(a) ? new Date(a.getTime()) : _.isRegExp(a) ? new RegExp(a.source, a.toString().replace(/.*\//, '')) : (d = _.isArray(a || _.isArguments(a)), b = function (a, b, e) {
                return d ? a.push(c(b)) : a[e] = c(b), a;
            }, _.reduce(a, b, d ? [] : {}));
        }, f = function (a) {
            return !(null != a && void 0 != a && a.prototype !== {}.prototype && a.prototype !== Object.prototype || !_.isObject(a) || _.isArray(a) || _.isFunction(a) || _.isDate(a) || _.isRegExp(a) || _.isArguments(a));
        }, b = function (a) {
            return _.filter(_.keys(a), function (b) {
                return f(a[b]);
            });
        }, a = function (a) {
            return _.filter(_.keys(a), function (b) {
                return _.isArray(a[b]);
            });
        }, e = function (c, d, f) {
            if (!d)
                return c;
            var g, h, i, j, k, l, m, n, o, p;
            if (null == f && (f = 20), 0 >= f)
                return console.warn('_.deepExtend(): Maximum depth of recursion hit.'), _.extend(c, d);
            for (l = _.intersection(b(c), b(d)), h = function (a) {
                    return d[a] = e(c[a], d[a], f - 1);
                }, m = 0, o = l.length; o > m; m++)
                k = l[m], h(k);
            for (j = _.intersection(a(c), a(d)), g = function (a) {
                    return d[a];
                }, n = 0, p = j.length; p > n; n++)
                i = j[n], g(i);
            return _.extend(c, d);
        }, d = function () {
            var a, b, d, f;
            if (d = 2 <= arguments.length ? g.call(arguments, 0, f = arguments.length - 1) : (f = 0, []), b = arguments[f++], _.isNumber(b) || (d.push(b), b = 20), d.length <= 1)
                return d[0];
            if (0 >= b)
                return _.extend.apply(this, d);
            for (a = d.shift(); d.length > 0;)
                a = e(a, c(d.shift()), b);
            return a;
        }, _.mixin({
            deepClone: c,
            isBasicObject: f,
            basicObjects: b,
            arrays: a,
            deepExtend: d
        });
    }.call(window));
}, { requires: ['dvix/library/underscore'] });