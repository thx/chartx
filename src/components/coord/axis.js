import Canvax from "canvax"
import {numAddSymbol} from "../../utils/tools"
import DataSection from "../../utils/datasection"

const Line = Canvax.Shapes.Line;
const _ = Canvax._;

export default class axis
{
    constructor(opt, data, _coord)
    {
        //super();

        this.dataOrg = data.org || []; //源数据
        this.dataSection = []; //从原数据 dataOrg 中 结果 datasection 重新计算后的数据
        
        //下面三个目前yAxis中实现了，后续统一都会实现
    
        //水位data，需要混入 计算 dataSection， 如果有设置waterLine， dataSection的最高水位不会低于这个值
        //这个值主要用于第三方的markline等组件， 自己的y值超过了yaxis的范围的时候，需要纳入来修复yaxis的section区间
        this.waterLine = null; 
        //默认的 dataSectionGroup = [ dataSection ], dataSection 其实就是 dataSectionGroup 去重后的一维版本
        this.dataSectionGroup = []; 
        //如果middleweight有设置的话 dataSectionGroup 为被middleweight分割出来的n个数组>..[ [0,50 , 100],[100,500,1000] ]
        this.middleweight = null; 


        //1，如果数据中又正数和负数，则默认为0，
        //2，如果dataSection最小值小于0，则baseNumber为最小值，
        //3，如果dataSection最大值大于0，则baseNumber为最大值
        //也可以由用户在第2、3种情况下强制配置为0，则section会补充满从0开始的刻度值
        this.origin = null; 
        this.originPos = null; //value为 origin 对应的pos位置
        this._originTrans = 0;//当设置的 origin 和datasection的min不同的时候，

        //min,max不需要外面配置，没意义
        this.min = null; 
        this.max = null;

        this.layoutType = "proportion"; // rule , peak, proportion

        //"asc" 排序，默认从小到大, desc为从大到小
        //之所以不设置默认值为asc，是要用 null 来判断用户是否进行了配置
        this.sort = null; 

        this.posParseToInt = false; //比如在柱状图中，有得时候需要高精度的能间隔1px的柱子，那么x轴的计算也必须要都是整除的

    }

    setMinMaxOrigin()
    {
        if( this.min == null ){
            this.min = _.min( this.dataSection );
        };
        if( this.max == null ){
            this.max = _.max( this.dataSection );
        };
        
        //默认情况下 origin 就是datasection的最小值
        //如果用户设置了origin，那么就已用户的设置为准
        if ( !("origin" in this._opt) ) {
            this.origin = 0;//this.dataSection[0];//_.min( this.dataSection );
            if( _.max( this.dataSection ) < 0 ){
                this.origin = _.max( this.dataSection );
            };
            if( _.min( this.dataSection ) > 0 ){
                this.origin = _.min( this.dataSection );
            };
        };
        
        this._originTrans = this._getYOriginTrans( this.origin , this.height );
        this.originPos = this.getPosFromVal( this.origin );

    }

    _getDataSection()
    {
        //如果有堆叠，比如[ ["uv","pv"], "click" ]
        //那么这个 this.dataOrg， 也是个对应的结构
        //vLen就会等于2
        var vLen = 1;

        _.each( this.field, function( f ){
            vLen = Math.max( vLen, 1 );
            if( _.isArray( f ) ){
                _.each( f, function( _f ){
                    vLen = Math.max( vLen, 2 );
                } );
            }
        } );


        if( vLen == 1 ){
            return this._oneDimensional( );
        };
        if( vLen == 2 ){
            return this._twoDimensional( );
        };
        
    }

    _oneDimensional()
    {
        var arr = _.flatten( this.dataOrg ); //_.flatten( data.org );

        for( var i = 0, il=arr.length; i<il ; i++ ){
            arr[i] =  arr[i] || 0;
        };

        return arr;
    }

    //二维的yAxis设置，肯定是堆叠的比如柱状图，后续也会做堆叠的折线图， 就是面积图
    _twoDimensional()
    {
        var d = this.dataOrg;
        var arr = [];
        var min;
        _.each( d , function(d, i) {
            if (!d.length) {
                return
            };

            //有数据的情况下 
            if (!_.isArray(d[0])) {
                arr.push(d);
                return;
            };

            var varr = [];
            var len = d[0].length;
            var vLen = d.length;

            for (var i = 0; i < len; i++) {
                var up_count = 0;
                var up_i = 0;

                var down_count = 0;
                var down_i = 0;

                for (var ii = 0; ii < vLen; ii++) {
                    
                    var _val = d[ii][i];
                    if( !_val && _val !== 0 ){
                        continue;
                    };

                    min == undefined && (min = _val)
                    min = Math.min(min, _val);

                    if (_val >= 0) {
                        up_count += _val;
                        up_i++
                    } else {
                        down_count += _val;
                        down_i++
                    }
                }
                up_i && varr.push(up_count);
                down_i && varr.push(down_count);
            };
            arr.push(varr);
        });
        arr.push(min);
        return _.flatten(arr);
    }

    initData()
    {
        var me = this;
        
        //如果用户传入了自定义的dataSection， 那么优先级最高
        if ( !this._opt.dataSection || (this._opt.dataSection && !this._opt.dataSection.length ) ) {
   
            var arr = this._getDataSection();
        
            if( this.waterLine ){
                arr.push( this.waterLine );
            };

            if( "origin" in me._opt ){
                arr.push( me._opt.origin );
            };
            
            if( arr.length == 1 ){
                arr.push( arr[0]*2 );
            };

            for( var ai=0,al=arr.length; ai<al; ai++ ){
                arr[ai] = Number( arr[ai] );
                if( isNaN( arr[ai] ) ){
                    arr.splice( ai, 1 );
                    ai--;
                    al--;
                };
            };

            this.dataSection = DataSection.section(arr, 3);
        } else {
            this.dataSection = this._opt.dataSection;
        };

        //如果还是0
        if (this.dataSection.length == 0) {
            this.dataSection = [0]
        };

        //如果有 middleweight 设置，就会重新设置dataSectionGroup
        this.dataSectionGroup = [ _.clone(this.dataSection) ];

        this._middleweight(); //如果有middleweight配置，需要根据配置来重新矫正下datasection

        this._sort();
        
    }

    //val 要被push到datasection 中去的 值
    //主要是用在markline等组件中，当自己的y值超出了yaxis的范围
    setWaterLine( val )
    {
        if( val <= this.waterLine) return;
        this.waterLine = val;
        if( val < _.min(this.dataSection) || val > _.max(this.dataSection) ){
            //waterLine不再当前section的区间内，需要重新计算整个datasection    
            this.initData();
            this.setMinMaxOrigin();
        };
    }

    _sort()
    {
        if (this.sort) {
            var sort = this._getSortType();
            if (sort == "desc") {
                this.dataSection.reverse();

                //dataSectionGroup 从里到外全部都要做一次 reverse， 这样就可以对应上 dataSection.reverse()
                _.each( this.dataSectionGroup , function( dsg , i ){
                    dsg.reverse();
                } );
                this.dataSectionGroup.reverse();
                //dataSectionGroup reverse end
            };
        };
    }

    _getSortType()
    {
        var _sort;
        if( _.isString(this.sort) ){
            _sort = this.sort;
        }
        if( _.isArray(this.sort) ){
            _sort = this.sort[ this.align == "left" ? 0 : 1 ];
        }
        if( !_sort ){
            _sort = "asc";
        }
        return _sort;
    }

    _middleweight()
    {
        if( this.middleweight ){
            //支持多个量级的设置

            if( !_.isArray( this.middleweight ) ){
                this.middleweight = [ this.middleweight ];
            };

            //拿到dataSection中的min和 max 后，用middleweight数据重新设置一遍dataSection
            var dMin = _.min( this.dataSection );
            var dMax = _.max( this.dataSection );
            var newDS = [ dMin ];
            var newDSG = [];

            for( var i=0,l=this.middleweight.length ; i<l ; i++ ){
                var preMiddleweight = dMin;
                if( i > 0 ){
                    preMiddleweight = this.middleweight[ i-1 ];
                };
                var middleVal = preMiddleweight + parseInt( (this.middleweight[i] - preMiddleweight) / 2 );

                newDS.push( middleVal );
                newDS.push( this.middleweight[i] );

                newDSG.push([
                    preMiddleweight,
                    middleVal,
                    this.middleweight[i]
                ]);
            };
            var lastMW =  this.middleweight.slice(-1)[0];

            if( dMax > lastMW ){
                newDS.push( lastMW + (dMax - lastMW) / 2 ) ;
                newDS.push( dMax );
                newDSG.push([
                    lastMW,
                    lastMW +(dMax - lastMW) / 2 ,
                    dMax
                ]);
            }

            //好了。 到这里用简单的规则重新拼接好了新的 dataSection
            this.dataSection = newDS;
            this.dataSectionGroup = newDSG;

        };                
    }

    _getYOriginTrans( origin, length )
    {
        var y = 0;
        var dsgLen = this.dataSectionGroup.length;
        var groupLength = this.length / dsgLen ;

        for( var i=0,l=dsgLen ; i<l ; i++ ){
            var ds = this.dataSectionGroup[i];
            var min = _.min(ds);
            var max = _.max(ds);

            var amountABS = Math.abs( max - min );

            if( origin >= min && origin <= max ){
                y = ( (origin - min) / amountABS * groupLength + i*groupLength);
                break;
            }
        };

        y = isNaN(y) ? 0 : parseInt(y);

        if( this.sort == "desc" ){
            //如果是倒序的
            y = -(groupLength - Math.abs(y));
        };

        return y;
    }

    getPosFromVal( val )
    {

        var y = 0;
        var dsgLen = this.dataSectionGroup.length;
        var yGroupHeight = this.height / dsgLen ;

        for( var i=0,l=dsgLen ; i<l ; i++ ){
            var ds = this.dataSectionGroup[i];
            var min = _.min(ds);
            var max = _.max(ds);
            var valInd = _.indexOf(ds , val);

            if( (val >= min && val <= max) || valInd >= 0 ){
                if( this.layoutType == "proportion" ){
                    var _origin = this.origin;
                    //如果 origin 并不在这个区间
                    if( _origin < min || _origin > max ){
                        _origin = min;
                    } else {
                        //如果刚好在这个区间Group

                    }
                    var maxGroupDisABS = Math.max( Math.abs( max-_origin ) , Math.abs( _origin-min ) );
                    var amountABS = Math.abs( max - min );
                    var h = (maxGroupDisABS/amountABS) * yGroupHeight;
                    y = (val - _origin) / maxGroupDisABS * h + i*yGroupHeight;
                    
                    if( isNaN(y) ){
                        y = i*yGroupHeight;
                    }
                }
                if( this.layoutType == "rule" ){
                    //line 的xaxis就是 rule
                    y = valInd / (ds.length - 1) * yGroupHeight;
                }
                if( this.layoutType == "peak" ){
                    //bar的xaxis就是 peak
                    y = ( yGroupHeight/ds.length ) * (valInd+1) - ( yGroupHeight/ds.length )/2;
                }

                y += this._originTrans;
                break;
            }
        };

        if( isNaN(y) ){
            y = 0;
        };
        
        return -Math.abs(y);
    }

    getValFromPos( y )
    {
        var start = this.layoutData[0];
        var end   = this.layoutData.slice(-1)[0];
        var val = (end.value-start.value) * ((y-start.y)/(end.y-start.y)) + start.value;
        return val;
    }

}