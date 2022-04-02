import Component from "../component"
import Canvax from "canvax"
import Trigger from "../trigger"
import {getDefaultProps} from "../../utils/tools"

let { _,event} = Canvax;
let Circle = Canvax.Shapes.Circle;
let Rect = Canvax.Shapes.Rect;

class Legend extends Component
{
    static defaultProps(){
        return {
            data : {
                detail : '图例数据',
                default: [],
                documentation: '\
                    数据结构为：{name: "uv", color: "#ff8533", field: "" ...}\
                    如果手动传入数据只需要前面这三个 enabled: true, ind: 0\
                    外部只需要传field和fillStyle就行了\
                    '
            },
            position : {
                detail : '图例位置',
                documentation: '图例所在的方向top,right,bottom,left',
                default: 'top'
            },
            direction: {
                detail : '图例布局方向',
                default: 'h',
                documentation: '横向 top,bottom --> h left,right -- >v'
            },
            textAlign: {
                detail : '水平方向的对其，默认居左对其',
                default: 'left',
                documentation: '可选left，center，right'
            },
            verticalAlign: {
                detail : '垂直方向的对其方式，默认居中（待实现）',
                default: 'middle',
                documentation: '可选top，middle，bottom'
            },
            icon : {
                detail : '图标设置',
                propertys : {
                    height : {
                        detail : '高',
                        default : 26
                    },
                    width : {
                        detail : '图标宽',
                        default : 'auto'
                    },
                    shapeType : {
                        detail : '图标的图形类型，目前只实现了圆形',
                        default: 'circle'
                    },
                    radius : {
                        detail : '图标（circle）半径',
                        default: 5
                    },
                    lineWidth : {
                        detail : '图标描边宽度',
                        default: 1
                    },
                    fillStyle : {
                        detail : '图标颜色，一般会从data里面取，这里是默认色',
                        default: null
                    } 
                }
            },
            label : {
                detail : '文本配置',
                propertys: {
                    textAlign :{
                        detail : '水平对齐方式',
                        default: 'left'
                    }, 
                    textBaseline : {
                        detail : '文本基线对齐方式',
                        default: 'middle'
                    },
                    fontColor : {
                        detail : '文本颜色',
                        default: '#333333'
                    },
                    cursor : {
                        detail : '鼠标样式',
                        default: 'pointer'
                    },
                    format : {
                        detail : '文本格式化处理函数',
                        default: null
                    }
                }
            },

            triggerEventType: {
                detail: '触发事件',
                default:'click,tap'
            },
            
            activeEnabled: {
                detail: '是否启动图例的交互事件',
                default: true
            },
            tipsEnabled: {
                detail: '是否开启图例的tips',
                default: false
            }
        }
    }

    constructor(opt, app)
    {
        super(opt, app);
        this.name = "legend";

        _.extend( true, this, getDefaultProps( Legend.defaultProps() ), opt );

        /* data的数据结构为
        [
            //descartes中用到的时候还会带入yAxis
            {name: "uv", color: "#ff8533", field: '' ...如果手动传入数据只需要前面这三个 enabled: true, ind: 0, } //外部只需要传field和fillStyle就行了 activate是内部状态
        ]
        */
        this.data = this._getLegendData(opt);

        //this.position = "top" ; //图例所在的方向top,right,bottom,left
        //this.direction = "h"; //横向 top,bottom --> h left,right -- >v
        if( !opt.direction && opt.position ){
            if( this.position == "left" || this.position == "right" ){
                this.direction = 'v';
            } else {
                this.direction = 'h';
            };
        };

        this.sprite = new Canvax.Display.Sprite({
            id : "LegendSprite",
            context: {
                x: this.pos.x,
                y: this.pos.y
            }
        });
        this.app.stage.addChild( this.sprite );

        this.widget();

        //图例是需要自己绘制完成后，才能拿到高宽来设置自己的位置
        this.layout();

    }

    _getLegendData( opt ){
        
        let legendData = opt.data;
        if( legendData ){
            _.each( legendData, function( item, i ){
                item.enabled = true;
                item.ind = i;
            } );
            //delete opt.data;
        } else {
            legendData = this.app.getLegendData();
        };
        return legendData || [];
    }

    layout(){
        let app = this.app;

        let width = this.width+this.margin.left+this.margin.right;
        let height = this.height+this.margin.top+this.margin.bottom;

        let x = app.padding.left;
        let y = app.padding.top;

        if( this.position == "right" ){
            x = app.width - app.padding.right - width;
        };
        if( this.position == "bottom" ){
            y = app.height - app.padding.bottom - height + (this.icon.height / 2); //TODO:这样的设置到了中线了
        };

        let layoutWidth,layoutHeight;

        //然后把app的padding扩展开来
        if( this.position == "left" || this.position == "right" ){
            // v
            app.padding[ this.position ] += width;

            layoutWidth = width;
            layoutHeight = app.height - app.padding.top - app.padding.bottom;

        } else if( this.position == "top" || this.position == "bottom") {
            // h
            app.padding[ this.position ] += height;

            layoutWidth = app.width - app.padding.right - app.padding.left;
            layoutHeight = height;
        };

        //然后计算textAlign,上面的pos.x 已经是按照默认的left计算过了的
        if( this.textAlign == 'center' ){
            x += layoutWidth/2 - this.width/2;
        };
        if( this.textAlign == 'right' ){
            x += layoutWidth - this.width;
        };

        this.pos = {
            x,y
        };

        return this.pos;
    }


    draw()
    {
        //为了在直角坐标系中，让 textAlign left的时候，图例和坐标系左侧对齐， 好看点, 用心良苦啊
        let _coord = this.app.getComponent({name:'coord'});
        if( _coord && _coord.type == 'rect' ){
            if( this.textAlign == "left" && (this.position == "top" || this.position == "bottom") ){
                this.pos.x = _coord.getSizeAndOrigin().origin.x + this.icon.radius;
            };
        };
        this.setPosition();
    }

    widget()
    {
    
        let me = this;

        let viewWidth = this.app.width - this.app.padding.left - this.app.padding.right;
        let viewHeight = this.app.height - this.app.padding.top - this.app.padding.bottom;

        let maxItemWidth = 0;
        let width=0,height=0;
        let x=0,y=0;
        let rows = 1;

        let isOver = false; //如果legend过多

        _.each( this.data , function( obj , i ){

            if( isOver ) return;

            let _icon = me._getIconNodeEl(obj, i);
            _icon.on( event.types.get() , function(e){
                //... 代理到sprit上面处理
            });

            let _text = obj.name;
            if( me.label.format ){
                _text = me.label.format(obj.name, obj);
            };
            
            let txt = new Canvax.Display.Text( _text , {
                id: "legend_field_txt_"+i,
                context : {
                    x : me.icon.radius + 3 ,
                    y : me.icon.height / 3,
                    textAlign : me.label.textAlign, //"left",
                    textBaseline : me.label.textBaseline, //"middle",
                    fillStyle : me.label.fontColor, //"#333", //obj.color
                    cursor: me.label.cursor //"pointer"
                }
            } );
        
            txt.on(event.types.get() , function(e){
                //... 代理到sprit上面处理
            });

            let txtW = txt.getTextWidth();
            let itemW = txtW + me.icon.radius*2 + 20;

            maxItemWidth = Math.max( maxItemWidth, itemW );

            let spItemC = {
                height : me.icon.height
            };

            if( me.direction == "v" ){
                if( y + me.icon.height > viewHeight ){
                    if( x > viewWidth*0.3 ){
                        isOver = true;
                        return;
                    };
                    x += maxItemWidth;
                    y = 0;
                };
                spItemC.x = x;
                spItemC.y = y;
                y += me.icon.height;
                height = Math.max( height , y );
            } else {
                //横向排布

                if( x + itemW > viewWidth ){
                    if( me.icon.height * (rows+1) > viewHeight*0.3 ){
                        isOver = true;
                        return;
                    };
                    x = 0;
                    rows++;    
                };
                
                spItemC.x = x;
                spItemC.y = me.icon.height * (rows-1);
                x += itemW;

                width = Math.max( width, x );
            };
            let sprite = new Canvax.Display.Sprite({
                id : "legend_field_"+i,
                context : spItemC
            });
            sprite.addChild( _icon );
            sprite.addChild( txt );

            sprite.context.width = itemW;
            me.sprite.addChild(sprite);

            sprite.on( event.types.get() , function( e ){

                if( me.triggerEventType.indexOf( e.type ) > -1 && me.activeEnabled ){
                    //只有一个field的时候，不支持取消
                    if( _.filter( me.data , function(obj){return obj.enabled} ).length == 1 ){
                        if( obj.enabled ){
                            return;
                        }
                    };
                    obj.enabled = !obj.enabled;
                    _icon.context.fillStyle = !obj.enabled ? "#ccc" : (obj.color || "#999");
                    if( obj.enabled ){
                        me.app.show( obj.field , new Trigger( this, obj ) );
                    } else {
                        me.app.hide( obj.field , new Trigger( this, obj ));
                    };
                };

                if( me.tipsEnabled ){
                    if( e.type == 'mouseover' || e.type == 'mousemove' ){
                        e.eventInfo = me._getInfoHandler(e,obj);
                    };
                    if( e.type == 'mouseout' ){
                        delete e.eventInfo;
                    };
                    me.app.fire( e.type, e );
                };

            });

        } );

        if( this.direction == "h" ){
            me.width = me.sprite.context.width  = width;
            me.height = me.sprite.context.height = me.icon.height * rows;
        } else {
            me.width = me.sprite.context.width  = x + maxItemWidth;
            me.height = me.sprite.context.height = height;
        }
        //me.width = me.sprite.context.width  = width;
        //me.height = me.sprite.context.height = height;
    }

    _getIconNodeEl(obj, i){
        let fillStyle = !obj.enabled ? "#ccc" : (obj.color || "#999");
        if( this.icon.fillStyle ){
            let _fillStyle = this._getProp( this.icon.fillStyle, obj );
            if( _fillStyle ){
                fillStyle = _fillStyle;
            }
        };

        let el;

        if( obj.type == 'line' ){
            el = new Rect({
                id : "legend_field_icon_"+i,
                context : {
                    x     : -this.icon.radius,
                    y     : this.icon.height / 3 - 1 ,
                    fillStyle : fillStyle,
                    width : this.icon.radius*2,
                    height: 2,
                    cursor: "pointer"
                }
            });
        } else if( obj.type == 'bar' ){
            el = new Rect({
                id : "legend_field_icon_"+i,
                context : {
                    x     : -this.icon.radius,
                    y     : this.icon.height / 3 - this.icon.radius ,
                    fillStyle : fillStyle,
                    width : this.icon.radius*2,
                    height: this.icon.radius*2,
                    radius: [3,3,3,3],
                    cursor: "pointer"
                }
            });
        } else {
            el = new Circle({
                id : "legend_field_icon_"+i,
                context : {
                    x     : 0,
                    y     : this.icon.height / 3 ,
                    fillStyle : fillStyle,
                    r : this.icon.radius,
                    cursor: "pointer"
                }
            });
        };
        
        return el;
    }

    _getInfoHandler(e , data)
    {
        return {
            type : "legend",
            triggerType : 'legend',
            trigger : this,
            tipsEnabled : this.tipsEnabled,
            nodes : [
                {
                    name : data.name,
                    fillStyle : data.color
                }
            ]
        };
    }

    _getProp( prop, nodeData )
    {
        let _prop = prop;
        if( _.isArray( prop ) ){
            _prop = prop[ nodeData.ind ]
        };
        if( _.isFunction( prop ) ){
            _prop = prop.apply( this, [nodeData] );
        };
        return _prop;
    }
}

Component.registerComponent( Legend, 'legend' );

export default Legend;