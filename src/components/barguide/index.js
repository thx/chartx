import Component from "../component"
import Canvax from "canvax"
import { _ ,getDefaultProps} from "mmvis"

export default class barGuide extends Component
{
    static defaultProps = {
        field : {
            detail : '字段配置',
            default: null
        },
        barField : {
            detail: '这个guide对应的bar Graph 的field',
            default: null
        },
        yAxisAlign : {
            detail : '这个guide组件回到到哪个y轴',
            default: 'left'
        },
        node : {
            detail : '单个节点配置',
            propertys : {
                shapeType : {
                    detail: '节点绘制的图形类型',
                    default: 'circle'
                },
                lineWidth: {
                    detail : '图表描边线宽',
                    default : 3
                },
                radius: {
                    detail : '图形半径',
                    default: 6
                },
                fillStyle : {
                    detail : '填充色',
                    default: '#19dea1'
                },
                strokeStyle: {
                    detail: '描边色',
                    default: '#fff'
                }
            }
        },

        label: {
            detail : '文本配置',
            propertys : {
                fontSize : {
                    detail : '字体大小',
                    default: 12
                },
                fontColor : {
                    detail : '字体颜色',
                    default: '#19dea1'
                },
                verticalAlign : {
                    detail : '垂直对齐方式',
                    default: 'bottom'
                },
                align : {
                    detail : '水平对齐方式',
                    default: 'center'
                },
                strokeStyle : {
                    detail : '文本描边颜色',
                    default : '#fff'
                },
                lineWidth : {
                    detail : '文本描边线宽',
                    default : 0
                },
                format : {
                    detail : '文本格式处理函数',
                    default : null
                }
            }
        }
    }

    constructor( opt, app )
    {
        super(opt, app);
        this.name = "barGuide";

        this.data = null;
        this.barDatas = null;
        this._yAxis = null;

        this.sprite = null;
        
        _.extend( true, this, getDefaultProps( barGuide.defaultProps ), opt );
        
        this._yAxis = this.app.getComponent({name:'coord'})._yAxis[ this.yAxisAlign=="left"?0:1 ];
        this.sprite  = new Canvax.Display.Sprite();
        this.app.graphsSprite.addChild( this.sprite );
    }

    reset( opt )
    {
        _.extend(true, this , opt );
        this.barDatas = null;
        this.data = null;
        this.sprite.removeAllChildren();
        this.draw();
    }

    draw()
    {
        var me = this;
        
        var _coord = this.app.getComponent({name:'coord'});
        this.pos = {   
            x: _coord.origin.x,
            y: _coord.origin.y
        };
        this.setPosition();

        _.each( me.app.getComponents({name:'graphs'}), function( _g ){
            if( _g.type == "bar" && _g.data[ me.barField ] ){
                me.barDatas = _g.data[ me.barField ];
                return false;
            }
        } );
        
        this.data = _.flatten( me.app.dataFrame.getDataOrg( me.field ) );

        if( !this.barDatas ) {
            return;
        };

        _.each( this.data, function( val, i ){
            var y = -me._yAxis.getPosOfVal( val );
            var barData = me.barDatas[ i ];

            var _node = new Canvax.Shapes.Circle({
                context : {
                    x : barData.x + barData.width/2 ,
                    y : y,
                    r : me.node.radius,
                    fillStyle : me.node.fillStyle,
                    strokeStyle : me.node.strokeStyle,
                    lineWidth : me.node.lineWidth
                }
            });

            var _label = val;
            if( _.isFunction( me.label.format ) ){
                _label = me.label.format( val, barData);
            };
            var _txt = new Canvax.Display.Text( _label , {
                context : {
                    x : barData.x + barData.width/2,
                    y : y - me.node.radius - 1,
                    fillStyle : me.label.fontColor,
                    lineWidth : me.label.lineWidth,
                    strokeStyle: me.label.strokeStyle,
                    fontSize: me.label.fontSize,
                    textAlign   : me.label.align,
                    textBaseline: me.label.verticalAlign,
                }
            } );
 
            me.sprite.addChild( _node );
            me.sprite.addChild( _txt );
        } );
    }

    _getProp( val , tgi, i)
    {
        var res = val;
        if( _.isFunction( val ) ){
            res = val.apply( this, [ tgi, i ] )
        }
        return res;
    }
}