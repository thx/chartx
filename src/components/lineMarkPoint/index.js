import Component from "../component"
import Canvax from "canvax"
import { getDefaultProps } from "../../utils/tools"

let _ = Canvax._;
let Rect = Canvax.Shapes.Rect;

class lineMarkPoint extends Component
{
    static defaultProps(){
        return {
            lineField : {
                detail : '对应的line字段',
                default: null
            },
            xValue: {
                detail : '在lineFile字段的折线上对应点的x轴的值',
                default: null
            },
            line: {
                detail: 'line的配置',
                propertys: {
                    enabled: {
                        detail: '是否要指示线',
                        default: true
                    },
                    lineWidth : {
                        detail : '线宽',
                        default: 2
                    },
                    strokeStyle: {
                        detail : '线颜色',
                        default: '#ccc'
                    },
                    lineLength: {
                        detail : '线的长度，也就是label到line的距离',
                        default: 8
                    },
                    lineDis: {
                        detail: 'line到折线上面node的距离',
                        default: 3
                    }
                }
            },
            label: {
                detail: 'markpoint标注的文本配置',
                propertys: {
                    text: {
                        detail: 'label内容',
                        default: ''
                    },
                    fontSize: {
                        detail: 'label的文本大小',
                        default: 12
                    },
                    fontColor: {
                        detail: '文本颜色',
                        default: '#666'
                    },
                    background: {
                        detail: 'label的background配置',
                        propertys: {
                            enabled: {
                                detail: 'label是否需要背景',
                                default: true
                            },
                            fillStyle: {
                                detail: 'label的背景颜色',
                                default: '#f5f5f6'
                            },
                            radius: {
                                detail: 'label的背景圆角',
                                default: 6
                            },
                            strokeStyle: {
                                detail: 'label的背景边框颜色',
                                default: '#f5f5f6'
                            },
                            lineWidth: {
                                detail: '背景描边',
                                default: 1
                            },
                            padding:  {
                                detail: 'background和label之间的距离',
                                default: 6
                            }
                        }
                    }
                    
                }
            },
            position: {
                detail: '在线的方向，online（线上边） or offline（线下方），默认自动计算',
                default: 'auto'
            }
        }
    }

    constructor( opt, app )
    {
        super(opt, app);
        this.name = "lineMarkPoint";

        _.extend(true, this , getDefaultProps( lineMarkPoint.defaultProps() ), opt );

        this.lineDatas = null;
        this.sprite = new Canvax.Display.Sprite();
        this.app.graphsSprite.addChild( this.sprite );
    }

    reset( opt )
    {
        _.extend(true, this , opt );
        this.lineDatas = null;
        this.sprite.removeAllChildren();
        this.draw();
    }

    draw()
    {
        let me = this;
        
        let _coord = this.app.getComponent({name:'coord'});
        this.pos = {   
            x: _coord.origin.x,
            y: _coord.origin.y
        };
        this.setPosition();

        let lineGraphs = me.app.getComponent({
            name  : 'graphs',
            type  : "line",
            field : me.lineField
        });

        me.lineDatas = lineGraphs.data[ me.lineField ].data;

        let iNode = this.app.getComponent({name : "coord"}).getAxis({type: "xAxis"}).getIndexOfVal( this.xValue );
        
        if( iNode == -1 ){
            return;
        };

        let nodeData = this.lineDatas[iNode];
        let preNodeData = iNode ? this.lineDatas[iNode-1] : null;
        let nextNodeData = iNode == me.lineDatas.length ? null : this.lineDatas[iNode+1];

        if( nodeData.y != undefined ){
            
            let x = nodeData.x;

            let _txtSp = new Canvax.Display.Sprite({
                context : {
                    x : x
                }
            });
            this.sprite.addChild( _txtSp );
            let txtHeight = 0;

            let _label = new Canvax.Display.Text( me.label.text, {
                context : {
                    fillStyle : this.label.fontColor,
                    fontSize  : this.label.fontSize,
                    textAlign : 'center',
                    textBaseline: 'top'
                } 
            } );
            _txtSp.addChild( _label );
            txtHeight = _label.getTextHeight();
            let txtWidth = _label.getTextWidth();

            let _bgRect;
            let padding = 0;
            //如果有背景，那么就要加上背景的padding
            if( this.label.background.enabled ){
                padding = this.label.background.padding;

                txtHeight += padding*2;
                txtWidth  += padding*2;
                _txtSp.context.x -= padding; //sp的y会在下面单独计算好
                _label.context.x += padding;
                _label.context.y += padding;

                let r = me.label.background.radius;

                //添加一下背景
                _bgRect = new Rect({
                    context: {
                        x: -txtWidth/2 + padding,
                        width: txtWidth,
                        height: txtHeight,
                        radius: [r,r,r,r],
                        fillStyle: me.label.background.fillStyle,
                        strokeStyle: me.label.background.strokeStyle,
                        lineWidth: me.label.background.lineWidth
                    }
                });
                _txtSp.addChild( _bgRect,0 );
            };

            if( txtWidth/2 + x > _coord.width){
                _txtSp.context.x = _coord.width;
                _label.context.textAlign = "right";
                _bgRect && (_bgRect.context.x -= (txtWidth/2-padding));
            };
            if( x - txtWidth/2 < 0 ){
                _txtSp.context.x = 0;
                _label.context.textAlign = "left";
                _bgRect && (_bgRect.context.x += (txtWidth/2-padding));
            };

            //计算y的位置
            let {y, pointList} = me._getNodeYandLinePointList( nodeData, preNodeData, nextNodeData, _coord, txtHeight );

            _txtSp.context.y = y;

            if( me.line.enabled ){
                let _line = new Canvax.Shapes.BrokenLine({
                    context : {
                        pointList: pointList,
                        strokeStyle : me.line.strokeStyle,
                        lineWidth : me.line.lineWidth
                    }
                });
                me.sprite.addChild( _line,0 );
            }
        }
    }

    _getNodeYandLinePointList(nodeData, preNodeData, nextNodeData, _coord, txtHeight){
    
        let appHeight = this.app.height;
        let coordHeight = _coord.height;
        let y = nodeData.y;
        let lineLength = !this.line.enabled ? 3 : this.line.lineLength;
        let lineDis = this.line.lineDis;  //line到node的距离
      debugger
        let position = "online";
        if( this.position == 'auto' ){
            if( (preNodeData && preNodeData.y < nodeData.y) || (nextNodeData && nextNodeData.y < nodeData.y) ){
                position = 'offline';//在线的下方
            };
            if( position == "online" && Math.abs( y )+lineLength+lineDis+txtHeight > coordHeight ){
                //在上面但是超过了坐标系顶部空间
                position = "offline"
            };
            if( position == "offline" && Math.abs( y ) < lineLength+txtHeight+lineDis ){
                //在线下面，但是超出了坐标系底部空间
                position = "online"
            };
        } else {
            position = this.position;
        };

        let top = 0;
        if( position == "online" ){
            top = y - lineLength - lineDis - txtHeight;
        } else {
            top = y + lineDis + lineLength;
        };

        //默认offline
        let pointList =[ [ nodeData.x, top ], [ nodeData.x, nodeData.y+lineDis ] ]
        if( position == "online" ){
            pointList =[ [ nodeData.x, top+txtHeight ], [ nodeData.x, nodeData.y-lineDis ] ]
        };
        
        return {
            y: top,
            pointList
        };
    }

}

Component.registerComponent( lineMarkPoint, 'lineMarkPoint' );

export default lineMarkPoint