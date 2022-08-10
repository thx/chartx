import Canvax from "canvax"
import GraphsBase from "../index"
import cloudLayout from "../../../layout/cloud"
import {getDefaultProps} from "../../../utils/tools"

let {_,event} = Canvax;
let Text = Canvax.Display.Text;

class CloudGraphs extends GraphsBase
{
    static defaultProps(){
        return {
            field : {
                detail : '字段配置',
                default: null
            },
            node : {
                detail : '节点文字配置',
                propertys : {
                    fontFamily : {
                        detail: '字体设置',
                        default: 'Impact'
                    },
                    fontColor : {
                        detail: '文字颜色',
                        default: '#999'
                    },
                    fontSize : {
                        detail: '文本字体大小',
                        default: function(){
                            //fontSize默认12-50的随机值
                            return this.minFontSize + Math.random() * this.maxFontSize;
                        }
                    },
                    maxFontSize: {
                        detail: '文本最大字体大小',
                        default: 30
                    },
                    minFontSize: {
                        detail: '文本最小字体大小',
                        default: 16
                    },
                    fontWeight: {
                        detail : 'fontWeight',
                        default: 'normal'
                    },
                    format : {
                        detail: '文本格式化处理函数',
                        default: null
                    },
                    padding : {
                        detail: '文本间距',
                        default: 10
                    },
                    rotation : {
                        detail: '文本旋转角度',
                        default: function(){
                            return (~~(Math.random() * 6) - 3) * 30;
                        }
                    },
                    strokeStyle: {
                        detail: '文本描边颜色',
                        default: null
                    },
                    select : {
                        detail: '文本选中效果',
                        propertys: {
                            enabled: {
                                detail: '是否开启选中',
                                default: true
                            },
                            lineWidth: {
                                detail: '选中后的文本描边宽',
                                default: 2
                            },
                            strokeStyle: {
                                detail: '选中后的文本描边色',
                                default: '#666'
                            }
                        }
                    },
                    focus : {
                        detail: '文本hover效果',
                        propertys: {
                            enabled: {
                                detail: '是否开启hover效果',
                                default: true
                            }
                        }
                    }
                }
            }
        }
    }
    constructor(opt, app)
    {
        super( opt, app );

        this.type = "cloud";
        let me = this;

        //坚持一个数据节点的设置都在一个node下面
        this.node = {
            _maxFontSizeVal : 0, //fontSizer如果配置为一个field的话， 找出这个field数据的最大值
            _minFontSizeVal : null,//fontSizer如果配置为一个field的话， 找出这个field数据的最小值
        };

        _.extend( true, this , getDefaultProps( CloudGraphs.defaultProps() ), opt );

        this.node.fontColor = function( nodeData ){
            return me.app.getTheme( nodeData.iNode )
        };
        this.init( );
    }

    init()
    {

    }

    draw( opt )
    {
        !opt && (opt ={});
        _.extend( true, this , opt );
        this._drawGraphs();
        this.sprite.context.x = this.width / 2;
        this.sprite.context.y = this.height / 2;

        this.fire("complete");
    }

    getDaraFrameIndOfVal( val )
    {
        let me = this;
        let df = this.dataFrame;
        let org = _.find( df.data, function( d ){
            return d.field == me.field;
        } );
        let ind = _.indexOf( org.data, val );
        return ind;
    }

    _getFontSize( rowData )
    {
        let size = this.node.minFontSize;

        if( _.isFunction( this.node.fontSize ) ){
            size = this.node.fontSize( rowData );
        };

        if( _.isString( this.node.fontSize ) && this.node.fontSize in rowData ){
            let val = Number( rowData[ this.node.fontSize ] );
            if( !isNaN( val ) ){
                size = this.node.minFontSize + (this.node.maxFontSize-this.node.minFontSize)/(this.node._maxFontSizeVal - this.node._minFontSizeVal) * (val - this.node._minFontSizeVal);
            }
        }

        if( _.isNumber( this.node.fontSize ) ){
            size = this.node.fontSize;
        }
        
        return size;
    }

    _getRotate( item, ind )
    {
        let rotation = this.node.rotation;
        if( _.isFunction( this.node.rotation ) ){
            rotation = this.node.rotation( item, ind ) || 0;
        };
        return rotation;
    }

    _getFontColor( nodeData )
    {
        let color;
        if( _.isString( this.node.fontColor ) ){
            color = this.node.fontColor;
        }
        if( _.isFunction( this.node.fontColor ) ){
            color = this.node.fontColor( nodeData );
        }

        if( color === undefined || color === null ){
            //只有undefined才会认为需要一个抄底色
            //“”都会认为是用户主动想要设置的，就为是用户不想他显示
            color = "#ccc"
        };
        return color;
    }

    _drawGraphs() 
    {
        let me = this;

        //查找fontSize的max和min
        //let maxFontSizeVal = 0;
        //let minFontSizeVal = 0;
        if( _.isString( this.node.fontSize ) ){
            _.each( me.dataFrame.getFieldData( this.node.fontSize ), function( val ){
                me.node._maxFontSizeVal = Math.max( me.node._maxFontSizeVal, val );
                me.node._minFontSizeVal = Math.min( me.node._minFontSizeVal, val );
            } );
        }

        let layout = cloudLayout()
            .size([me.width, me.height])
            .words(me.dataFrame.getFieldData( me.field ).map(function( txt, ind) {
                //这里不能直接用i去从dataFrame里查询,因为cloud layout后，可能会扔掉渲染不下的部分
                let rowData  = me.app.dataFrame.getRowDataAt( me.getDaraFrameIndOfVal( txt ) );
                let tag = {
                    type      : "cloud",
                    rowData   : rowData,
                    field     : me.field,
                    name      : "", //tips中就不会显示name
                    value     : txt,
                    text      : null,
                    size      : me._getFontSize( rowData, txt ),
                    iNode     : ind,
                    color     : null, //在绘制的时候统一设置
                    __no__name: true
                };

                tag.fontColor = me._getFontColor( tag );

                let _txt = txt;
                if( me.node.format ){
                    _txt = me.node.format( txt, tag );
                } else {
                    //否则用fieldConfig上面的
                    let _coord = me.app.getComponent({name:'coord'});
                    let fieldConfig = _coord.getFieldConfig( me.field );
                    if(fieldConfig ){
                        _txt = fieldConfig.getFormatValue( txt );
                    };
                };
                tag.text = _txt || txt;

                return tag
            }))
            .padding( me.node.padding )
            .rotate(function(item , ind) {
                //return 0;
                return me._getRotate( item, ind )
            })
            .font(me.node.fontFamily)
            .fontSize(function(d) {
                return d.size;
            })
            .on("end", draw);

        layout.start();

        function draw( data ) {
            
            me.data = data;
            me.sprite.removeAllChildren()
        
            _.each(data, function(tag, i) {
                
                tag.iNode  = i;
                tag.dataLen  = data.length;
            
                tag.focused  = false;
                tag.selected = false;

                let tagTxt = new Text(tag.text, {
                    context: {
                        x: tag.x,
                        y: tag.y,
                        fontSize: tag.size,
                        fontFamily: tag.font,
                        rotation: tag.rotate,
                        textBaseline: "middle",
                        textAlign: "center",
                        cursor: 'pointer',
                        fontWeight: me.node.fontWeight,
                        fillStyle: tag.fontColor
                    }
                });
                me.sprite.addChild(tagTxt);

                me.node.focus.enabled && tagTxt.hover(function(){
                    me.focusAt( this.nodeData.iNode );
                } , function(){
                    !this.nodeData.selected && me.unfocusAt( this.nodeData.iNode );
                });

                tagTxt.nodeData = tag;
                tag._node = tagTxt;
                tagTxt.on(event.types.get(), function(e) {
                    e.eventInfo = {
                        trigger : 'this.node',
                        title : null,
                        nodes : [ this.nodeData ]
                    };
                    if( this.nodeData.text ){
                        e.eventInfo.title = '';//this.nodeData.text;
                    };
    
                    //fire到root上面去的是为了让root去处理tips
                    me.app.fire( e.type, e );

                    
                });
            });

        }
    }


    focusAt( ind ){
        let nodeData = this.data[ ind ];
        if( !this.node.focus.enabled || nodeData.focused ) return;

        let nctx = nodeData._node.context; 
        nctx.fontSize += 3;
        nodeData.focused = true;
    }
    
    unfocusAt( ind ){
        let nodeData = this.data[ ind ];
        if( !this.node.focus.enabled || !nodeData.focused ) return;
        let nctx = nodeData._node.context; 
        nctx.fontSize -= 3;
        nodeData.focused = false;
    }
    
    selectAt( ind ){
        
        let nodeData = this.data[ ind ];
        if( !this.node.select.enabled || nodeData.selected ) return;

        let nctx = nodeData._node.context; 
        nctx.lineWidth = this.node.select.lineWidth;
        nctx.strokeAlpha = this.node.select.strokeAlpha;
        nctx.strokeStyle = this.node.select.strokeStyle;

        nodeData.selected = true;
    }

    unselectAt( ind ){
        let nodeData = this.data[ ind ];
        if( !this.node.select.enabled || !nodeData.selected ) return;
        let nctx = nodeData._node.context; 
        nctx.strokeStyle = this.node.strokeStyle;

        nodeData.selected = false;
    }

}

GraphsBase.registerComponent( CloudGraphs, 'graphs', 'cloud' );

export default CloudGraphs;
