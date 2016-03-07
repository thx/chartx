define(
	"chartx/chart/sankey/index", [
		'chartx/chart/index',
		'chartx/layout/sankey/index',
		'canvax/shape/Rect',
		'canvax/shape/Path'
	],
	function(Chart, Layout, Rect, Path) {
		var Canvax = Chart.Canvax;
		var Sanky = Chart.extend({
			init: function(el, data, opts) {
				this._el = el;
				this._data = data;
				this._opts = opts;
			},
			draw: function() {
				this.layoutData = this.getLayoutData();
				this._setStages();
				this.drawNodes();
				this.drawLinks();
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
				this._tips = new Canvax.Display.Sprite({
					id: 'tip'
				});

				this.stage.addChild(this._links);
				this.stage.addChild(this._nodes);
				this.stage.addChild(this._tips);
			},
			getLayoutData: function() {
				return Layout()
					.nodeWidth(15)
					.nodePadding(10)
					.size([this.width - this.padding.left - this.padding.right, this.height - this.padding.top - this.padding.bottom])
					.nodes(this._data.nodes)
					.links(this._data.links)
					.layout(32);
			},
			drawNodes: function() {
				var nodes = this.layoutData.nodes();
				var me = this;
				_.each(nodes, function(node) {
					var nodeColor = "red"
					if(node.name == "Nuclear"){
						nodeColor = "green"
					}
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
			drawLinks: function() {
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
					path.hover(function(){
                        this.context.globalAlpha += 0.2
					} , function(){
                        this.context.globalAlpha -= 0.2
					});
					me._links.addChild( path );

				});
			}
		});
		return Sanky;
	}
);