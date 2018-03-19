import Canvax from "canvax2d"
import GraphsBase from "../index"
import DataFrame from "../../utils/dataframe"
import Group from "./group"

const _ = Canvax._;
const Text = Canvax.Display.Text;
const Circle = Canvax.Shapes.Circle;
const Line = Canvax.Shapes.Line;

export default class PlanetGraphs extends GraphsBase
{
    constructor(opts, root)
    {
        super( opts, root );

        this.type = "planet";

        this.field = null;

        var me = this;
        //圆心原点坐标
        this.center ={
            enabled : true,
            text : "center",
            r : 30,
            fillStyle : "#70629e",
            fontSize : 15,
            fontColor: "#ffffff",
            margin : 20 //最近ring到太阳的距离
        };

        this.groupDataFrames = [];
        this.groupField = null;
        this._groups = [];


        //planet自己得grid，不用polar的grid
        this.grid = {
            rings : {
                fillStyle : null,
                strokeStyle: null,
                lineWidth : 1,
                scale: [], //环形刻度线集合
                count: 3 //在 scale.length>1 的时候会被修改为 scale.length
            },
            rays : {
                count : 0,
                lineWidth : 1,
                strokeStyle : "#10519D",
                globalAlpha : 0.4
            }
        };


        _.extend( true, this , opts );

        if( this.center.r == 0 || !this.center.enabled ){
            this.center.r = 0;
            this.center.margin = 0;
            this.center.enabled = false;
        };

        //矫正padding
        var _circleMaxR;
        try{
            _circleMaxR = this.graphs.group.circle.maxR;
        } catch(e){}
        if( _circleMaxR == undefined ){
            _circleMaxR = 30
        };
        root.padding.top = _circleMaxR;
        root.padding.bottom = _circleMaxR;
        root.padding.left = _circleMaxR;
        root.padding.right = _circleMaxR;


        this.init( );
    }

    init()
    {
        this.sprite = new Canvax.Display.Sprite({ 
            id : "graphsEl"
        });
        this.dataGroupHandle();
    }

    draw( opts )
    {
        _.extend( true, this , opts );

        this.drawGroups();

        this.drawCenter();
    
    }

    drawGroups()
    {
        var me = this;

        var groupRStart = this.center.r + this.center.margin;
        
        var maxR = me.root._coord.maxR - me.center.r - me.center.margin;
        _.each( this.groupDataFrames , function( df , i ){
            var toR = groupRStart + maxR*( (df.length) / (me.dataFrame.length) );
            
            var _g = new Group( _.extend(true, {
                iGroup : i,
                groupLen : me.groupDataFrames.length,
                rRange : {
                    start : groupRStart,
                    to : toR
                }
            }, me._opts) , df , me );

            groupRStart = _g.rRange.to;

            me._groups.push( _g );

            me.grid.rings.scale.push({
                r : _g.rRange.to
            });
            
        } );

        me.drawBack();
        
        _.each( me._groups , function(_g){
            me.sprite.addChild( _g.sprite );
        } );
    }

    drawCenter()
    {
        if( this.center.enabled ){
            //绘制中心实心圆
            this._center = new Circle({
                context : {
                    x : this.origin.x,
                    y : this.origin.y,
                    fillStyle : this.center.fillStyle,
                    r : this.center.r
                }
            });
            //绘制实心圆上面的文案
            this._centerTxt = new Text(this.center.text, {
                context: {
                    x: this.origin.x,
                    y: this.origin.y,
                    fontSize: this.center.fontSize,
                    textAlign: "center",
                    textBaseline: "middle",
                    fillStyle: this.center.fontColor
                }
            });
            this.sprite.addChild( this._center );
            this.sprite.addChild( this._centerTxt );
        }
    }

    drawBack(){
        var me = this;
        
        if( me.grid.rings.scale.length == 1 ){

            //如果只有一个，那么就强制添加到3个
            var _diffR = (me.grid.rings.scale[0].r - me.center.r) / me.grid.rings.count;
            me.grid.rings.scale = [];
            for( var i=0;i<me.grid.rings.count ; i++ ){
                me.grid.rings.scale.push({
                    r           : me.center.r + _diffR*(i+1),
                    //lineWidth   : me._getBackProp( me.grid.rings.lineWidth , i),
                    //strokeStyle : me._getBackProp( me.grid.rings.strokeStyle , i),
                    //fillStyle   : me._getBackProp( me.grid.rings.fillStyle , i)
                });
            }
        } else {
            me.grid.rings.count = me.grid.rings.scale.length;
        };

        
        for( var i=me.grid.rings.scale.length-1 ; i>=0 ; i-- ){
            var _scale = me.grid.rings.scale[i];
            me.sprite.addChild( new Circle({
                context : {
                    x : me.root._coord.origin.x,
                    y : me.root._coord.origin.y,
                    r : _scale.r,
                    lineWidth : me._getBackProp( me.grid.rings.lineWidth , i),
                    strokeStyle : me._getBackProp( me.grid.rings.strokeStyle , i),
                    fillStyle: me._getBackProp( me.grid.rings.fillStyle , i)
                }
            }) );
        };

        debugger
        //如果back.rays.count非0， 则绘制从圆心出发的射线
        if( me.grid.rays.count > 1 ){
            var cx = this.root._coord.origin.x;
            var cy = this.root._coord.origin.y;
            var itemAng = 360 / me.grid.rays.count;
            var _r = me.root._coord.maxR; //Math.max( me.w, me.h );

            if( me.grid.rings.scale.length ){
                _r = me.grid.rings.scale.slice(-1)[0].r
            }

            for( var i=0,l=me.grid.rays.count; i<l; i++ ){
                var radian = itemAng*i / 180 * Math.PI;
                var tx = cx + _r * Math.cos( radian );
                var ty = cy + _r * Math.sin( radian );

                me.sprite.addChild( new Line({
                    context : {
                        start : {
                            x : cx,
                            y : cy
                        },
                        end : {
                            x : tx,
                            y : ty
                        },
                      
                        lineWidth : me._getBackProp( me.grid.rays.lineWidth , i),
                        strokeStyle : me._getBackProp( me.grid.rays.strokeStyle , i),
                        globalAlpha : me.grid.rays.globalAlpha
                    }
                }) );

            };
        };
    }

    _getBackProp( p, i )
    {
        
        var iGroup = i;
        var res = null;
        if( _.isFunction( p ) ){
            res = p.apply( this , [ {
                //iGroup : iGroup,
                scaleInd : i,
                count : this.grid.rings.scale.length,

                groups : this._groups,
                graphs : this
            } ] );
        };
        if( _.isString( p ) || _.isNumber( p ) ){
            res = p;
        };
        if( _.isArray( p ) ){
            res = p[i]
        };
        return res
    }

    dataGroupHandle()
    {
        var groupFieldInd = _.indexOf(this.dataFrame.fields , this.groupField);
        if( groupFieldInd >= 0 ){
            //有分组字段，就还要对dataFrame中的数据分下组，然后给到 groupDataFrames
            var titles = this.dataFrame.org[0];
            var _dmap = {}; //以分组的字段值做为key

            _.each( this.dataFrame.org , function( row , i ){
                if( i ){
                    //从i==1 行开始，因为第一行是titles
                    if( !_dmap[ row[groupFieldInd] ] ){
                        //如果没有记录，先创建
                        _dmap[ row[groupFieldInd] ] = [
                            _.clone( titles )
                        ]
                    };
                    _dmap[ row[groupFieldInd] ].push( row );
                }
            } );

            for( var r in _dmap ){
                this.groupDataFrames.push( DataFrame( _dmap[r] ) );
            };
        } else {
            //如果分组字段不存在，则认为数据不需要分组，直接全部作为 group 的一个子集合
            this.groupDataFrames.push( this.dataFrame );
        };
    }

}
