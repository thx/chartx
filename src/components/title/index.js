import Component from "../component"
import Canvax from "canvax"
import Trigger from "../trigger"
import {getDefaultProps} from "../../utils/tools"

let { _,event} = Canvax;

class Title extends Component
{
    static defaultProps(){
        return {
            position : {
                detail : '图例位置',
                documentation: '默认top-left,可选top-right',
                default: 'top-left'
            },
            text :{
                detail : '标题内容',
                default: ''
            },
            textStyle: {
                detail: '主标题样式',
                propertys: {
                    fontColor : {
                        detail : '字体颜色',
                        default: '#666'
                    },
                    fontSize  : {
                        detail: '字体大小',
                        default: '14'
                    },
                    style: {
                        detail: '样式集合',
                        default: null
                    }
                }
            },
            desc : {
                detail : '描述内容',
                default: ''
            },
            descStyle: {
                detail : '描述的样式',
                propertys: {
                    fontColor : {
                        detail : '字体颜色',
                        default: '#999'
                    },
                    fontSize  : {
                        detail: '字体大小',
                        default: '12'
                    },
                    style: {
                        detail: '样式集合',
                        default: null
                    }
                }
            },
            margin: {
                propertys : {
                    bottom: {
                        default: 10
                    }
                }
            }
        }
    }

    constructor(opt, app)
    {
        super(opt, app);
        this.name = "title";

        _.extend( true, this, getDefaultProps( Title.defaultProps() ), opt );

        this.sprite = new Canvax.Display.Sprite({
            id : "titleSprite",
            context: {}
        });
        this.app.stage.addChild( this.sprite );

        this.widget();
        //图例是需要自己绘制完成后，才能拿到高宽来设置自己的位置
        this.layout();

    }

    widget()
    {
        let textAlign = "left";
        if( this.text ){
            let txtStyle = this._getProp( this.textStyle ) || {};
            let txt = new Canvax.Display.Text( this.text , {
                id: "title_txt",
                context : {
                    x: this.margin.left,
                    y: this.margin.top,
                    fillStyle: txtStyle.fontColor || this.text.fontColor,
                    fontSize: this.text.fontSize,
                    textAlign,
                    textBaseline: 'bottom'
                }
            } );
            for( let p in txtStyle ){
                if( p in txt.context ){
                    txt.context[ p ] = txtStyle[ p ];
                }
            };
            this.sprite.addChild( txt );
            this.width += txt.getTextWidth() + 6;
            this.height += txt.getTextHeight();
            txt.context.y = this.height;
        }
        
        if( this.desc ){
            let descStyle = this._getProp( this.descStyle ) || {};
            let desc = new Canvax.Display.Text( this.desc , {
                id: "title_txt",
                context : {
                    x: this.width + this.margin.left,
                    y: this.height,
                    fillStyle: descStyle.fontColor || this.text.fontColor,
                    fontSize: this.text.fontSize,
                    textAlign,
                    textBaseline: 'bottom'
                }
            } );
            for( let p in descStyle ){
                if( p in desc.context ){
                    desc.context[ p ] = descStyle[ p ];
                }
            }

            this.sprite.addChild( desc );
            this.width += desc.getTextWidth();
            this.height = Math.max( desc.getTextHeight(), this.height );
            desc.context.y = this.height;
        }

    }

    layout(){
        let app = this.app;

        let height = this.height+this.margin.top+this.margin.bottom;

        let x = app.padding.left;
        let y = app.padding.top;

        if( this.position == "top-left" ){
            x = app.padding.left;
        };
        if( this.position == "top-right" ){
            x = app.width - app.padding.right - this.margin.right - this.width;
        };

        app.padding.top += height;

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
            if( this.position == 'top-right' ){
                //this.pos.x = 
            } else {
                this.pos.x = _coord.getSizeAndOrigin().origin.x;
            }
        };
        this.setPosition();
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

Component.registerComponent( Title, 'title' );

export default Title;