/**
 * 水印组件
 */
import Canvax from "canvax"
import { _ } from "mmvis"
import Component from "../component"

const Text = Canvax.Display.Text;

export default class waterMark extends Component
{
    constructor( opt , app )
    {
        super( opt , app );
        
        this.name = "watermark";

        this.width = this.app.width;
        this.height = this.app.height;

        this.text = "chartx";
        this.fontSize = 20;
        this.fontColor = "#ccc";
        this.strokeStyle = "#ccc";
        this.lineWidth = 0;
        this.alpha = 0.2;
        this.rotation = 45;

        _.extend( true, this, opt );

        this.spripte = new Canvax.Display.Sprite({
            id : "watermark"
        });
        this.app.stage.addChild( this.spripte );
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