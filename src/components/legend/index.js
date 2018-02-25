import Component from "../component"
import Canvax from "canvax2d"

const Circle = Canvax.Shapes.Circle
const _ = Canvax._;

export default class Legend extends Component
{
    constructor(data, tops, root)
    {
        super();

        this.root = root;
        /* data的数据结构为
        [
            //descartes中用到的时候还会带入yAxis
        {name: "uv", style: "#ff8533", enabled: true, ind: 0, } //外部只需要传field和fillStyle就行了 activate是内部状态
        ]
        */
        this.data = data || [];

        this.width = 0;
        this.height = 0;
        this.tag = {
            height : 20,
            width  : "auto"
        };

        this.icon = {
            r : 5,
            lineWidth : 1,
            fillStyle : "#999"
        };

        this.tips = {
            enabled : false
        };

        this.onChecked=function(){};
        this.onUnChecked=function(){};

        this._labelColor = "#999";

        //this.label = null; // label 格式化函数配置

        this.position = "top" ; //图例所在的方向top,right,bottom,left

        this.layoutType = "h"; //横向 top,bottom --> h left,right -- >v

        this.sprite  = null;

        this.init( tops );
    }

    init( tops )
    {
        if( tops ){
            _.extend(true, this , tops );
        };

        if( this.position == "left" || this.position == "right" ){
            this.layoutType = 'v';
        } else {
            this.layoutType = 'h';
        };

        this.sprite = new Canvax.Display.Sprite({
            id : "LegendSprite"
        });

        this.draw();
    }

    pos( pos )
    {
        pos.x && (this.sprite.context.x = pos.x + this.icon.r);
        pos.y && (this.sprite.context.y = pos.y);
    }

    // label 格式化函数配置
    label( info )
    {
        return info.name;
    }

    draw()
    {
        var me = this;

        var viewWidth = this.root.width - this.root.padding.left - this.root.padding.right;
        var viewHeight = this.root.height - this.root.padding.top - this.root.padding.bottom;

        var maxItemWidth = 0;
        var width=0,height=0;
        var x=0,y=0;
        var rows = 1;

        _.each( this.data , function( obj , i ){
debugger
            var icon   = new Circle({
                id : "legend_field_icon_"+i,
                context : {
                    x     : 0,
                    y     : me.tag.height/2 ,
                    fillStyle : !obj.enabled ? "#ccc" : (obj.color || me._labelColor),
                    r : me.icon.r,
                    cursor: "pointer"
                }
            });
            
            icon.hover(function( e ){
                e.eventInfo = me._getInfoHandler(e,obj);
            } , function(e){
                delete e.eventInfo;
            });
            icon.on("mousemove" , function( e ){
                e.eventInfo = me._getInfoHandler(e,obj);
            });
            //阻止事件冒泡
            
            icon.on("click" , function(){});
            
            var content= me.label(obj);
            var txt    = new Canvax.Display.Text( content , {
                id: "legend_field_txt_"+i,
                context : {
                    x : me.icon.r + 3 ,
                    y : me.tag.height / 2,
                    textAlign : "left",
                    textBaseline : "middle",
                    fillStyle : "#333", //obj.color
                    cursor: "pointer"
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
            var itemW = txtW + me.icon.r*2 + 20;

            maxItemWidth = Math.max( maxItemWidth, itemW );

            var spItemC = {
                height : me.tag.height
            };

            if( me.layoutType == "v" ){
                if( y + me.tag.height > viewHeight ){
                    x += maxItemWidth;
                    y = 0;
                }
                spItemC.x = x;
                spItemC.y = y;
                y += me.tag.height;
                height = Math.max( height , y );
            } else {
                if( x + itemW > viewWidth ){
                    width = Math.max( width, x );
                    x = 0;
                    rows++;
                };
                spItemC.x = x;
                spItemC.y = me.tag.height * (rows-1);
                x += itemW;
            };
            var sprite = new Canvax.Display.Sprite({
                id : "legend_field_"+i,
                context : spItemC
            });
            sprite.addChild( icon );
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

                icon.context.fillStyle = !obj.enabled ? "#ccc" : (obj.color || me._labelColor);

                if( obj.enabled ){
                    me.onChecked( obj.name );
                } else {
                    me.onUnChecked( obj.name );
                }
            });

        } );

        if( this.layoutType == "h" ){
            me.width = me.sprite.context.width  = width;
            me.height = me.sprite.context.height = me.tag.height * rows;
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