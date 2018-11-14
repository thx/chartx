import Component from "../component"
import Canvax from "canvax"
import { _ } from "mmvis"

export default class barGuide extends Component
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

        this.origin = {
            x : 0,
            y : 0
        };
        this.node = {
            lineWidth : 3,
            shapeType : "circle",
            r : 10,

            strokeStyle : "#000",
            lineWidth : 2,
        };
        this.label = {
            fontSize : 14,
            fontColor: "#ccc",

            strokeStyle : "#000",
            lineWidth : 2
        };
        
        _.extend(true, this , opt );
        
        this._yAxis = this.root._coord._yAxis[ this.yAxisAlign=="left"?0:1 ];
        this.sprite  = new Canvax.Display.Sprite({
            id : "barGuideSprite",
            context : {
                x : this.origin.x,
                y : this.origin.y
            }
        });
    }


    static register( opt,app )
    {
        
        if( !_.isArray( opt ) ){
            opt = [ opt ];
        };

        var barGuideConstructor = this;

        _.each( opt , function( barGuideOpt, i ){
            app.components.push( {
                type : "once",
                plug : {
                    draw: function(){

                        barGuideOpt = _.extend( true, {
                            origin: {
                                x: app._coord.origin.x,
                                y: app._coord.origin.y
                            }
                        } , barGuideOpt );

                        var _barGuide = new barGuideConstructor( barGuideOpt, app );
                        app.components.push( {
                            type : "barGuide",
                            plug : _barGuide
                        } ); 
                        app.graphsSprite.addChild( _barGuide.sprite );

                    }
                }
            } );
        } );
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
            var y = -me._yAxis.getPosOfVal( tgi );
            var barData = me.barDatas[ i ];

            var _node = new Canvax.Shapes.Circle({
                context : {
                    x : barData.x,
                    y : y,
                    r : 10,
                    fillStyle : "red"
                }
            })
 
            me.sprite.addChild( _node );
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