import Canvax from "canvax2d"
import Pie from "./pie"


const _ = Canvax._;

export default class PieGraphs extends Canvax.Event.EventDispatcher
{
    constructor( opts, root )
    {
        super( opts, root );

        this.type = "pie";

        //这里所有的opts都要透传给 group
        this._opts = opts || {};
        this.root = root;

        this.valueField = null;
        this.nameField = null;
        this.rField = null;//如果有配置rField，那么每个pie的outRadius都会不一样


        this.width = 0;
        this.height = 0;
        this.origin = {
            x : 0,
            y : 0
        }

        this.innerRadius = 0;
        this.outRadius = null; //如果有配置rField（丁格尔玫瑰图）,则outRadius代表最大radius
        this.minSectorRadius = 20; //outRadius - innerRadius 的最小值

        this.startAngle = -90;
        //要预留moveDis位置来hover sector 的时候外扩
        this.moveDis = 15;

        this.groups = [];

        this.init( opts );
    }

    init( opts )
    {
        _.extend(true, this, opts);
        this.sprite = new Canvax.Display.Sprite();
    }

    _computerProps()
    {
        var w = this.width;
        var h = this.height;

        //TODO：如果用户有配置outRadius的话，就按照用户的来，目前不做修正
        if( !this.outRadius ){
            var outRadius = Math.min(w, h) / 2;
            if (this.label && this.label.enabled) {
                //要预留moveDis位置来hover sector 的时候外扩
                outRadius -= this.moveDis;
            };
            this.outRadius = parseInt( outRadius );
        };

        //要保证sec具有一个最小的radius
        if( this.outRadius - this.innerRadius < this.minSectorRadius ){
            this.innerRadius = this.outRadius - this.minSectorRadius;
        };

    }

    /**
     * opts ==> {width,height,origin}
     */
    draw( opts ) 
    {
        _.extend(true, this, opts);
        this._computerProps();
        this.data = this._trimGraphs();
    
        this._pie = new Pie( this._opts, this );
        this.groups.push( this._pie );
        this._pie.draw( opts, this.data );
        this.sprite.addChild( this._pie.sprite );
    }

    _trimGraphs()
    {
        var me = this;
        var _coor = this.root._coordinate;

        var data = [];
        var dataFrame = me.root.dataFrame;
        
        for( var i=0,l=dataFrame.org.length-1; i<l; i++ ){
            var rowData = dataFrame.getRowData(i);
            var layoutData = {
                rowData : rowData,//把这一行数据给到layoutData引用起来
                sliced  : false,  //是否获取焦点，外扩
                checked : false,  //是否选中
                enabled : true,   //是否启用，显示在列表中
                value   : rowData[ this.valueField ],
                label   : null    //绘制的时候再设置
            }
            data.push( layoutData );
        };

        if( data.length && this.sort ){
            data.sort(function (a, b) {
                if (me.sort == 'desc') {
                    return a.value - b.value;
                } else {
                    return b.value - a.value;
                }
            });
        };

        return this._configData(data);
    }

    _configData( data ) 
    {
        var me = this;
        var total = 0;

        me.currentAngle = 0 + me.startAngle % 360;
        var limitAngle = 360 + me.startAngle % 360;

        var percentFixedNum = 2;     
        
        var maxRval = 0;
        var minRval = 0;

        if ( data.length ) {
            //先计算出来value的总量
            for (var i = 0; i < data.length; i++) {
                total += data[i].value;
                if( me.rField ){
                    maxRval = Math.max( maxRval, data[i].rowData[ me.rField ]);
                    minRval = Math.min( minRval, data[i].rowData[ me.rField ]);
                }
            };

            if (total > 0) {
          
                for (var j = 0; j < data.length; j++) {
                    var percentage = data[j].value / total;
                    var fixedPercentage = +((percentage * 100).toFixed(percentFixedNum));

                    var angle = 360 * percentage;
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
                        ang = ang % 360;
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

                    var outRadius = me.outRadius;

                    if( me.rField ){
                        outRadius = parseInt( (me.outRadius - me.innerRadius) * ( (data[j].rowData[me.rField] - minRval)/(maxRval-minRval)  ) + me.innerRadius );
                    }

                    _.extend(data[j], {
                        outRadius : outRadius,
                        innerRadius : me.innerRadius,
                        start: me.currentAngle, //起始角度
                        end: endAngle, //结束角度
                        midAngle: midAngle,  //中间角度

                        outOffsetx: me.moveDis * 0.7 * cosV, //focus的事实外扩后圆心的坐标x
                        outOffsety: me.moveDis * 0.7 * sinV, //focus的事实外扩后圆心的坐标y

                        centerx: outRadius * cosV,
                        centery: outRadius * sinV,
                        outx: (outRadius + me.moveDis) * cosV,
                        outy: (outRadius + me.moveDis) * sinV,
                        edgex: (outRadius + me.moveDis) * cosV,
                        edgey: (outRadius + me.moveDis) * sinV,

                        orginPercentage: percentage,
                        percentage: fixedPercentage,
                    
                        quadrant: quadrant, //象限
                        labelDirection: quadrant == 1 || quadrant == 4 ? 1 : 0,
                        index: j
                    });

                    //这个时候可以计算下label，因为很多时候外部label如果是配置的
                    data[j].label = me._getLabel( data[j] );
                    
                    me.currentAngle += angle;
                    
                    if (me.currentAngle > limitAngle) {
                        me.currentAngle = limitAngle;
                    }
                };

            }
        }

        return {
            list : data,
            total : total
        };
    }

    _getLabel( itemData )
    {
        var label;
        if( this.label.enabled ){
            if( this.nameField ){
                label = itemData.rowData[ this.nameField ];
            }
            if( _.isFunction( this.label.format ) ){
                label = this.label.format( itemData )
            }
        }
        return label;
    }

}
