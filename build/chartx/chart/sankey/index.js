define(
	"chartx/chart/sankey/index", [
		'chartx/chart/index',
		'chartx/layout/sankey/index',
		'canvax/shape/Rect',
		'canvax/shape/Path',
		'chartx/components/tips/tip'
	],
	function(Chart, Layout, Rect, Path , Tips) {
		var Canvax = Chart.Canvax;
		var Sanky = Chart.extend({
			init: function(el, data, opts) {
				this._el = el;
				this._data = data;
				this._opts = opts;
				this.nodeField = "node";
				this.edgeField = "edge"
				this.dataFrame = {
					nodes : [],
					links : []
				};
				this.tips = {};
				this._lastLevMaxLen = 0;
				this.colors = ["#ff8533","#73ace6","#82d982","#e673ac","#cd6bed","#8282d9","#c0e650","#e6ac73","#6bcded","#73e6ac","#ed6bcd","#9966cc"]
				_.deepExtend(this, opts);
			},
			draw: function() {
				this.dataFrame = this.dataFormat(this._data);
				this.padding.right += this._lastLevMaxLen;
				this.layoutData = this.getLayoutData();
				this._setStages();
				this.drawNodes();
				this.drawLinks();
				this.drawLabels();
			},
			dataFormat: function( data ){
				var me = this;
                var df = {nodes : [] , links: []};
                var nodeInd,edgeInd;
                var nodeMap={  }//{盖伦：0}
                _.each( data , function( row , i ){
                    if( i == 0 ){
                    	_.each( row , function( field , ii ){
                            if( field == me.nodeField ){
                            	nodeInd = ii;
                            };
                            if( field == me.edgeField ){
                            	edgeInd = ii;
                            };
                    	} );
                    } else {
                        df.nodes.push( {name:row[ nodeInd ]} );
                        nodeMap[ row[ nodeInd ] ] = i-1;

                        _.each( row[edgeInd] , function( link ){
                            link.source = i-1;
                        } );

                        if( row[edgeInd].length == 0 ){
                        	//TODO：说明是最后一列，这个后续要优化算法
                        	var nameLen = new Canvax.Display.Text(row[nodeInd]).getTextWidth();
                        	me._lastLevMaxLen = Math.max( me._lastLevMaxLen , nameLen );
                        }
                    }
                } );

                _.each( data , function(row , i){
                    if( i>0 ){
                    	_.each( row[edgeInd] , function( link ){
                            link.target = nodeMap[ link.target ];
                            df.links.push( link );
                        } );
                    }
                } );
                return df;
			},
			_setStages: function() {
				this._links = new Canvax.Display.Sprite({
					id: 'links',
					context : {
						x : this.padding.left,
						y : this.padding.top
					}
				});
				this._nodes = new Canvax.Display.Sprite({
					id: 'nodes',
					context : {
						x : this.padding.left,
						y : this.padding.top
					}
				});
				this._labels = new Canvax.Display.Sprite({
					id: 'labels',
					context : {
						x : this.padding.left,
						y : this.padding.top
					}
				});
				this._tips = new Canvax.Display.Sprite({
					id: 'tip'
				});

				this.stage.addChild(this._links);
				this.stage.addChild(this._nodes);
				this.stage.addChild(this._labels);
				this.stage.addChild(this._tips);

				this.__tips = new Tips(this.tips, this.canvax.getDomContainer());
				this.__tips._getDefaultContent = function(info) {
                    var str="";
                    str+="source:"+info.link.source.name+"<br />";
                    str+="target:"+info.link.target.name+"<br />";
                    str+="value:"+info.link.value;
                    return str;
                }
				this._tips.addChild( this.__tips.sprite );
			},
			getLayoutData: function() {
				return Layout()
					.nodeWidth(15)
					.nodePadding(10)
					.size([this.width - this.padding.left - this.padding.right, this.height - this.padding.top - this.padding.bottom])
					.nodes(this.dataFrame.nodes)
					.links(this.dataFrame.links)
					.layout(32);
			},
			drawNodes: function() {
				var nodes = this.layoutData.nodes();
				var me = this;
				_.each(nodes, function(node) {
					var nodeColor = me.colors[ parseInt(Math.random()*me.colors.length) ]
					var nodeEl = new Rect({
						xyToInt:false,
						context: {
							x: node.x,
							y: node.y,
							width: me.layoutData.nodeWidth(),
							height: Math.max(node.dy , 1),
							fillStyle: nodeColor,
							lineWidth: 0,
							strokeStyle :nodeColor
						}
					});
					nodeEl.layoutData = node;
					nodeEl.on("click", function() {

					});
					me._nodes.addChild(nodeEl);
				});
			},
			drawLinks: function(){
				var links = this.layoutData.links();
				var me = this;
				_.each(links, function(link) {
					var d = me.layoutData.link()(link);
					var path = new Path({
						xyToInt : false,
						context: {
							path: d,
							strokeStyle: "blue",
							lineWidth: Math.max(1, link.dy),
							globalAlpha: 0.2,
							cursor:"pointer"
						}
					});

                    path.link = link;
					path.hover(function(e){
                        this.context.globalAlpha += 0.2;
                        me.__tips.show(me._setTipsInfoHand(e , this.link));
					} , function(e){
                        this.context.globalAlpha -= 0.2;
                        me.__tips.hide( e );
					});
					path.on("mousemove" , function(e){
                        me.__tips.move(me._setTipsInfoHand(e , this.link));
					});
					me._links.addChild( path );
				});
			},
			drawLabels: function(){
				var nodes = this.layoutData.nodes();
				var me = this;
				_.each(nodes, function(node){
					var label = new Canvax.Display.Text(node.name , {
						context: {
							x : node.x+me.layoutData.nodeWidth(),
							y : node.y+Math.max(node.dy / 2 , 1),
							fillStyle : "black"
						}
					});
					me._labels.addChild( label );
				});
			},
            _setTipsInfoHand: function(e , link) {
                var me = this;
                var tipsInfo = {
                	link : link
                };
                e.tipsInfo = tipsInfo;
                return e;
            }
		});
		return Sanky;
	}
);