import Component from "../component"
import Canvax from "canvax"
import { global,_, getDefaultProps,event} from "mmvis"
import Trigger from "../trigger"

const Circle = Canvax.Shapes.Circle

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
                        default: '#999'
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
            event: {
                detail: '事件配置',
                propertys: {
                    enabled: {
                        detail: '是否开启',
                        default: false
                    },
                    type : {
                        detail: '触发事件的类型',
                        default: 'click'
                    }
                }
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
        var legendData = opt.data;
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

        if( this.direction == "h" ){
            app.padding[ this.position ] += (this.height+this.margin.top+this.margin.bottom);
        } else {
            app.padding[ this.position ] += (this.width+this.margin.left+this.margin.right);
        };

        //default right
        var pos = {
            x : app.width - app.padding.right + this.margin.left,
            y : app.padding.top + this.margin.top
        };
        if( this.position == "left" ){
            pos.x = app.padding.left - this.width + this.margin.left;
        };
        if( this.position == "top" ){
            pos.x = app.padding.left + this.margin.left;
            pos.y = app.padding.top - this.height - this.margin.top;
        };
        if( this.position == "bottom" ){
            pos.x = app.padding.left + this.margin.left;
            pos.y = app.height - app.padding.bottom + this.margin.bottom;
        };

        this.pos = pos;
    }


    draw()
    {
        var _coord = this.app.getComponent({name:'coord'});
        if( _coord && _coord.type == 'rect' ){
            if( this.position == "top" || this.position == "bottom" ){
                this.pos.x = _coord.getSizeAndOrigin().origin.x + this.icon.radius;
            };
        };
        this.setPosition();
    }

    widget()
    {
        var me = this;

        var viewWidth = this.app.width - this.app.padding.left - this.app.padding.right;
        var viewHeight = this.app.height - this.app.padding.top - this.app.padding.bottom;

        var maxItemWidth = 0;
        var width=0,height=0;
        var x=0,y=0;
        var rows = 1;

        var isOver = false; //如果legend过多

        _.each( this.data , function( obj , i ){

            if( isOver ) return;
            
            var _icon = new Circle({
                id : "legend_field_icon_"+i,
                context : {
                    x     : 0,
                    y     : me.icon.height/3 ,
                    fillStyle : !obj.enabled ? "#ccc" : (obj.color || "#999"),
                    r : me.icon.radius,
                    cursor: "pointer"
                }
            });
            
            _icon.on( event.types.get() , function(e){
                if( e.type == 'mouseover' || e.type == 'mousemove' ){
                    e.eventInfo = me._getInfoHandler(e,obj);
                };
                if( e.type == 'mouseout' ){
                    delete e.eventInfo;
                };
            });

            var _text = obj.name;
            if( me.label.format ){
                _text = me.label.format(obj.name, obj);
            };
            
            var txt = new Canvax.Display.Text( _text , {
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
                if( e.type == 'mouseover' || e.type == 'mousemove' ){
                    e.eventInfo = me._getInfoHandler(e,obj);
                };
                if( e.type == 'mouseout' ){
                    delete e.eventInfo;
                };
            });

            var txtW = txt.getTextWidth();
            var itemW = txtW + me.icon.radius*2 + 20;

            maxItemWidth = Math.max( maxItemWidth, itemW );

            var spItemC = {
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
                    
                    width = Math.max( width, x );
                    x = 0;
                    rows++;    
                };
                
                spItemC.x = x;
                spItemC.y = me.icon.height * (rows-1);
                x += itemW;
            };
            var sprite = new Canvax.Display.Sprite({
                id : "legend_field_"+i,
                context : spItemC
            });
            sprite.addChild( _icon );
            sprite.addChild( txt );

            sprite.context.width = itemW;
            me.sprite.addChild(sprite);

            sprite.on( event.types.get() , function( e ){

                if( e.type == me.event.type && me.event.enabled ){
                    //只有一个field的时候，不支持取消
                    if( _.filter( me.data , function(obj){return obj.enabled} ).length == 1 ){
                        if( obj.enabled ){
                            return;
                        }
                    };
                    obj.enabled = !obj.enabled;
                    _icon.context.fillStyle = !obj.enabled ? "#ccc" : (obj.color || "#999");
                    if( obj.enabled ){
                        me.app.show( obj.name , new Trigger( this, obj ) );
                    } else {
                        me.app.hide( obj.name , new Trigger( this, obj ));
                    };
                };

                me.app.fire( e.type, e );

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

    _getInfoHandler(e , data)
    {
        return {
            type : "legend",
            triggerType : 'legend',
            trigger : this,
            tipsEnabled : this.tipsEnabled,
            //title : data.name,
            nodes : [
                {
                    name : data.name,
                    fillStyle : data.color
                }
            ]
        };
    }
}

global.registerComponent( Legend, 'legend' );

export default Legend;