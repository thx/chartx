/**
 * 水印组件
 */
import Canvax from "canvax"
import { global,_,getDefaultProps } from "mmvis"
import Component from "../component"

class waterMark extends Component
{
    static defaultProps(){
        return {
            text : {
                detail : '水印内容',
                default: 'chartx'
            },
            fontSize: {
                detail : '字体大小',
                default: 20
            },
            fontColor : {
                detail : '水印颜色',
                default: '#cccccc'
            },
            alpha : {
                detail: '水印透明度',
                default: 0.2
            },
            rotation : {
                detail: '水印旋转角度',
                default: 45
            }
        }
    }

    constructor( opt , app )
    {
        super( opt , app );
        this.name = "waterMark";

        this.width = this.app.width;
        this.height = this.app.height;

        _.extend( true, this, getDefaultProps( waterMark.defaultProps() ) , opt );

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

global.registerComponent( waterMark, 'waterMark' );

export default waterMark;