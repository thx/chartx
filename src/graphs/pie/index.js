import Canvax from "canvax2d"
import Pie from "./pie"
import GraphsBase from "../index"

const _ = Canvax._;

export default class PieGraphs extends GraphsBase
{
    constructor( opts, root )
    {
        super( opts, root );

        this.type = "pie";

        this.node = {
            value : null,
            name : null,
            r : null, //自动计算，也可以配置一个字段，就成了丁格尔玫瑰图
            shapeType : "sector",
            colors : this.root._theme,

            focus  : {
                enabled : true,
            },
            select : {
                enabled : false,
                r : 5,
                alpha : 0.7
            },
            
            innerRadius : 0,
            outRadius : null,//如果有配置rField（丁格尔玫瑰图）,则outRadius代表最大radius
            minSectorRadius : 30,//outRadius - innerRadius 的最小值
            moveDis : 15    //要预留moveDis位置来hover sector 的时候外扩
        };

        this.text = {
            enabled : false,
            format  : null
        };

        this.startAngle = -90;
        this.allAngles = 360;
        
        this.init( opts );
    }

    init( opts )
    {
        _.extend(true, this, opts);
        this.sprite = new Canvax.Display.Sprite();

        //初步设置下data，主要legend等需要用到
        this.data = this._dataHandle();
    }

    _computerProps()
    {
        var w = this.width;
        var h = this.height;

        //TODO：如果用户有配置outRadius的话，就按照用户的来，目前不做修正
        if( !this.node.outRadius ){
            var outRadius = Math.min(w, h) / 2;
            if ( this.text.enabled ) {
                //要预留moveDis位置来hover sector 的时候外扩
                outRadius -= this.node.moveDis;
            };
            this.node.outRadius = parseInt( outRadius );
        };

        //要保证sec具有一个最小的radius
        if( this.node.outRadius - this.node.innerRadius < this.node.minSectorRadius ){
            this.node.innerRadius = this.node.outRadius - this.node.minSectorRadius;
        };

    }

    /**
     * opts ==> {width,height,origin}
     */
    draw( opts )
    {
        !opts && (opts ={});

        _.extend(true, this, opts);
        this._computerProps();

        //这个时候就是真正的计算布局用得layoutdata了
        this._pie = new Pie( this._opts, this , this._trimGraphs( this.data ) );
        this._pie.draw( opts );

        var me = this;
        if( this.animation && !opts.resize ){
            this._pie.grow( function(){
                me.fire("complete");
            } );
        } else {
            this.fire("complete");
        }
        
        this.sprite.addChild( this._pie.sprite );
    }

    show( name )
    {
        this._setEnabled( name, true );
    }

    hide( name )
    {
        this._setEnabled( name, false );
    }

    _setEnabled( name, status )
    {
        var me = this;

        _.each( this.data, function( item ){
            if( item.name === name ){
                item.enabled = status;
                return false;
            }
        } );
     
        me._pie.resetData( me._trimGraphs( me.data ) );
    }

    _dataHandle()
    {
        var me = this;
        var _coor = me.root._coord;

        var data = [];
        var dataFrame = me.dataFrame;
        
        for( var i=0,l=dataFrame.length; i<l; i++ ){
            var rowData = dataFrame.getRowData(i);
            var layoutData = {
                rowData       : rowData,//把这一行数据给到layoutData引用起来
                focused       : false,  //是否获取焦点，外扩
                focusEnabled  : me.node.focus.enabled,

                selected      : false,  //是否选中
                selectEnabled : me.node.select.enabled,
                selectedR     : me.node.select.r,
                selectedAlpha : me.node.select.alpha,
                enabled       : true,   //是否启用，显示在列表中
                value         : rowData[ me.node.value ],
                name          : rowData[ me.node.name ],
                fillStyle     : me.getColorByIndex(me.node.colors, i, l),
                text          : null,    //绘制的时候再设置
                iNode       : i
            };
            data.push( layoutData );
        };

        if( data.length && me.sort ){
            data.sort(function (a, b) {
                if (me.sort == 'desc') {
                    return a.value - b.value;
                } else {
                    return b.value - a.value;
                }
            });

            //重新设定下ind
            _.each( data, function( d, i ){
                d.iNode = i;
            } );
        };

        return data;
    }

    _trimGraphs( data ) 
    {
        var me = this;
        var total = 0;

        me.currentAngle = 0 + me.startAngle % 360;//me.allAngles;
        var limitAngle = me.allAngles + me.startAngle % me.allAngles;

        var percentFixedNum = 2;     
        
        var maxRval = 0;
        var minRval = 0;

        if ( data.length ) {
            //先计算出来value的总量
            for (var i = 0; i < data.length; i++) {
                //enabled为false的secData不参与计算
                if( !data[i].enabled ) continue;

                total += data[i].value;
                if( me.node.r ){
                    maxRval = Math.max( maxRval, data[i].rowData[ me.node.r ]);
                    minRval = Math.min( minRval, data[i].rowData[ me.node.r ]);
                }
            };

            if ( total > 0 ) {
          
                for (var j = 0; j < data.length; j++) {
                    var percentage = data[j].value / total;

                    //enabled为false的sec，比率就设置为0
                    if( !data[j].enabled ){
                        percentage = 0;
                    };
                    
                    var fixedPercentage = +((percentage * 100).toFixed(percentFixedNum));

                    var angle = me.allAngles * percentage;
                    var endAngle = me.currentAngle + angle > limitAngle ? limitAngle : me.currentAngle + angle;
                    var cosV = Math.cos((me.currentAngle + angle / 2) / 180 * Math.PI);
                    var sinV = Math.sin((me.currentAngle + angle / 2) / 180 * Math.PI);
                    var midAngle = me.currentAngle + angle / 2;
                    cosV = cosV.toFixed(5);
                    sinV = sinV.toFixed(5);
                    var quadrant = function (ang) {
                        if (ang >= limitAngle) {
                            ang = limitAngle;
                        }
                        ang = ang % me.allAngles;
                        var angleRatio = parseInt(ang / 90);
                        if (ang >= 0) {
                            switch (angleRatio) {
                                case 0:
                                    return 1;
                                    break;
                                case 1:
                                    return 2;
                                    break;
                                case 2:
                                    return 3;
                                    break;
                                case 3:
                                case 4:
                                    return 4;
                                    break;
                            }
                        } else if (ang < 0) {
                            switch (angleRatio) {
                                case 0:
                                    return 4;
                                    break;
                                case -1:
                                    return 3;
                                    break;
                                case -2:
                                    return 2;
                                    break;
                                case -3:
                                case -4:
                                    return 1;
                                    break;
                            }
                        }
                    } (midAngle);

                    var outRadius = me.node.outRadius;

                    if( me.node.r ){
                        outRadius = parseInt( (me.node.outRadius - me.node.innerRadius) * ( (data[j].rowData[me.node.r] - minRval)/(maxRval-minRval)  ) + me.node.innerRadius );
                    };

                    var moveDis = me.node.moveDis;

                    _.extend(data[j], {
                        outRadius   : outRadius,
                        innerRadius : me.node.innerRadius,
                        startAngle  : me.currentAngle, //起始角度
                        endAngle    : endAngle, //结束角度
                        midAngle    : midAngle,  //中间角度

                        moveDis     : moveDis,

                        outOffsetx  : moveDis * 0.7 * cosV, //focus的事实外扩后圆心的坐标x
                        outOffsety  : moveDis * 0.7 * sinV, //focus的事实外扩后圆心的坐标y

                        centerx     : outRadius * cosV,
                        centery     : outRadius * sinV,
                        outx        : (outRadius + moveDis) * cosV,
                        outy        : (outRadius + moveDis) * sinV,
                        edgex       : (outRadius + moveDis) * cosV,
                        edgey       : (outRadius + moveDis) * sinV,

                        orginPercentage: percentage,
                        percentage: fixedPercentage,
                    
                        quadrant: quadrant, //象限
                        labelDirection: quadrant == 1 || quadrant == 4 ? 1 : 0,
                        iNode: j
                    });

                    //这个时候可以计算下label，因为很多时候外部label如果是配置的
                    data[j].text = me._getLabel( data[j] );
                    
                    me.currentAngle += angle;
                    
                    if (me.currentAngle > limitAngle) {
                        me.currentAngle = limitAngle;
                    }
                };
            }
        }

        return {
            list  : data,
            total : total
        };
    }

    getColorByIndex(colors, iNode, len) 
    {
        if (iNode >= colors.length) {
            //若数据条数刚好比颜色数组长度大1,会导致最后一个扇形颜色与第一个颜色重复
            if ((len - 1) % colors.length == 0 && (iNode % colors.length == 0)) {
                iNode = iNode % colors.length + 1;
            } else {
                iNode = iNode % colors.length;
            }
        };
        return colors[iNode];
    }

    _getLabel( itemData )
    {
        var text;
        if( this.text.enabled ){
            if( this.node.name ){
                text = itemData.rowData[ this.node.name ];
            }
            if( _.isFunction( this.text.format ) ){
                text = this.text.format( itemData )
            }
        }
        return text;
    }

    getList()
    {
        return this.data;
    }

    getLegendData()
    {
        return this.data;
    }

    tipsPointerOf( e ){
    }

    tipsPointerHideOf( e ){
    }



    focusAt( ind ){
        var nodeData = this._pie.data.list[ ind ];

        if( !this.node.focus.enabled ) return;

        this._pie.focusOf( nodeData );
    }
    
    unfocusAt( ind ){
        var nodeData = this._pie.data.list[ ind ];
        if( !nodeData.node.focus.enabled ) return;
        this._pie.unfocusOf( nodeData );
    }
    
    selectAt( ind ){
        var nodeData = this._pie.data.list[ ind ];
        if( !this.node.select.enabled ) return;
        this._pie.selectOf( nodeData );
    }

    unselectAt( ind ){
        var nodeData = this._pie.data.list[ ind ];
        if( !this.node.select.enabled ) return;
        this._pie.unselectOf( nodeData );
    }
    
}