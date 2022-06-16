//TODO 所有的get xxx OfVal 在非proportion下面如果数据有相同的情况，就会有风险
import {_} from "canvax"
import dataSection from "./dataSection"
import {getDefaultProps} from "../utils/tools"


class axis {
    static defaultProps(){
        return {
            
            layoutType : {
                detail : '布局方式',
                default: 'proportion'
            },
            axisLength : {
                detail : '轴长度',
                default: 1
            },
            dataSection : {
                detail : '轴数据集',
                default: []
            },

            sectionHandler : {
                detail : '自定义dataSection的计算公式',
                default: null
            },

            verniers:{
                detail : '设定的游标，dataSection的区间一定会覆盖这些值',
                default: []
            },

            middleWeight : {
                detail : '区间分隔线',
                default: null,
                documentation: '如果middleweight有设置的话 _dataSectionGroup 为被middleweight分割出来的n个数组>..[ [0,50 , 100],[100,500,1000] ]'
            },
            middleWeightPos : {
                detail : '区间分隔线的物理位置，百分比,默认 0.5 ',
                default: null
            },
            symmetric : {
                detail : '自动正负对称',
                default: false,
                documentation: 'proportion下，是否需要设置数据为正负对称的数据，比如 [ 0,5,10 ] = > [ -10, 0 10 ]，象限坐标系的时候需要'
            },
            origin : {
                detail : '轴的起源值',
                default: null,
                documentation: '\
                    1，如果数据中又正数和负数，则默认为0 <br />\
                    2，如果dataSection最小值小于0，则baseNumber为最小值<br />\
                    3，如果dataSection最大值大于0，则baseNumber为最大值<br />\
                    4，也可以由用户在第2、3种情况下强制配置为0，则section会补充满从0开始的刻度值\
                '
            },
            sort : {
                detail : '排序',
                default: null
            },
            posParseToInt: {
                detail : '是否位置计算取整',
                default: false,
                documentation: '比如在柱状图中，有得时候需要高精度的能间隔1px的柱子，那么x轴的计算也必须要都是整除的'
            }
        }
    }
    
    constructor(opt, dataOrg) {
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
        this._opt    = _.clone(opt);

        this.dataOrg = dataOrg || [];
        
        this._dataSectionLayout = []; //和dataSection一一对应的，每个值的pos，//get xxx OfPos的时候，要先来这里做一次寻找
        this._cellCount = null;
        this._cellLength = null; //数据变动的时候要置空
        //默认的 _dataSectionGroup = [ dataSection ], dataSection 其实就是 _dataSectionGroup 去重后的一维版本
        this._dataSectionGroup = [];

        this.originPos = 0; //value为 origin 对应的pos位置
        this._originTrans = 0;//当设置的 origin 和datasection的min不同的时候，

        //min,max不需要外面配置，没意义
        this._min = null;
        this._max = null;

        _.extend( true, this, getDefaultProps( axis.defaultProps() ), opt ); 

    }

    resetDataOrg(dataOrg) {
        //配置和数据变化

        this.dataSection = [];
        this._dataSectionGroup = [];

        this.dataOrg = dataOrg;

        this._cellCount = null;
        this._cellLength = null;

    }

    setAxisLength(length) {
        this.axisLength = length;
        this.calculateProps();
    }

    calculateProps() {

        let me = this;

        if (this.layoutType == "proportion") {

            this._min = _.min(this.dataSection);
            this._max = _.max(this.dataSection);

            //默认情况下 origin 就是datasection的最小值
            //如果用户设置了origin，那么就已用户的设置为准
            if (!("origin" in this._opt)) {
                this.origin = 0;//this.dataSection[0];//_.min( this.dataSection );
                if (_.max(this.dataSection) < 0) {
                    this.origin = _.max(this.dataSection);
                };
                if (_.min(this.dataSection) > 0) {
                    this.origin = _.min(this.dataSection);
                };
            };

            this._originTrans = this._getOriginTrans(this.origin);
            this.originPos = this.getPosOfVal(this.origin);

        };



        //get xxx OfPos的时候，要先来这里做一次寻找
        this._dataSectionLayout = [];
        _.each(this.dataSection, function (val, i) {

            let ind = i;
            if (me.layoutType == "proportion") {
                ind = me.getIndexOfVal(val);
            };

            let pos = parseInt(me.getPosOf({
                ind: i,
                val: val
            }), 10);

            me._dataSectionLayout.push({
                val: val,
                ind: ind,
                pos: pos
            });

        });

    }
    getDataSection() {
        //对外返回的dataSection
        return this.dataSection;
    }
    setDataSection() {

        if( Array.isArray(this._opt.dataSection) && this._opt.dataSection.length ){
            this.dataSection = this._opt.dataSection;
            this._dataSectionGroup = [this.dataSection];
        } else {
            if (this.layoutType == "proportion") {

                //如果像柱状图中有堆叠的情况出现， arr中已经把堆叠的数据加起来了
                let arr = this._getDataSection();

                if ("origin" in this._opt){
                    arr.push(this._opt.origin);
                }

                if (arr.length == 1){
                    arr.push(arr[0] * .5);
                }

                if( Array.isArray( this.verniers ) && this.verniers.length ){
                    arr = arr.concat( this.verniers )
                }

                if (this.symmetric){
                    //如果需要处理为对称数据
                    let _min = _.min(arr);
                    let _max = _.max(arr);
                    if (Math.abs(_min) > Math.abs(_max)) {
                        arr.push(Math.abs(_min));
                    } else {
                        arr.push(-Math.abs(_max));
                    };
                }

                for (let ai = 0, al = arr.length; ai < al; ai++){
                    arr[ai] = Number(arr[ai]);
                    if (isNaN(arr[ai])) {
                        arr.splice(ai, 1);
                        ai--;
                        al--;
                    };
                }

                if( _.isFunction( this.sectionHandler ) ){
                    this.dataSection = this.sectionHandler( arr );
                }

                if( !this.dataSection || !this.dataSection.length ){
                    this.dataSection = dataSection.section(arr, 3);
                }

                if (this.symmetric) {
                    //可能得到的区间是偶数， 非对称，强行补上
                    let _min = _.min(this.dataSection);
                    let _max = _.max(this.dataSection);
                    if (Math.abs(_min) > Math.abs(_max)) {
                        this.dataSection.push(Math.abs(_min));
                    } else {
                        this.dataSection.unshift(-Math.abs(_max));
                    };
                }

                //如果还是0
                if (this.dataSection.length == 0) {
                    this.dataSection = [0];
                }

                //如果有 middleWeight 设置，就会重新设置dataSectionGroup
                this._dataSectionGroup = [_.clone(this.dataSection)];

                this._middleweight(); //如果有middleweight配置，需要根据配置来重新矫正下datasection

                this._sort();

            } else {

                //非proportion 也就是 rule peak 模式下面
                this.dataSection = _.flatten(this.dataOrg);//this._getDataSection();
                this._dataSectionGroup = [this.dataSection];

            };
        };

        //middleWeightPos在最后设定
        this._middleWeightPos();

    }
    _getDataSection() {
        //如果有堆叠，比如[ ["uv","pv"], "ppc" ]
        //那么这个 this.dataOrg， 也是个对应的结构
        //vLen就会等于2
        let vLen = 1;

        _.each(this.dataOrg, function (arr) {
            vLen = Math.max(arr.length, vLen);
        });

        if (vLen == 1) {
            return this._oneDimensional();
        };
        if (vLen > 1) {
            return this._twoDimensional();
        };

    }

    //后续也会做堆叠的折线图，就是面积图， 和堆叠图不同的是走的是一维数据计算
    _oneDimensional() {
        let arr = _.flatten(this.dataOrg); //_.flatten( data.org );

        for (let i = 0, il = arr.length; i < il; i++) {
            arr[i] = arr[i] || 0;
        };

        return arr;
    }
    //二维的yAxis设置，肯定是堆叠的比如柱状图，
    _twoDimensional() {
        let d = this.dataOrg;
        let arr = [];
        let min;
        _.each(d, function (d) {
            if (!d.length) {
                return
            };

            //有数据的情况下 
            if (!_.isArray(d[0])) {
                arr.push(d);
                return;
            };

            let varr = [];
            let len = d[0].length;
            let vLen = d.length;

            for (let i = 0; i < len; i++) {
                let up_count = 0;
                let up_i = 0;

                let down_count = 0;
                let down_i = 0;

                for (let ii = 0; ii < vLen; ii++) {

                    let _val = d[ii][i];
                    if (!_val && _val !== 0) {
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
    _addValToSection(val) {
        this.addVerniers(val)
        this.setDataSection();
        this.calculateProps();
    }

    addVerniers( val ){
        if( this.verniers.indexOf(val) == -1 ){
            this.verniers.push( val )
        }
    }

    _sort() {
        if (this.sort) {
            let sort = this._getSortType();
            if (sort == "desc") {

                this.dataSection.reverse();

                //_dataSectionGroup 从里到外全部都要做一次 reverse， 这样就可以对应上 dataSection.reverse()
                _.each(this._dataSectionGroup, function (dsg) {
                    dsg.reverse();
                });
                this._dataSectionGroup.reverse();
                //_dataSectionGroup reverse end
            };
        };
    }

    _getSortType() {
        let _sort;
        if (_.isString(this.sort)) {
            _sort = this.sort;
        }
        if (!_sort) {
            _sort = "asc";
        }
        return _sort;
    }

    _middleweight() {
        if ( this.middleWeight ) {
            //支持多个量级的设置

            if (!_.isArray(this.middleWeight)) {
                this.middleWeight = [ this.middleWeight ];
            };

            //拿到dataSection中的min和 max 后，用middleweight数据重新设置一遍dataSection
            let dMin = _.min(this.dataSection);
            let dMax = _.max(this.dataSection);
            let newDS = [dMin];
            let newDSG = [];

            for (let i = 0, l = this.middleWeight.length; i < l; i++) {
                let preMiddleweight = dMin;
                if (i > 0) {
                    preMiddleweight = this.middleWeight[i - 1];
                };
                let middleVal = preMiddleweight + parseInt((this.middleWeight[i] - preMiddleweight) / 2);

                newDS.push( middleVal );
                newDS.push( this.middleWeight[i] );

                newDSG.push([
                    preMiddleweight,
                    middleVal,
                    this.middleWeight[i]
                ]);
            };
            let lastMW = this.middleWeight.slice(-1)[0];

            if (dMax > lastMW) {
                newDS.push(lastMW + (dMax - lastMW) / 2);
                newDS.push(dMax);
                newDSG.push([
                    lastMW,
                    lastMW + (dMax - lastMW) / 2,
                    dMax
                ]);
            }

            //好了。 到这里用简单的规则重新拼接好了新的 dataSection
            this.dataSection = newDS;
            this._dataSectionGroup = newDSG;

        }
    }

    _middleWeightPos(){
        let me = this;
        if( this.middleWeightPos ){
            if( !_.isArray( this.middleWeightPos ) ){
                this.middleWeightPos = [ this.middleWeightPos ]
            };
            //需要校验下middleWeightPos中是有的值之和不能大于1
            //如果大于1了则默认按照均分设置
            let _count = 0;
            _.each( this.middleWeightPos, function( pos ){
                _count += pos;
            } );
            if( _count < 1 ){
                this.middleWeightPos.push( 1-_count );
            };
            if( _count > 1 ){
                this.middleWeightPos = null;
            };
        }; 
        if( this.middleWeight ){
            if( !this.middleWeightPos ){
                this.middleWeightPos = [];
                let _prePos = 0;
                _.each( this.middleWeight, function( ){
                    let _pos = 1 / (me.middleWeight.length+1);
                    _prePos += _pos;
                    me.middleWeightPos.push( _pos );
                } );
                this.middleWeightPos.push( 1 - _prePos );
            };
        } else {
            this.middleWeightPos = [1];
        }
    }

    //origin 对应 this.origin 的值
    _getOriginTrans(origin) {
        let pos = 0;
        let me = this;
        let dsgLen = this._dataSectionGroup.length;
        let groupLength = this.axisLength / dsgLen;

        for ( let i = 0, l = dsgLen; i < l; i++ ) {

            let ds = this._dataSectionGroup[i];

            groupLength = this.axisLength * this.middleWeightPos[i];
            let preGroupLenth = 0;
            _.each( this.middleWeightPos, function( mp, mi ){
                if( mi < i ){
                    preGroupLenth += me.axisLength * mp;
                };
            } );

            if (this.layoutType == "proportion") {
                let min = _.min(ds);
                let max = _.max(ds);

                let amountABS = Math.abs(max - min);

                if (origin >= min && origin <= max) {
                    pos = ((origin - min) / amountABS * groupLength + preGroupLenth);
                    break;
                };


            } else {
                /* TODO: 貌似 非proportion 布局 下面的_originTrans 没毛意义啊，先注释掉
                let valInd = _.indexOf(ds , origin);
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

        return parseInt(pos);
    }

    //opt { val ind pos } 一次只能传一个
    _getLayoutDataOf(opt) {
        let props = ["val", "ind", "pos"];
        let prop;
        _.each(props, function (_p) {
            if (_p in opt) {
                prop = _p;
            }
        });

        let layoutData;
        _.each(this._dataSectionLayout, function (item) {
            if (item[prop] === opt[prop]) {
                layoutData = item;
            };
        });

        return layoutData || {};
    }

    getPosOfVal(val) {

        /* val可能会重复，so 这里得到的会有问题，先去掉
        //先检查下 _dataSectionLayout 中有没有对应的记录
        let _pos = this._getLayoutDataOf({ val : val }).pos;
        if( _pos != undefined ){
            return _pos;
        };
        */

        return this.getPosOf({
            val: val
        });
    }
    getPosOfInd(ind) {
        //先检查下 _dataSectionLayout 中有没有对应的记录
        let _pos = this._getLayoutDataOf({ ind: ind }).pos;
        if (_pos != undefined) {
            return _pos;
        };

        return this.getPosOf({
            ind: ind
        });
    }

    //opt {val, ind} val 或者ind 一定有一个
    getPosOf(opt) {
        let me = this;
        let pos;

        let cellCount = this._getCellCount(); //dataOrg上面的真实数据节点数，把轴分成了多少个节点

        if (this.layoutType == "proportion") {

            let dsgLen = this._dataSectionGroup.length;

            for (let i = 0, l = dsgLen; i < l; i++) {
                let ds = this._dataSectionGroup[i];

                let groupLength = this.axisLength * this.middleWeightPos[i];
                let preGroupLenth = 0;
                _.each( this.middleWeightPos, function( mp, mi ){
                    if( mi < i ){
                        preGroupLenth += me.axisLength * mp;
                    };
                } );

                let min = _.min(ds);
                let max = _.max(ds);
                let val = "val" in opt ? opt.val : this.getValOfInd(opt.ind);
                if (val >= min && val <= max) {

                    let _origin = this.origin;
                    let origiInRange = !(_origin < min || _origin > max);
                    //如果 origin 并不在这个区间
                    if ( !origiInRange ) {
                        _origin = min;
                    } else {
                        //如果刚好在这个区间Group

                    };
                    
                    //origin不在区间内的话，maxGroupDisABS一定是整个区间， 也就是说这个区间的原点在起点min
                    let maxGroupDisABS = Math.max(Math.abs(max - _origin), Math.abs(_origin - min));
                    let amountABS = Math.abs(max - min);
                    let originPos = (maxGroupDisABS / amountABS) * groupLength;
                    pos = (val - _origin) / maxGroupDisABS * originPos + preGroupLenth;

                    if (isNaN(pos)) {
                        pos = parseInt( preGroupLenth );
                    };

                    if( origiInRange ){
                        //origin在区间内的时候，才需要便宜_originTrans
                        pos += this._originTrans;
                    };

                    break;
                }
            }

            
        } else {

            if (cellCount == 1) {
                //如果只有一数据，那么就全部默认在正中间
                pos = this.axisLength / 2;
            } else {
                //TODO 这里在非proportion情况下，如果没有opt.ind 那么getIndexOfVal 其实是有风险的，
                //因为可能有多个数据的val一样

                let valInd = "ind" in opt ? opt.ind : this.getIndexOfVal(opt.val);
                if (valInd != -1) {
                    if (this.layoutType == "rule") {
                        //line 的xaxis就是 rule
                        pos = valInd / (cellCount - 1) * this.axisLength;
                    };
                    if (this.layoutType == "peak") {
                        //bar的xaxis就是 peak
                        /*
                        pos = (this.axisLength/cellCount) 
                              * (valInd+1) 
                              - (this.axisLength/cellCount)/2;
                        */
                        let _cellLength = this.getCellLength();
                        pos = _cellLength * (valInd + 1) - _cellLength / 2;
                    };
                };
            };

        };

        !pos && (pos = 0);

        pos = Number(pos.toFixed(1))

        return Math.abs(pos);
    }

    getValOfPos(pos) {
        //先检查下 _dataSectionLayout 中有没有对应的记录
        let _val = this._getLayoutDataOf({ pos: pos }).val;
        if (_val != undefined) {
            return _val;
        };

        return this._getValOfInd(this.getIndexOfPos(pos));
    }

    //ds可选
    getValOfInd(ind) {

        //先检查下 _dataSectionLayout 中有没有对应的记录
        let _val = this._getLayoutDataOf({ ind: ind }).val;
        if (_val != undefined) {
            return _val;
        };

        return this._getValOfInd(ind);

        /*
        if (this.layoutType == "proportion") {
        
        } else {
            //这里的index是直接的对应dataOrg的索引
            let org = ds ? ds : _.flatten(this.dataOrg);
            return org[ind];
        };
        */

    }

    //这里的ind
    _getValOfInd(ind) {
        let me = this;

        let org = _.flatten(this.dataOrg);
        let val;

        if (this.layoutType == "proportion") {

            //let dsgLen = this._dataSectionGroup.length;
            //let groupLength = this.axisLength / dsgLen;

            _.each(this._dataSectionGroup, function (ds, i) {

                let groupLength = me.axisLength * me.middleWeightPos[i];
                let preGroupLenth = 0;
                _.each( me.middleWeightPos, function( mp, mi ){
                    if( mi < i ){
                        preGroupLenth += me.axisLength * mp;
                    };
                } );

                if (parseInt(ind / groupLength) == i || i == me._dataSectionGroup.length - 1) {
                    let min = _.min(ds);
                    let max = _.max(ds);
                    val = min + (max - min) / groupLength * (ind - preGroupLenth);
                    return false;
                };
            });

        } else {
            val = org[ind];
        };
        return val;
    }

    getIndexOfPos(pos) {

        //先检查下 _dataSectionLayout 中有没有对应的记录
        let _ind = this._getLayoutDataOf({ pos: pos }).ind;
        if (_ind != undefined) {
            return _ind;
        };

        let ind = 0;

        let cellLength = this.getCellLengthOfPos(pos);
        let cellCount = this._getCellCount();

        if (this.layoutType == "proportion") {
            //proportion中的index以像素为单位 所以，传入的像素值就是index
            return pos;
        } else {

            if (this.layoutType == "peak") {
                ind = parseInt(pos / cellLength);
                if (ind == cellCount) {
                    ind = cellCount - 1;
                }
            };

            if (this.layoutType == "rule") {
                ind = parseInt((pos + (cellLength / 2)) / cellLength);
                if (cellCount == 1) {
                    //如果只有一个数据
                    ind = 0;
                }
            };
        };

        return ind
    }

    getIndexOfVal(val) {

        let valInd = -1;
        if (this.layoutType == "proportion") {

            //先检查下 _dataSectionLayout 中有没有对应的记录
            let _ind = this._getLayoutDataOf({ val: val }).ind;
            if (_ind != undefined) {
                return _ind;
            };

            //因为在proportion中index 就是 pos
            //所以这里要返回pos
            valInd = this.getPosOfVal(val);
        } else {
            _.each(this.dataOrg, function (arr) {
                _.each(arr, function (list) {
                    let _ind = _.indexOf(list, val);
                    if (_ind != -1) {
                        valInd = _ind;
                    };
                });
            });
        }


        return valInd;
    }

    getCellLength() {

        if (this._cellLength !== null) {
            return this._cellLength;
        };

        //ceilWidth默认按照peak算, 而且不能按照dataSection的length来做分母
        let axisLength = this.axisLength;
        let cellLength = axisLength;
        let cellCount = this._getCellCount();

        if ( cellCount ) {

            if (this.layoutType == "proportion") {
                cellLength = 1;
            } else {
                //默认按照 peak 也就是柱状图的需要的布局方式
                cellLength = axisLength / cellCount;
                if (this.layoutType == "rule") {
                    if (cellCount == 1) {
                        cellLength = axisLength / 2;
                    } else {
                        cellLength = axisLength / (cellCount - 1)
                    };
                };

                if (this.posParseToInt) {
                    cellLength = parseInt(cellLength);
                };
            }
        };

        this._cellLength = cellLength;

        return cellLength;

    }

    //这个getCellLengthOfPos接口主要是给tips用，因为tips中只有x信息
    getCellLengthOfPos() {
        return this.getCellLength();
    }

    //pos目前没用到，给后续的高级功能预留接口
    getCellLengthOfInd() {
        return this.getCellLength();
    }

    _getCellCount() {

        if (this._cellCount !== null) {
            return this._cellCount;
        };

        //总共有几个数据节点，默认平铺整个dataOrg，和x轴的需求刚好契合，而y轴目前不怎么需要用到这个
        let cellCount = 0;
        if (this.layoutType == "proportion") {
            cellCount = this.axisLength;
        } else {

            if (this.dataOrg.length && this.dataOrg[0].length && this.dataOrg[0][0].length) {
                cellCount = this.dataOrg[0][0].length;
            }
        };
        this._cellCount = cellCount;
        return cellCount;
    }

}

export default axis