/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * Path 类
 *
 * 对应context的属性有
 * @path path串
 **/
define(
    "canvax/shape/Path", [
        "canvax/display/Shape",
        "canvax/core/Base",
        "canvax/geom/Matrix",
        "canvax/geom/bezier"
    ],
    function(Shape, Base, Matrix, Bezier) {
        var Path = function(opt) {
            var self = this;
            self.type = "path";
            opt = Base.checkOpt(opt);
            if ("drawTypeOnly" in opt) {
                self.drawTypeOnly = opt.drawTypeOnly;
            };
            self.__parsePathData = null;
            var _context = {
                pointList: [], //从下面的path中计算得到的边界点的集合
                path: opt.context.path || "" //字符串 必须，路径。例如:M 0 0 L 0 10 L 10 10 Z (一个三角形)
                    //M = moveto
                    //L = lineto
                    //H = horizontal lineto
                    //V = vertical lineto
                    //C = curveto
                    //S = smooth curveto
                    //Q = quadratic Belzier curve
                    //T = smooth quadratic Belzier curveto
                    //Z = closepath
            };
            self._context = _.deepExtend(_context, (self._context || {}));
            arguments.callee.superclass.constructor.apply(self, arguments);
        };

        Base.creatClass(Path, Shape, {
            $watch: function(name, value, preValue) {
                if (name == "path") { //如果path有变动，需要自动计算新的pointList
                    this.__parsePathData = null;
                    this.context.pointList = [];
                }
            },
            _parsePathData: function(data) {
                if (this.__parsePathData) {
                    return this.__parsePathData;
                };
                if (!data) {
                    return [];
                };
                //分拆子分组
                this.__parsePathData = [];
                var paths = _.compact(data.replace(/[Mm]/g, "\\r$&").split('\\r'));
                var me = this;
                _.each(paths, function(pathStr) {
                    me.__parsePathData.push(me._parseChildPathData(pathStr));
                });
                return this.__parsePathData;
            },
            _parseChildPathData: function(data) {
                // command string
                var cs = data;
                // command chars
                var cc = [
                    'm', 'M', 'l', 'L', 'v', 'V', 'h', 'H', 'z', 'Z',
                    'c', 'C', 'q', 'Q', 't', 'T', 's', 'S', 'a', 'A'
                ];
                cs = cs.replace(/  /g, ' ');
                cs = cs.replace(/ /g, ',');
                //cs = cs.replace(/(.)-/g, "$1,-");
                cs = cs.replace(/(\d)-/g, '$1,-');
                cs = cs.replace(/,,/g, ',');
                var n;
                // create pipes so that we can split the data
                for (n = 0; n < cc.length; n++) {
                    cs = cs.replace(new RegExp(cc[n], 'g'), '|' + cc[n]);
                }
                // create array
                var arr = cs.split('|');
                var ca = [];
                // init context point
                var cpx = 0;
                var cpy = 0;
                for (n = 1; n < arr.length; n++) {
                    var str = arr[n];
                    var c = str.charAt(0);
                    str = str.slice(1);
                    str = str.replace(new RegExp('e,-', 'g'), 'e-');

                    //有的时候，比如“22，-22” 数据可能会经常的被写成22-22，那么需要手动修改
                    //str = str.replace(new RegExp('-', 'g'), ',-');
                    //str = str.replace(/(.)-/g, "$1,-")

                    var p = str.split(',');

                    if (p.length > 0 && p[0] === '') {
                        p.shift();
                    }

                    for (var i = 0; i < p.length; i++) {
                        p[i] = parseFloat(p[i]);
                    }
                    while (p.length > 0) {
                        if (isNaN(p[0])) {
                            break;
                        }
                        var cmd = null;
                        var points = [];

                        var ctlPtx;
                        var ctlPty;
                        var prevCmd;

                        var rx;
                        var ry;
                        var psi;
                        var fa;
                        var fs;

                        var x1 = cpx;
                        var y1 = cpy;

                        // convert l, H, h, V, and v to L
                        switch (c) {
                            case 'l':
                                cpx += p.shift();
                                cpy += p.shift();
                                cmd = 'L';
                                points.push(cpx, cpy);
                                break;
                            case 'L':
                                cpx = p.shift();
                                cpy = p.shift();
                                points.push(cpx, cpy);
                                break;
                            case 'm':
                                cpx += p.shift();
                                cpy += p.shift();
                                cmd = 'M';
                                points.push(cpx, cpy);
                                c = 'l';
                                break;
                            case 'M':
                                cpx = p.shift();
                                cpy = p.shift();
                                cmd = 'M';
                                points.push(cpx, cpy);
                                c = 'L';
                                break;

                            case 'h':
                                cpx += p.shift();
                                cmd = 'L';
                                points.push(cpx, cpy);
                                break;
                            case 'H':
                                cpx = p.shift();
                                cmd = 'L';
                                points.push(cpx, cpy);
                                break;
                            case 'v':
                                cpy += p.shift();
                                cmd = 'L';
                                points.push(cpx, cpy);
                                break;
                            case 'V':
                                cpy = p.shift();
                                cmd = 'L';
                                points.push(cpx, cpy);
                                break;
                            case 'C':
                                points.push(p.shift(), p.shift(), p.shift(), p.shift());
                                cpx = p.shift();
                                cpy = p.shift();
                                points.push(cpx, cpy);
                                break;
                            case 'c':
                                points.push(
                                    cpx + p.shift(), cpy + p.shift(),
                                    cpx + p.shift(), cpy + p.shift()
                                );
                                cpx += p.shift();
                                cpy += p.shift();
                                cmd = 'C';
                                points.push(cpx, cpy);
                                break;
                            case 'S':
                                ctlPtx = cpx;
                                ctlPty = cpy;
                                prevCmd = ca[ca.length - 1];
                                if (prevCmd.command === 'C') {
                                    ctlPtx = cpx + (cpx - prevCmd.points[2]);
                                    ctlPty = cpy + (cpy - prevCmd.points[3]);
                                }
                                points.push(ctlPtx, ctlPty, p.shift(), p.shift());
                                cpx = p.shift();
                                cpy = p.shift();
                                cmd = 'C';
                                points.push(cpx, cpy);
                                break;
                            case 's':
                                ctlPtx = cpx, ctlPty = cpy;
                                prevCmd = ca[ca.length - 1];
                                if (prevCmd.command === 'C') {
                                    ctlPtx = cpx + (cpx - prevCmd.points[2]);
                                    ctlPty = cpy + (cpy - prevCmd.points[3]);
                                }
                                points.push(
                                    ctlPtx, ctlPty,
                                    cpx + p.shift(), cpy + p.shift()
                                );
                                cpx += p.shift();
                                cpy += p.shift();
                                cmd = 'C';
                                points.push(cpx, cpy);
                                break;
                            case 'Q':
                                points.push(p.shift(), p.shift());
                                cpx = p.shift();
                                cpy = p.shift();
                                points.push(cpx, cpy);
                                break;
                            case 'q':
                                points.push(cpx + p.shift(), cpy + p.shift());
                                cpx += p.shift();
                                cpy += p.shift();
                                cmd = 'Q';
                                points.push(cpx, cpy);
                                break;
                            case 'T':
                                ctlPtx = cpx, ctlPty = cpy;
                                prevCmd = ca[ca.length - 1];
                                if (prevCmd.command === 'Q') {
                                    ctlPtx = cpx + (cpx - prevCmd.points[0]);
                                    ctlPty = cpy + (cpy - prevCmd.points[1]);
                                }
                                cpx = p.shift();
                                cpy = p.shift();
                                cmd = 'Q';
                                points.push(ctlPtx, ctlPty, cpx, cpy);
                                break;
                            case 't':
                                ctlPtx = cpx, ctlPty = cpy;
                                prevCmd = ca[ca.length - 1];
                                if (prevCmd.command === 'Q') {
                                    ctlPtx = cpx + (cpx - prevCmd.points[0]);
                                    ctlPty = cpy + (cpy - prevCmd.points[1]);
                                }
                                cpx += p.shift();
                                cpy += p.shift();
                                cmd = 'Q';
                                points.push(ctlPtx, ctlPty, cpx, cpy);
                                break;
                            case 'A':
                                rx = p.shift(); //x半径
                                ry = p.shift(); //y半径
                                psi = p.shift(); //旋转角度
                                fa = p.shift(); //角度大小 
                                fs = p.shift(); //时针方向

                                x1 = cpx, y1 = cpy;
                                cpx = p.shift(), cpy = p.shift();
                                cmd = 'A';
                                points = this._convertPoint(
                                    x1, y1, cpx, cpy, fa, fs, rx, ry, psi
                                );
                                break;
                            case 'a':
                                rx = p.shift();
                                ry = p.shift();
                                psi = p.shift();
                                fa = p.shift();
                                fs = p.shift();

                                x1 = cpx, y1 = cpy;
                                cpx += p.shift();
                                cpy += p.shift();
                                cmd = 'A';
                                points = this._convertPoint(
                                    x1, y1, cpx, cpy, fa, fs, rx, ry, psi
                                );
                                break;

                        }

                        ca.push({
                            command: cmd || c,
                            points: points
                        });
                    }

                    if (c === 'z' || c === 'Z') {
                        ca.push({
                            command: 'z',
                            points: []
                        });
                    }
                };
                return ca;
            },

            /*
             * @param x1 原点x
             * @param y1 原点y
             * @param x2 终点坐标 x
             * @param y2 终点坐标 y
             * @param fa 角度大小
             * @param fs 时针方向
             * @param rx x半径
             * @param ry y半径
             * @param psiDeg 旋转角度
             */
            _convertPoint: function(x1, y1, x2, y2, fa, fs, rx, ry, psiDeg) {

                var psi = psiDeg * (Math.PI / 180.0);
                var xp = Math.cos(psi) * (x1 - x2) / 2.0 + Math.sin(psi) * (y1 - y2) / 2.0;
                var yp = -1 * Math.sin(psi) * (x1 - x2) / 2.0 + Math.cos(psi) * (y1 - y2) / 2.0;

                var lambda = (xp * xp) / (rx * rx) + (yp * yp) / (ry * ry);

                if (lambda > 1) {
                    rx *= Math.sqrt(lambda);
                    ry *= Math.sqrt(lambda);
                }

                var f = Math.sqrt((((rx * rx) * (ry * ry)) - ((rx * rx) * (yp * yp)) - ((ry * ry) * (xp * xp))) / ((rx * rx) * (yp * yp) + (ry * ry) * (xp * xp)));

                if (fa === fs) {
                    f *= -1;
                }
                if (isNaN(f)) {
                    f = 0;
                }

                var cxp = f * rx * yp / ry;
                var cyp = f * -ry * xp / rx;

                var cx = (x1 + x2) / 2.0 + Math.cos(psi) * cxp - Math.sin(psi) * cyp;
                var cy = (y1 + y2) / 2.0 + Math.sin(psi) * cxp + Math.cos(psi) * cyp;

                var vMag = function(v) {
                    return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
                };
                var vRatio = function(u, v) {
                    return (u[0] * v[0] + u[1] * v[1]) / (vMag(u) * vMag(v));
                };
                var vAngle = function(u, v) {
                    return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(vRatio(u, v));
                };
                var theta = vAngle([1, 0], [(xp - cxp) / rx, (yp - cyp) / ry]);
                var u = [(xp - cxp) / rx, (yp - cyp) / ry];
                var v = [(-1 * xp - cxp) / rx, (-1 * yp - cyp) / ry];
                var dTheta = vAngle(u, v);

                if (vRatio(u, v) <= -1) {
                    dTheta = Math.PI;
                }
                if (vRatio(u, v) >= 1) {
                    dTheta = 0;
                }
                if (fs === 0 && dTheta > 0) {
                    dTheta = dTheta - 2 * Math.PI;
                }
                if (fs === 1 && dTheta < 0) {
                    dTheta = dTheta + 2 * Math.PI;
                }
                return [cx, cy, rx, ry, theta, dTheta, psi, fs];
            },
            /*
             * 获取bezier上面的点列表
             * */
            _getBezierPoints: function(p) {
                var steps = Math.abs(Math.sqrt(Math.pow(p.slice(-1)[0] - p[1], 2) + Math.pow(p.slice(-2, -1)[0] - p[0], 2)));
                steps = Math.ceil(steps / 5);
                var parr = [];
                for (var i = 0; i <= steps; i++) {
                    var t = i / steps;
                    var tp = Bezier.getPointByTime(t, p);
                    parr.push(tp.x);
                    parr.push(tp.y);
                };
                return parr;
            },
            /*
             * 如果path中有A a ，要导出对应的points
             */
            _getArcPoints: function(p) {

                var cx = p[0];
                var cy = p[1];
                var rx = p[2];
                var ry = p[3];
                var theta = p[4];
                var dTheta = p[5];
                var psi = p[6];
                var fs = p[7];
                var r = (rx > ry) ? rx : ry;
                var scaleX = (rx > ry) ? 1 : rx / ry;
                var scaleY = (rx > ry) ? ry / rx : 1;

                var _transform = new Matrix();
                _transform.identity();
                _transform.scale(scaleX, scaleY);
                _transform.rotate(psi);
                _transform.translate(cx, cy);

                var cps = [];
                var steps = (360 - (!fs ? 1 : -1) * dTheta * 180 / Math.PI) % 360;

                steps = Math.ceil(Math.min(Math.abs(dTheta) * 180 / Math.PI, r * Math.abs(dTheta) / 8)); //间隔一个像素 所以 /2

                for (var i = 0; i <= steps; i++) {
                    var point = [Math.cos(theta + dTheta / steps * i) * r, Math.sin(theta + dTheta / steps * i) * r];
                    point = _transform.mulVector(point);
                    cps.push(point[0]);
                    cps.push(point[1]);
                };
                return cps;
            },

            draw: function(ctx, style) {
                this._draw(ctx, style);
            },
            /**
             *  ctx Canvas 2D上下文
             *  style 样式
             */
            _draw: function(ctx, style) {
                var path = style.path;
                var pathArray = this._parsePathData(path);
                this._setPointList(pathArray, style);
                for (var g = 0, gl = pathArray.length; g < gl; g++) {
                    for (var i = 0, l = pathArray[g].length; i < l; i++) {
                        var c = pathArray[g][i].command, p = pathArray[g][i].points;
                        switch (c) {
                            case 'L':
                                ctx.lineTo(p[0], p[1]);
                                break;
                            case 'M':
                                ctx.moveTo(p[0], p[1]);
                                break;
                            case 'C':
                                ctx.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5]);
                                break;
                            case 'Q':
                                ctx.quadraticCurveTo(p[0], p[1], p[2], p[3]);
                                break;
                            case 'A':
                                var cx = p[0];
                                var cy = p[1];
                                var rx = p[2];
                                var ry = p[3];
                                var theta = p[4];
                                var dTheta = p[5];
                                var psi = p[6];
                                var fs = p[7];
                                var r = (rx > ry) ? rx : ry;
                                var scaleX = (rx > ry) ? 1 : rx / ry;
                                var scaleY = (rx > ry) ? ry / rx : 1;
                                var _transform = new Matrix();
                                _transform.identity();
                                _transform.scale(scaleX, scaleY);
                                _transform.rotate(psi);
                                _transform.translate(cx, cy);
                                //运用矩阵开始变形
                                ctx.transform.apply(ctx, _transform.toArray());
                                ctx.arc(0, 0, r, theta, theta + dTheta, 1 - fs);
                                //_transform.invert();
                                ctx.transform.apply(ctx, _transform.invert().toArray());
                                break;
                            case 'z':
                                ctx.closePath();
                                break;
                        }
                    }
                };
                return this;
            },
            _setPointList: function(pathArray, style) {
                if (style.pointList.length > 0) {
                    return;
                };

                // 记录边界点，用于判断inside
                var pointList = style.pointList = [];
                for (var g = 0, gl = pathArray.length; g < gl; g++) {

                    var singlePointList = [];

                    for (var i = 0, l = pathArray[g].length; i < l; i++) {
                        var p = pathArray[g][i].points;
                        var cmd = pathArray[g][i].command;

                        if (cmd.toUpperCase() == 'A') {
                            p = this._getArcPoints(p);
                            //A命令的话，外接矩形的检测必须转换为_points
                            pathArray[g][i]._points = p;
                        };

                        if (cmd.toUpperCase() == "C" || cmd.toUpperCase() == "Q") {
                            var cStart = [0, 0];
                            if (singlePointList.length > 0) {
                                cStart = singlePointList.slice(-1)[0];
                            } else if (i > 0) {
                                var prePoints = (pathArray[g][i - 1]._points || pathArray[g][i - 1].points);
                                if (prePoints.length >= 2) {
                                    cStart = prePoints.slice(-2);
                                }
                            };
                            p = this._getBezierPoints(cStart.concat(p));
                            pathArray[g][i]._points = p;
                        };

                        for (var j = 0, k = p.length; j < k; j += 2) {
                            var px = p[j];
                            var py = p[j + 1];
                            if ((!px && px!=0) || (!py && py!=0)) {
                                continue;
                            };
                            singlePointList.push([px, py]);
                        }
                    };
                    singlePointList.length > 0 && pointList.push(singlePointList);
                };
            },
            /**
             * 返回矩形区域，用于局部刷新和文字定位
             * style 样式
             */
            getRect: function(style) {
                
                var lineWidth;
                var style = style ? style : this.context;
                if (style.strokeStyle || style.fillStyle) {
                    lineWidth = style.lineWidth || 1;
                } else {
                    lineWidth = 0;
                }

                var minX = Number.MAX_VALUE;
                var maxX = Number.MIN_VALUE;

                var minY = Number.MAX_VALUE;
                var maxY = Number.MIN_VALUE;

                // 平移坐标
                var x = 0;
                var y = 0;

                var pathArray = this._parsePathData(style.path);
                this._setPointList(pathArray, style);
 
                for (var g = 0, gl = pathArray.length; g < gl; g++) {
                    for (var i = 0; i < pathArray[g].length; i++) {
                        var p = pathArray[g][i]._points || pathArray[g][i].points;

                        for (var j = 0; j < p.length; j++) {
                            if (j % 2 === 0) {
                                if (p[j] + x < minX) {
                                    minX = p[j] + x;
                                }
                                if (p[j] + x > maxX) {
                                    maxX = p[j] + x;
                                }
                            } else {
                                if (p[j] + y < minY) {
                                    minY = p[j] + y;
                                }
                                if (p[j] + y > maxY) {
                                    maxY = p[j] + y;
                                }
                            }
                        }
                    }
                };

                var rect;
                if (minX === Number.MAX_VALUE || maxX === Number.MIN_VALUE || minY === Number.MAX_VALUE || maxY === Number.MIN_VALUE) {
                    rect = {
                        x: 0,
                        y: 0,
                        width: 0,
                        height: 0
                    };
                } else {
                    rect = {
                        x: Math.round(minX - lineWidth / 2),
                        y: Math.round(minY - lineWidth / 2),
                        width: maxX - minX + lineWidth,
                        height: maxY - minY + lineWidth
                    };
                }
                return rect;
            }

        });
        return Path;
    }
);