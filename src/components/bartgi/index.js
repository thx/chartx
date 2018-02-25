import Component from "../component"
import Canvax from "canvax2d"

const Line = Canvax.Shapes.Line
const _ = Canvax._;

export default class barTgi extends Component
{
    constructor( opt, root )
    {
        super();

        this._opt = opt;
        this.root = root;

        this.field = null;
        this.barField = null;

        this.data = null;
        this.barDatas = null;
        this._yAxis = null;

        this.yAxisAlign = "left";

        this.sprite = null;

        this.standardVal = 100;
        this.origin = {
            x : 0,
            y : 0
        };
        this.line = {
            lineWidth : 3,
            strokeStyle : function( val, i ){
                if( val >= this.standardVal ){
                    return "#43cbb5"
                } else {
                    return "#ff6060"
                }
            }
        };
        
        this.init( opt );
    }

    init( opt )
    {
        _.extend(true, this , opt );
        this._yAxis = this.root._coordinate._yAxis[ this.yAxisAlign=="left"?0:1 ];
        this.sprite  = new Canvax.Display.Sprite({
            id : "barTgiSprite",
            context : {
                x : this.origin.x,
                y : this.origin.y
            }
        });
    }

    reset( opt )
    {
        _.extend(true, this , opt );
        this.barDatas = null;
        this.data = null;
        this.sprite.removeAllChildren();
        this.draw();
    }

    draw()
    {
        var me = this;

        _.each( me.root._graphs, function( _g ){
            if( _g.type == "bar" && _g.data[ me.barField ] ){
                me.barDatas = _g.data[ me.barField ];
                return false;
            }
        } );
        this.data = _.flatten( me.root.dataFrame.getDataOrg( me.field ) );

        if( !this.barDatas ) {
            return;
        }

        _.each( this.data, function( tgi, i ){
            var y = me._yAxis.getYposFromVal( tgi );
            var barData = me.barDatas[ i ];

            var _tgiLine = new Line({
                context: {
                    start : {
                        x : barData.x,
                        y : y
                    },
                    end : {
                        x : barData.x + barData.width,
                        y : y
                    },
                    lineWidth: 2,
                    strokeStyle: me._getProp( me.line.strokeStyle, tgi, i )
                }
            });
            me.sprite.addChild( _tgiLine );
        } );
    }

    _getProp( val , tgi, i)
    {
        var res = val;
        if( _.isFunction( val ) ){
            res = val.apply( this, [ tgi, i ] )
        }
        return res;
    }
}