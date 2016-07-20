define('chartx/chart/bar/3d/xaxis',
    [
        "canvax/index",
    ],
    function (Canvax) {
        var Xaxis = function (opt, root) {
            this.sprite = null;
            this.init();
        };
        Xaxis.prototype = {
            init: function () {
                this.sprite = new Canvax.Display.Sprite();
            },
            draw: function () {

            }
        };
        return Xaxis;
    });