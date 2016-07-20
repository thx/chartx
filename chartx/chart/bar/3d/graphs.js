define('chartx/chart/bar/3d/graphs',
    [
        "canvax/index",
    ],
    function (Canvax) {
        var Graphs = function (opt, root) {
            this.sprite =null;
            this.init();
        };
        Graphs.prototype ={
            init: function () {
                this.sprite = new Canvax.Display.Sprite();
            },
            draw:function(){

            }
        };
        return Graphs;
    });
