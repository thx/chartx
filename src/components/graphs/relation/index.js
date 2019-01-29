import Canvax from "canvax"
import GraphsBase from "../index"
import { _, event, getDefaultProps } from "mmvis"

const AnimationFrame = Canvax.AnimationFrame;
const Rect = Canvax.Shapes.Rect;

/**
 * 关系图中 包括了  配置，数据，和布局数据，
 * 默认用配置和数据可以完成绘图， 但是如果有布局数据，就绘图玩额外调用一次绘图，把布局数据传入修正布局效果
 */

export default class Relation extends GraphsBase
{
    static defaultProps(){
        return {
            keyField : {
                detail : 'key字段设置',
                documentation : '',
                default: null
            },
            parentField : {
                detail : '用来描述edge的parentField字段设置',
                documentation : '',
                default: null
            },
        }
    }

    constructor(opt, app)
    {
        super(opt, app);
        this.type = "relation";

        _.extend( true, this , getDefaultProps( Relation.defaultProps() ), opt );

        this.init();
    }

    init()
    {
        this.nodesSp = new Canvax.Display.Sprite({
            id: "nodesSp"
        });
        this.edgesSp = new Canvax.Display.Sprite({
            id: "nodesSp"
        });
        this.sprite.addChild( this.nodesSp );
        this.sprite.addChild( this.edgesSp );
        debugger
    }

    getNodesAt(index)
    {
        //该index指当前
        var data = this.data;
        
        var _nodesInfoList = []; //节点信息集合
        _.each( this.enabledField, function( fs, i ){
            if( _.isArray(fs) ){
                _.each( fs, function( _fs, ii ){
                    //fs的结构两层到顶了
                    var nodeData = data[ _fs ] ? data[ _fs ][ index ] : null;
                    nodeData && _nodesInfoList.push( nodeData );
                } );
            } else {
                var nodeData = data[ fs ] ? data[ fs ][ index ] : null;
                nodeData && _nodesInfoList.push( nodeData );
            }
        } );
        
        return _nodesInfoList;
    }

}