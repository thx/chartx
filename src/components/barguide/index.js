import Component from "../component"
import Canvax from "canvax"
import { _ } from "mmvis"

export default class barGuide extends Component
{

    constructor( opt, app )
    {
        super(opt, app);

        this.name = "barGuide";

        this.field = null;
        this.barField = null;

        this.data = null;
        this.barDatas = null;
        this._yAxis = null;

        this.yAxisAlign = "left";

        this.sprite = null;

        this.node = {
            lineWidth : 3,
            shapeType : "circle",
            radius : 6,
            fillStyle : "#19dea1",
            strokeStyle : "#fff",
            lineWidth : 2,
        };
        this.label = {
            fontSize : 12,
            fontColor: "#19dea1",
            verticalAlign: "bottom",
            align: "center",
            strokeStyle : "#fff",
            lineWidth : 0,
            format : function( value, nodeData ){
                return value;
            }
        };
        
        _.extend(true, this , opt );
        
        this._yAxis = this.app.getComponent({name:'coord'})._yAxis[ this.yAxisAlign=="left"?0:1 ];
        this.sprite  = new Canvax.Display.Sprite();
        this.app.graphsSprite.addChild( this.sprite );
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
        
        var _coord = this.app.getComponent({name:'coord'});
        this.pos = {   
            x: _coord.origin.x,
            y: _coord.origin.y
        };
        this.setPosition();

        _.each( me.app.getComponents({name:'graphs'}), function( _g ){
            if( _g.type == "bar" && _g.data[ me.barField ] ){
                me.barDatas = _g.data[ me.barField ];
                return false;
            }
        } );
        
        this.data = _.flatten( me.app.dataFrame.getDataOrg( me.field ) );

        if( !this.barDatas ) {
            return;
        };

        _.each( this.data, function( val, i ){
            var y = -me._yAxis.getPosOfVal( val );
            var barData = me.barDatas[ i ];

            var _node = new Canvax.Shapes.Circle({
                context : {
                    x : barData.x + barData.width/2 ,
                    y : y,
                    r : me.node.radius,
                    fillStyle : me.node.fillStyle,
                    strokeStyle : me.node.strokeStyle,
                    lineWidth : me.node.lineWidth
                }
            });

            var _txt = new Canvax.Display.Text( me.label.format( val, barData) , {
                context : {
                    x : barData.x + barData.width/2,
                    y : y - me.node.radius - 1,
                    fillStyle : me.label.fontColor,
                    lineWidth : me.label.lineWidth,
                    strokeStyle: me.label.strokeStyle,
                    fontSize: me.label.fontSize,
                    textAlign   : me.label.align,
                    textBaseline: me.label.verticalAlign,
                }
            } );
 
            me.sprite.addChild( _node );
            me.sprite.addChild( _txt );
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