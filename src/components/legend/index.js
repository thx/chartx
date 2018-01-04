import Component from "../component"
import Canvax from "canvax2d"
//import Tips from "../tips/index"

const Circle = Canvax.Shapes.Circle
const _ = Canvax._;

export default class Legend extends Component
{
    constructor(data , opt)
    {
        super();

        /* data的数据结构为
        [
            //descartes中用到的时候还会带入yAxis
        {field: "uv", style: "#ff8533", enabled: true, ind: 0, } //外部只需要传field和fillStyle就行了 activate是内部状态
        ]
        */
        this.data = data || [];

        this.width = 0;
        this.height = 0;
        this.tag = {
            height : 20
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

        this.layoutType = "h"; //横向 horizontal--> h

        this.sprite  = null;

        this.init( opt );
    }

    init( opt )
    {
        if( opt ){
            _.extend(true, this , opt );
        };
        this.sprite = new Canvax.Display.Sprite({
            id : "LegendSprite"
        });

        this.draw();
    }

    pos( pos )
    {
        pos.x && (this.sprite.context.x = pos.x);
        pos.y && (this.sprite.context.y = pos.y);
    }

    // label 格式化函数配置
    label( info )
    {
        return info.field;
    }

    draw()
    {
        var me = this;

        var width = 0,height = 0;
        _.each( this.data , function( obj , i ){

            var icon   = new Circle({
                id : "lenend_field_icon_"+i,
                context : {
                    x     : 0,
                    y     : me.tag.height/2 ,
                    fillStyle : !obj.enabled ? "#ccc" : (obj.style || me._labelColor),
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
                id: "lenend_field_txt_"+i,
                context : {
                    x : me.icon.r + 3 ,
                    y : me.tag.height / 2,
                    textAlign : "left",
                    textBaseline : "middle",
                    fillStyle : "#333", //obj.style
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

            var spItemC = {
                height : me.tag.height
            };

            if( me.layoutType == "v" ){
                height += me.tag.height;
                spItemC.y = height;
                width = Math.max( width , itemW );
            } else {
                height = me.tag.height
                spItemC.x = width ;
                width += itemW;
            };
            var sprite = new Canvax.Display.Sprite({
                id : "lenend_field_"+i,
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

                icon.context.fillStyle = !obj.enabled ? "#ccc" : (obj.style || me._labelColor);

                

                if( obj.enabled ){
                    me.onChecked( obj.field );
                } else {
                    me.onUnChecked( obj.field );
                }
            });

        } );

        //向后兼容有
        me.width = me.sprite.context.width  = width;
        me.height = me.sprite.context.height = height;
    }

    _getInfoHandler(e , data)
    {
        return {
            type : "legend",
            title : data.field,
            nodesInfoList: [
                {
                    field : data.field,
                    fillStyle : data.style
                }
            ]
        };
    }
}