define(
    "chartx/chart/bar/proportion",
    [
        'chartx/chart/bar/index',
        "chartx/utils/tools"
    ],
    function( Bar , Tools ){
        return Bar.extend( {
            init:function(node , data , opts){
                this._opts = opts;

                !opts.tips && ( opts.tips = {} );

                opts.tips = _.deepExtend( opts.tips , {
                    content : function( info ){
                        var str  = "<table>";
                        var self = this;
                        _.each( info.nodesInfoList , function( node , i ){
                            str+= "<tr style='color:"+ self.text.fillStyle +"'>";
                            var prefixName = self.prefix[i];
                            if( prefixName ) {
                                str+="<td>"+ prefixName +"：</td>";
                            } else {
                                if( node.field ){
                                    str+="<td>"+ node.field +"：</td>";
                                }
                            };

                            str += "<td>"+ Tools.numAddSymbol(node.value) +"（"+ Math.round(node.value/node.vCount*100) +"%）</td></tr>";
                        });
                        str+="</table>";
                        return str;
                    }
                } );

                _.deepExtend( this , opts );
                _.deepExtend( this.yAxis , {
                    dataSection : [0,20,40,60,80,100],
                    text : {
                        format : function( n ){
                            return n+"%"
                        }
                    }
                } );
                
                !this.graphs && (this.graphs = {});
                _.deepExtend( this.graphs , {
                    bar : {
                        radius : 0
                    }
                } );

                this.dataFrame = this._initData( data );
            },
            _trimGraphs: function(_xAxis, _yAxis) {
                _xAxis || (_xAxis = this._xAxis);
                _yAxis || (_yAxis = this._yAxis);
                var xArr = _xAxis.data;
                var yArr = _yAxis.dataOrg;
                var hLen = yArr.length; //bar的横向分组length

                var xDis1 = _xAxis.xDis1;
                //x方向的二维长度，就是一个bar分组里面可能有n个子bar柱子，那么要二次均分
                var xDis2 = xDis1 / (hLen + 1);

                //知道了xDis2 后 检测下 barW是否需要调整
                this._graphs.checkBarW && this._graphs.checkBarW(xDis2);

                var maxYAxis = _yAxis.dataSection[_yAxis.dataSection.length - 1];
                var tmpData = [];
                var center  = [], yValueMaxs = [], yLen = [];


                //var vCountArr = [];
                //var vLen      = 0;
                
                for (var b = 0; b < hLen; b++) {
                    !tmpData[b] && (tmpData[b] = []);
                    yValueMaxs[b] = 0
                    center[b] = {};
                    
                    
                    _.each(yArr[b], function(subv, v) {
                        !tmpData[b][v] && (tmpData[b][v] = []);

                        _.each(subv, function(val, i) {
                            if (!xArr[i]) {
                                return;
                            };
                            
                            var vCount = 0
                            //先计算总量
                            _.each( yArr[b] , function( team , ti ){
                                vCount += team[i]
                            } );

                            var x = xArr[i].x - xDis1 / 2 + xDis2 * (b + 1);
                            //var y = -(val - _yAxis._bottomNumber) / (maxYAxis - _yAxis._bottomNumber) * _yAxis.yGraphsHeight;
                            var y = -val/vCount * _yAxis.yGraphsHeight;
                            if (v > 0) {
                                y += tmpData[b][v - 1][i].y
                            };
                            tmpData[b][v].push({
                                value  : val,
                                vCount : vCount,
                                x      : x,
                                y      : y
                            });
                            yValueMaxs[b] += Number(val)
                            yLen = subv.length
                        });
                    });
                }

                for (var a = 0, al = yValueMaxs.length; a < al; a++) {
                    center[a].agValue = yValueMaxs[a] / yLen
                    center[a].agPosition = -(yValueMaxs[a] / yLen - _yAxis._bottomNumber) / (maxYAxis - _yAxis._bottomNumber) * _yAxis.yGraphsHeight
                }
                //均值
                this.dataFrame.yAxis.center = center
                return {
                    data: tmpData
                };
            }
        });
    }
);
