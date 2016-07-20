define('chartx/chart/bar/3d/back',
    [
        "canvax/index",
    ],
    function (Canvax) {
        var Back = function (opt, root) {
            this.sprite = null;
            this.init();
        };

        Back.prototype = {
            init: function () {
                this.sprite = new Canvax.Display.Sprite();
            },
            draw: function () {

            }
        };
        return Back;
    });