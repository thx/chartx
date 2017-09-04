import Component from "../component"
import Canvax from "canvax2d"
import Tips from "../tips/index"
import _ from "underscore"

var Circle = Canvax.Shapes.Circle

export default class Legend extends Component
{
    constructor(data , opt)
    {
        super();

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

        //this.label = null; //label格式化函数配置

        this.layoutType = "h"; //横向 horizontal--> h

        this.sprite  = null;

        this.init( opt );
    }

    init( opt )
    {
        if( opt ){
            _.deepExtend( this , opt );
        };
        this.sprite = new Canvax.Display.Sprite({
            id : "LegendSprite"
        });

        this._widget();
    }

    pos( pos )
    {
        pos.x && (this.sprite.context.x = pos.x);
        pos.y && (this.sprite.context.y = pos.y);
    }

    draw(opt)
    {
        //this._widget();
    }

    _showTips(e)
    {
        if( this._hideTimer ){
            clearTimeout( this._hideTimer );
        };
        this._hideTimer = null;

        if( !this._legendTip ){
            this._legendTip = new Canvax.Display.Sprite({
                id: 'legend_tip'
            });
            var stage = this.sprite.getStage();
            stage.addChild( this._legendTip );
            this._tips = new Tips(this.tips, stage.parent.domView);
            this._tips._getDefaultContent = function(info) {
                return info.field;
            };
            this._legendTip.addChild( this._tips.sprite );
        };
        this._tips.show(e);
    }

    _hide(e)
    {
        var me = this;
        this._hideTimer = setTimeout(function(){
            me._tips.hide();
        } , 300);
    }

    //label格式化函数配置
    label( info )
    {
        return info.field+"："+info.value;
    }

    setStyle( field , style )
    {
        var me = this;
        _.each( this.data , function( obj , i ){
            if( obj.field == field ){
                if( style.fillStyle ){
                    obj.fillStyle = style.fillStyle;
                    var icon = me.sprite.getChildById("lenend_field_"+i).getChildById("lenend_field_icon_"+i);
                    icon.context.fillStyle = style.fillStyle;
                };
            };
        } );
    }

    getStyle( field )
    {
        var me = this;
        var data = null;
        _.each( this.data , function( obj , i ){
            if( obj.field == field ){
                data = obj;
            };
        } );
        return data;
    }

    _widget()
    {
        var me = this;

        var width = 0,height = 0;
        _.each( this.data , function( obj , i ){

            //如果外面没有设置过，就默认为激活状态
            if( obj.activate == undefined || obj.activate ){
                obj.activate = true;
            } else {
                obj.activate = false;
            };

            var icon   = new Circle({
                id : "lenend_field_icon_"+i,
                context : {
                    x     : 0,
                    y     : me.tag.height/2 ,
                    fillStyle : obj.activate ? "#ccc" : (obj.fillStyle || me._labelColor),
                    r : me.icon.r,
                    cursor: "pointer"
                }
            });
            icon.hover(function( e ){
                me._showTips( me._getInfoHandler(e,obj) );
            } , function(e){
                me._hide(e);
            });
            icon.on("mousemove" , function( e ){
                me._showTips( me._getInfoHandler(e,obj) );
            });
            icon.on("click" , function(){});
            
            var content= me.label(obj);
            var txt    = new Canvax.Display.Text( content , {
                id: "lenend_field_txt_"+i,
                context : {
                    x : me.icon.r + 3 ,
                    y : me.tag.height / 2,
                    textAlign : "left",
                    textBaseline : "middle",
                    fillStyle : "#333", //obj.fillStyle
                    cursor: "pointer"
                }
            } );
        
            txt.hover(function( e ){
                me._showTips( me._getInfoHandler(e,obj) );
            } , function(e){
                me._hide(e);
            });
            txt.on("mousemove" , function( e ){
                me._showTips( me._getInfoHandler(e,obj) );
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
                if( _.filter( me.data , function(obj){return obj.activate} ).length == 1 ){
                    if( obj.activate ){
                        return;
                    }
                };
                
                icon.context.fillStyle = obj.activate ? "#ccc" : (obj.fillStyle || me._labelColor)
                obj.activate = !obj.activate;
                if( obj.activate ){
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
        e.eventInfo = {
            field : data.field,
            fillStyle : data.fillStyle
        };
        if( data.value ) {
            e.eventInfo.value = data.value;
        };
        return e;
    }
}