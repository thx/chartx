/**
 * 水印组件
 */
import Canvax from "canvax"

const Text = Canvax.Display.Text;
const _ = Canvax._;

export default class waterMark
{
    constructor( opts , root )
    {
        this.root = root;
        this.width = root.width;
        this.height = root.height;

        this.text = "chartx";
        this.fontSize = 20;
        this.fontColor = "#ccc";
        this.strokeStyle = "#ccc";
        this.lineWidth = 0;
        this.alpha = 0.2;
        this.rotation = 45;

        _.extend( true, this, opts );

        this.init();
    }

    init()
    {
        this.spripte = new Canvax.Display.Sprite({
            id : "watermark"
        });

        this.draw();
    }

    draw()
    {

        var textEl = new Canvax.Display.Text( this.text , {
            context: {
                fontSize    : this.fontSize,
                fillStyle   : this.fontColor
            }
        });

        var textW = textEl.getTextWidth();
        var textH = textEl.getTextHeight();

        var rowCount = parseInt(this.height / (textH*5)) +1;
        var coluCount = parseInt(this.width / (textW*1.5)) +1;

        for( var r=0; r< rowCount; r++){
            for( var c=0; c< coluCount; c++){
                //TODO:text 的 clone有问题
                //var cloneText = textEl.clone();
                var _textEl = new Canvax.Display.Text( this.text , {
                    context: {
                        rotation    : this.rotation,
                        fontSize    : this.fontSize,
                        strokeStyle : this.strokeStyle,
                        lineWidth   : this.lineWidth,
                        fillStyle   : this.fontColor,
                        globalAlpha : this.alpha
                    }
                });
                _textEl.context.x = textW*1.5*c + textW*.25;
                _textEl.context.y = textH*5*r;
                this.spripte.addChild( _textEl );
            }
        }

    }
}