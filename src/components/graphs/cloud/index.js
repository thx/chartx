import Canvax from "canvax2d"
import GraphsBase from "../index"
import cloudLayout from "../../../layout/cloud"

const _ = Canvax._;
const Text = Canvax.Display.Text;

export default class CloudGraphs extends GraphsBase
{
    constructor(opts, root)
    {
        super( opts, root );

        this.type = "cloud";

        this.field = null;

        var me = this;
        this.node = {
            shapeType   : "text", //节点的现状可以是圆 ，也可以是rect，也可以是三角形，后面两种后面实现
            fontFamily  : "Impact",
            fontColor   : function( nodeData ){
                return me.root._theme[ nodeData.iNode % (me.root._theme.length-1) ]
                //return me.root._theme[ nodeData.iNode % nodeData.dataLen ]
            },
            fontSize    : function(){
                //fontSize默认12-50的随机值
                return this.minFontSize + Math.random() * this.maxFontSize;
            },
            maxFontSize : 38,
            _maxFontSizeVal : 0, //fontSizer如果配置为一个field的话， 找出这个field数据的最大值
            minFontSize : 12,
            _minFontSizeVal : null,//fontSizer如果配置为一个field的话， 找出这个field数据的最小值

            fontWeight : "normal",

            format : function( str ){ return str},

            padding : 10,

            rotate : function(){
                return (~~(Math.random() * 6) - 3) * 30;
            },

            strokeStyle: null,
            focus : {
                enabled : true
            },
            select : {
                enabled : true,
                lineWidth : 2,
                strokeStyle : "#666"
            }
        };

        _.extend( true, this , opts );

        this.init( );
    }

    init()
    {
        this.sprite = new Canvax.Display.Sprite({ 
            id : "graphsEl"
        });
    }

    draw( opts )
    {
        !opts && (opts ={});
        _.extend( true, this , opts );
        this._drawGraphs();
        this.sprite.context.x = this.width / 2;
        this.sprite.context.y = this.height / 2;

        this.fire("complete");
    }

    getDaraFrameIndOfVal( val )
    {
        var me = this;
        var df = this.dataFrame;
        var org = _.find( df.data, function( d ){
            return d.field == me.field;
        } );
        var ind = _.indexOf( org.data, val );
        return ind;
    }

    _getFontSize( rowData, val )
    {
        var size = this.node.minFontSize;

        if( _.isFunction( this.node.fontSize ) ){
            size = this.node.fontSize( rowData );
        };

        if( _.isString( this.node.fontSize ) && this.node.fontSize in rowData ){
            var val = Number( rowData[ this.node.fontSize ] );
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
        var rotate = this.node.rotate;
        if( _.isFunction( this.node.rotate ) ){
            rotate = this.node.rotate() || 0;
        }
        return rotate;
    }

    _getFillStyle( nodeData )
    {
        var color;
        if( _.isString( this.node.fontColor ) ){
            color = this.node.fontColor;
        }
        if( _.isFunction( this.node.fontColor ) ){
            color = this.node.fontColor( nodeData );
        }
        if( !color ){
            color = "#ccc"
        }
        return color;
    }

    _drawGraphs() 
    {
        var me = this;

        //查找fontSize的max和min
        var maxFontSizeVal = 0;
        var minFontSizeVal = null;
        if( _.isString( this.node.fontSize ) ){
            _.each( me.dataFrame.getFieldData( this.node.fontSize ), function( val ){
                me.node._maxFontSizeVal = Math.max( me.node._maxFontSizeVal, val );
                if( me.node._minFontSizeVal === null ){
                    me.node._minFontSizeVal = val
                } else {
                    me.node._minFontSizeVal = Math.min( me.node._minFontSizeVal, val );
                }
            } );
        }

        var layout = cloudLayout()
            .size([me.width, me.height])
            .words(me.dataFrame.getFieldData( me.field ).map(function(d, ind) {
                var rowData  = me.root.dataFrame.getRowData( me.getDaraFrameIndOfVal( d ) );//这里不能直接用i去从dataFrame里查询,因为cloud layout后，可能会扔掉渲染不下的部分
                return {
                    rowData : rowData,
                    field   : me.field,
                    value   : d,
                    text    : me.node.format(d) || d,
                    size    : me._getFontSize( rowData, d ),
                    iNode   : ind
                };
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

        function draw( data , e ) {
            
            me.data = data;
            me.sprite.removeAllChildren()
        
            _.each(data, function(tag, i) {
                
                tag.iNode  = i;
                tag.dataLen  = data.length;
            
                tag.focused  = false;
                tag.selected = false;

                var tagTxt = new Text(tag.text, {
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
                        fillStyle: me._getFillStyle( tag )
                    }
                });
                me.sprite.addChild(tagTxt);

                me.node.focus.enabled && tagTxt.hover(function(e){
                    me.focusAt( this.nodeData.iNode );
                } , function(e){
                    !this.nodeData.selected && me.unfocusAt( this.nodeData.iNode );
                });

                tagTxt.nodeData = tag;
                tag._node = tagTxt;
                tagTxt.on("mousedown mouseup panstart mouseover panmove mousemove panend mouseout tap click dblclick", function(e) {
                    
                    e.eventInfo = {
                        title : null,
                        nodes : [ this.nodeData ]
                    };
                    if( this.nodeData.text ){
                        e.eventInfo.title = this.nodeData.text;
                    };
    
                    //fire到root上面去的是为了让root去处理tips
                    me.root.fire( e.type, e );
                    me.triggerEvent( me.node , e );
                });
            });

        }
    }


    focusAt( ind ){
        var nodeData = this.data[ ind ];
        if( !this.node.focus.enabled || nodeData.focused ) return;

        var nctx = nodeData._node.context; 
        nctx.fontSize += 3;
        nodeData.focused = true;
    }
    
    unfocusAt( ind ){
        var nodeData = this.data[ ind ];
        if( !this.node.focus.enabled || !nodeData.focused ) return;
        var nctx = nodeData._node.context; 
        nctx.fontSize -= 3;
        nodeData.focused = false;
    }
    
    selectAt( ind ){
        
        var nodeData = this.data[ ind ];
        if( !this.node.select.enabled || nodeData.selected ) return;

        var nctx = nodeData._node.context; 
        nctx.lineWidth = this.node.select.lineWidth;
        nctx.lineAlpha = this.node.select.lineAlpha;
        nctx.strokeStyle = this.node.select.strokeStyle;

        nodeData.selected = true;
    }

    unselectAt( ind ){
        var nodeData = this.data[ ind ];
        if( !this.node.select.enabled || !nodeData.selected ) return;
        var nctx = nodeData._node.context; 
        nctx.strokeStyle = this.node.strokeStyle;

        nodeData.selected = false;
    }

}
