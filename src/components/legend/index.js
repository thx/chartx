import Component from "../component"
import Canvax from "canvax"
import { _ } from "mmvis"

const Circle = Canvax.Shapes.Circle

export default class Legend extends Component
{
    constructor(opt, app)
    {
        super(opt, app);

        this.type = 'legend';

        /* data的数据结构为
        [
            //descartes中用到的时候还会带入yAxis
            {name: "uv", color: "#ff8533", field: '' ...如果手动传入数据只需要前面这三个 enabled: true, ind: 0, } //外部只需要传field和fillStyle就行了 activate是内部状态
        ]
        */
        this.data = this._getLegendData(opt);

        this.width = 0;
        this.height = 0;

        //一般来讲，比如柱状图折线图等，是按照传入的field来分组来设置图例的，那么legend.field都是null
        //但是还有一种情况就是，是按照同一个field中的数据去重后来分组的，比如散点图中sex属性的男女两个分组作为图例，
        //以及pie饼图中的每个数据的name字段都是作为一个图例
        //那么就想要给legend主动设置一个field字段，然后legend自己从dataFrame中拿到这个field的数据来去重，然后分组做为图例
        //这是一个很屌的设计
        this.field = null;

        this.icon = {
            height : 26,
            width  : "auto",
            shapeType : "circle",
            radius : 5,
            lineWidth : 1,
            fillStyle : "#999",
            onChecked : function(){},
            onUnChecked : function(){}
        };

        this.label = {
            textAlign : "left",
            textBaseline : "middle",
            fillStyle : "#333", //obj.color
            cursor: "pointer",
            format : function( name, info ){
                return name
            }
        };

        //this.onChecked=function(){};
        //this.onUnChecked=function(){};

        this._labelColor = "#999";
        this.position = "top" ; //图例所在的方向top,right,bottom,left
        this.direction = "h"; //横向 top,bottom --> h left,right -- >v

        _.extend(true, this , {
            icon : {
                onChecked : function( obj ){
                    app.show( obj.name , obj );
                    app.componentsReset({ name : "legend" });
                },
                onUnChecked : function( obj ){
                    app.hide( obj.name , obj );
                    app.componentsReset({ name : "legend" });
                }
            }
        }, opt );
        debugger
        this._layout();
        this.sprite = new Canvax.Display.Sprite({
            id : "LegendSprite",
            context: {
                x: this.pos.x,
                y: this.pos.y
            }
        });
        this.widget();

    }

    _getLegendData( opt ){
        var legendData = opt.data;
        if( legendData ){
            _.each( legendData, function( item, i ){
                item.enabled = true;
                item.ind = i;
            } );
            delete opt.data;
        } else {
            legendData = this.app.getLegendData();
        };
        return legendData || [];
    }

    _layout(){
        let app = this.app;
        if( !this._opt.direction && this._opt.position ){
            if( this.position == "left" || this.position == "right" ){
                this.direction = 'v';
            } else {
                this.direction = 'h';
            };
        };

        if( this.direction == "h" ){
            app.padding[ this.position ] += this.height;
        } else {
            app.padding[ this.position ] += this.width;
        };

        //default right
        var pos = {
            x : app.width - app.padding.right,
            y : app.padding.top
        };
        if( this.position == "left" ){
            pos.x = app.padding.left - this.width;
        };
        if( this.position == "top" ){
            pos.x = app.padding.left;
            pos.y = app.padding.top - this.height;
        };
        if( this.position == "bottom" ){
            pos.x = app.padding.left;
            //TODO: this.icon.height 这里要后续拿到单个图例的高，现在默认26
            pos.y = app.height - app.padding.bottom + 26/2;
        };

        this.pos = pos;
    }


    draw()
    {
        if( this.app._coord && this.app._coord.type == 'rect' ){
            if( this.position == "top" || this.position == "bottom" ){
                var x = this.app._coord.getSizeAndOrigin().origin.x;
                this.sprite.context.x = x + this.icon.radius
            }
        };
        
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
                    fillStyle : !obj.enabled ? "#ccc" : (obj.color || me._labelColor),
                    r : me.icon.radius,
                    cursor: "pointer"
                }
            });
            
            _icon.hover(function( e ){
                e.eventInfo = me._getInfoHandler(e,obj);
            } , function(e){
                delete e.eventInfo;
            });
            _icon.on("mousemove" , function( e ){
                e.eventInfo = me._getInfoHandler(e,obj);
            });
            //阻止事件冒泡
            
            _icon.on("click" , function(){});
            
            var txt = new Canvax.Display.Text( me.label.format(obj.name, obj) , {
                id: "legend_field_txt_"+i,
                context : {
                    x : me.icon.radius + 3 ,
                    y : me.icon.height / 3,
                    textAlign : me.label.textAlign, //"left",
                    textBaseline : me.label.textBaseline, //"middle",
                    fillStyle : me.label.fillStyle, //"#333", //obj.color
                    cursor: me.label.cursor //"pointer"
                }
            } );
        
            txt.hover(function( e ){
                e.eventInfo = me._getInfoHandler(e,obj);
            } , function(e){
                delete e.eventInfo;
            });
            txt.on("mousemove" , function( e ){
                e.eventInfo = me._getInfoHandler(e,obj);
            });
            txt.on("click" , function(){});

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

            sprite.on("click" , function( e ){

                //只有一个field的时候，不支持取消
                if( _.filter( me.data , function(obj){return obj.enabled} ).length == 1 ){
                    if( obj.enabled ){
                        return;
                    }
                };
                
                obj.enabled = !obj.enabled;

                _icon.context.fillStyle = !obj.enabled ? "#ccc" : (obj.color || me._labelColor);

                if( obj.enabled ){
                    me.icon.onChecked( obj );
                } else {
                    me.icon.onUnChecked( obj );
                }
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