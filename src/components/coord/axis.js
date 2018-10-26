import Canvax from "canvax"
import {numAddSymbol} from "../../utils/tools"
import DataSection from "../../utils/datasection"

const Line = Canvax.Shapes.Line;
const _ = Canvax._;

export default class axis
{
    constructor(opt, dataOrg)
    {
        //super();
        this.layoutType = "proportion"; // rule , peak, proportion

        //源数据
        //这个是一个一定会有两层数组的数据结构，是一个标准的dataFrame数据
        // [ 
        //    [   
        //        [1,2,3],  
        //        [1,2,3]    //这样有堆叠的数据只会出现在proportion的axis里，至少目前是这样
        //    ] 
        //   ,[    
        //        [1,2,3] 
        //    ]   
        // ]
        this.dataOrg = dataOrg || []; 
        this.dataSection = []; //从原数据 dataOrg 中 结果 datasection 重新计算后的数据
    
        //轴总长
        this.axisLength = 1;
        
        this._cellCount = null;
        this._cellLength = null; //数据变动的时候要置空

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
        this._min = null; 
        this._max = null;

        

        //"asc" 排序，默认从小到大, desc为从大到小
        //之所以不设置默认值为asc，是要用 null 来判断用户是否进行了配置
        this.sort = null; 

        this.posParseToInt = false; //比如在柱状图中，有得时候需要高精度的能间隔1px的柱子，那么x轴的计算也必须要都是整除的

    }

    resetDataOrg( dataOrg ){
        //配置和数据变化

        this.dataSection = [];
        this.dataSectionGroup = [];

        this.dataOrg = dataOrg;

        this._cellCount = null
        this._cellLength = null;
    
    }

    setMinMaxOrigin()
    {
        if( this.layoutType == "proportion" ){
            if( this._min == null ){
                this._min = _.min( this.dataSection );
            };
            if( this._max == null ){
                this._max = _.max( this.dataSection );
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
        };
        
        this._originTrans = this._getOriginTrans( this.origin );
        this.originPos = this.getPosOfVal( this.origin );
        
    }

    setDataSection()
    {
        var me = this;

        //如果用户没有配置dataSection，或者用户传了，但是传了个空数组，则自己组装dataSection
        if ( !this._opt.dataSection || (this._opt.dataSection && !this._opt.dataSection.length ) ) {
            if( this.layoutType == "proportion" ){
            
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
                
                //如果还是0
                if (this.dataSection.length == 0) {
                    this.dataSection = [0];
                };
    
                //如果有 middleweight 设置，就会重新设置dataSectionGroup
                this.dataSectionGroup = [ _.clone(this.dataSection) ];
    
                this._middleweight(); //如果有middleweight配置，需要根据配置来重新矫正下datasection
    
                this._sort();
    
            } else {

                //非proportion 也就是 rule peak 模式下面
                this.dataSection = _.flatten( this.dataOrg );//this._getDataSection();
                this.dataSectionGroup = [ this.dataSection ];

            };
        } else {

            this.dataSection = this._opt.dataSection;
            this.dataSectionGroup = [ this.dataSection ];

        }
        
    }
    _getDataSection()
    {
        //如果有堆叠，比如[ ["uv","pv"], "click" ]
        //那么这个 this.dataOrg， 也是个对应的结构
        //vLen就会等于2
        var vLen = 1;

        _.each( this.dataOrg , function( arr ){
            vLen = Math.max( arr.length, vLen );
        } );

        if( vLen == 1 ){
            return this._oneDimensional( );
        };
        if( vLen > 1 ){
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

    //val 要被push到datasection 中去的 值
    //主要是用在markline等组件中，当自己的y值超出了yaxis的范围
    setWaterLine( val )
    {
        if( val <= this.waterLine) return;
        this.waterLine = val;
        if( val < _.min(this.dataSection) || val > _.max(this.dataSection) ){
            //waterLine不再当前section的区间内，需要重新计算整个datasection    
            this.setDataSection();
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

    //origin 对应 this.origin 的值
    _getOriginTrans( origin )
    {
        var pos = 0;

        var dsgLen = this.dataSectionGroup.length;
        var groupLength = this.axisLength / dsgLen;

        for (var i = 0, l = dsgLen; i < l; i++) {

            var ds = this.dataSectionGroup[i];

            if (this.layoutType == "proportion") {
                var min = _.min(ds);
                var max = _.max(ds);

                var amountABS = Math.abs(max - min);

                if (origin >= min && origin <= max) {
                    pos = ((origin - min) / amountABS * groupLength + i * groupLength);
                    break;
                };

                
            } else {
                /* TODO: 貌似 非proportion 布局 下面的_originTrans 没毛意义啊，先注释掉
                var valInd = _.indexOf(ds , origin);
                if( valInd != -1 ){
                    if( this.layoutType == "rule" ){
                        pos = valInd / (ds.length - 1) * groupLength; 
                    };
                    if( this.layoutType == "peak" ){
                        pos = ( groupLength/ds.length ) * (valInd+1) - ( groupLength/ds.length )/2;
                    };
                };
                */
            }
        };

        if (this.sort == "desc") {
            //如果是倒序的
            pos = -(groupLength - pos);
        };

        return pos;
    }




    getPosOfVal( val ){
        return this.getPosOf({
            val : val
        });
    }
    getPosOfInd( ind ){
        return this.getPosOf({
            ind : ind
        });
    }
    //opt {val, ind} val 或者ind 一定有一个
    getPosOf( opt ){
        var pos;

        var cellCount = this._getCellCount(); //dataOrg上面的真实数据节点数，把轴分成了多少个节点
        
        if( this.layoutType == "proportion" ){
            var dsgLen = this.dataSectionGroup.length;
            var groupLength = this.axisLength / dsgLen ;
            for( var i=0,l=dsgLen ; i<l ; i++ ){
                var ds = this.dataSectionGroup[i];
                var min = _.min(ds);
                var max = _.max(ds);
                var val = "val" in opt ? opt.val : this.getValOfInd( opt.ind , ds );
                if(val >= min && val <= max){
                    var _origin = this.origin;
                    //如果 origin 并不在这个区间
                    if( _origin < min || _origin > max ){
                        _origin = min;
                    } else {
                        //如果刚好在这个区间Group

                    };
                    var maxGroupDisABS = Math.max( Math.abs( max-_origin ) , Math.abs( _origin-min ) );
                    var amountABS = Math.abs( max - min );
                    var h = (maxGroupDisABS/amountABS) * groupLength;
                    pos = (val - _origin) / maxGroupDisABS * h + i*groupLength;
                    
                    if( isNaN(pos) ){
                        pos = i*groupLength;
                    };

                    break;
                }
            }
        } else {
            var valInd = "ind" in opt ? opt.ind : this.getIndexOfVal( opt.val );

            if( valInd != -1 ){
                if( this.layoutType == "rule" ){
                    //line 的xaxis就是 rule
                    pos = valInd / (cellCount - 1) * this.axisLength;
                };
                if( this.layoutType == "peak" ){
                    //bar的xaxis就是 peak
                    pos = (this.axisLength/cellCount) 
                          * (valInd+1) 
                          - (this.axisLength/cellCount)/2;
                };
            };
        };
            
        !pos && (pos = 0);

        pos += this._originTrans;
        
        return Math.abs(pos);
    }

    getValOfPos( pos )
    {
        var posInd = this.getIndexOfPos( pos );
        return this.getValOfInd( posInd );   
    }

    //ds可选
    getValOfInd( ind , ds ){
        
        var org = ds? ds  : _.flatten( this.dataOrg );
        var val;
debugger
        if( this.layoutType == "proportion" ){
            var min = this._min;
            var max = this._max;
            if( ds ){
                min = _.min( ds );
                max = _.max( ds );
            };
            val = min + ( max-min )/this._getCellCount() * ind;
        } else {
            val = org[ ind ];
        };
        return val;
    }


    getIndexOfPos( pos )
    {
        var ind = 0;
        
        var cellLength = this.getCellLengthOfPos( pos );
        var cellCount = this._getCellCount();

        if( this.layoutType == "proportion" ){
            
            //proportion中的index以像素为单位 所以，传入的像素值就是index
            return pos;

        } else {
            
            if( this.layoutType == "peak" ){
                ind = parseInt( pos / cellLength );
                if( ind == cellCount ){
                    ind = cellCount - 1;
                }
            };
    
            if( this.layoutType == "rule" ){
                ind = parseInt( (pos+(cellLength/2)) / cellLength );
                if( cellCount == 1 ){
                    //如果只有一个数据
                    ind = 0;
                }
            };
        };
        
        return ind
    }

    getIndexOfVal( val ){
        var valInd = -1;
        _.each( this.dataOrg, function( arr ){
            _.each( arr, function( list ){
                var _ind = _.indexOf( list , val );
                if( _ind != -1 ){
                    valInd = _ind;
                };
            } );
        } );
        return valInd;
    }
    
    getCellLength(){

        if( this._cellLength !== null ){
            return this._cellLength;
        };
      
        //ceilWidth默认按照peak算, 而且不能按照dataSection的length来做分母
        var axisLength = this.axisLength;
        var cellLength = axisLength;
        var cellCount = this._getCellCount();

        if( cellCount ){

            if( this.layoutType == "proportion" ){
                cellLength = 1;
            } else {

                //默认按照 peak 也就是柱状图的需要的布局方式
                cellLength = axisLength / cellCount;
                if( this.layoutType == "rule" ){
                    if( cellCount == 1 ){
                        cellLength = axisLength / 2;
                    } else {
                        cellLength = axisLength / ( cellCount - 1 )
                    };
                };
                if( this.posParseToInt ){
                    cellLength = parseInt( cellLength );
                };

            }

        };

        this._cellLength = cellLength;

        return cellLength;
        
    }

    //这个getCellLengthOfPos接口主要是给tips用，因为tips中只有x信息
    getCellLengthOfPos( pos ){
        return this.getCellLength();
    }

    //pos目前没用到，给后续的高级功能预留接口
    getCellLengthOfInd( pos ){
        return this.getCellLength();
    }

    _getCellCount(){

        if( this._cellCount !== null  ){
            return this._cellCount;
        };
        
        //总共有几个数据节点，默认平铺整个dataOrg，和x轴的需求刚好契合，而y轴目前不怎么需要用到这个
        var cellCount = 0;
        if( this.layoutType == "proportion" ){
            cellCount = this.axisLength;
        } else {
            if( this.dataOrg.length && this.dataOrg[0].length && this.dataOrg[0][0].length  ){
                cellCount = this.dataOrg[0][0].length;
            };
        };
        this._cellCount = cellCount;
        return cellCount;
    }

}