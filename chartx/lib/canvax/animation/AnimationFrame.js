define(
    "canvax/animation/AnimationFrame", [
        "canvax/animation/Tween",
        "canvax/core/Base"
    ],
    function(Tween, Base) {
        window.Tween = Tween;
        /**
         * 设置 AnimationFrame begin
         */
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
        };
        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() {
                        callback(currTime + timeToCall);
                    },
                    timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        };
        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
        };

        //管理所有图表的渲染任务
        var _taskList = []; //[{ id : task: }...]
        var _requestAid = null;

        /*
         * @param task 要加入到渲染帧队列中的任务
         * @result frameid
         */
        function registFrame(task) {
            if (!task) {
                return;
            };
            _taskList.push(task);
            if (!_requestAid) {
                _requestAid = requestAnimationFrame(function() {
                    //console.log("frame__" + _taskList.length);
                    if (_tweenLen) {
                        Tween.update();
                    };
                    var currTaskList = _taskList;
                    _taskList = [];
                    _requestAid = null;
                    while (currTaskList.length > 0) {
                        currTaskList.shift().task();
                    };
                });
            };
            return _requestAid;
        };



        /*
         *  @param task 要从渲染帧队列中删除的任务
         */
        function destroyFrame(task) {
            var d_result = false;
            for (var i = 0, l = _taskList.length; i < l; i++) {
                if (_taskList[i].id === task.id) {
                    d_result = true;
                    _taskList.splice(i, 1);
                    i--;
                    l--;
                };
            };
            if (_taskList.length == 0) {
                cancelAnimationFrame(_requestAid);
                _requestAid = null;
            };
            return d_result;
        };

        var _tweenLen = 0;

        /* 
         * @param opt {from , to , onUpdate , onComplete , ......}
         * @result tween
         */
        function registTween(options) {
            var opt = _.extend({
                from: null,
                to: null,
                duration: 500,
                onUpdate: function() {},
                onComplete: function() {},
                repeat: 0,
                delay: 0,
                easing: null
            }, options);
            var tween = {};
            if (opt.from && opt.to) {
                tween = new Tween.Tween(opt.from).to(opt.to, opt.duration).onUpdate(opt.onUpdate);

                opt.repeat && tween.repeat(opt.repeat);
                opt.delay && tween.delay(opt.delay);
                opt.easing && tween.easing(Tween.Easing[opt.easing.split(".")[0]][opt.easing.split(".")[1]]);

                var tid = "tween_" + Base.getUID();

                function animate() {
                    if (!tween || !tween.animate) {
                        return;
                    };
                    registFrame({
                        id: tid,
                        task: animate
                    });
                };

                tween.onComplete(function() {

                    _tweenLen--;

                    destroyFrame({
                        task: animate,
                        id: tid
                    });
                    tween.animate = null;
                    tween = null;

                    var t = this;
                    setTimeout(function() {
                        opt.onComplete(t); //执行用户的conComplete
                    }, 10);
                });

                tween.start();

                _tweenLen++;

                tween.animate = animate;
                tween.id = tid;
                animate();
            };
            return tween;
        };

        /*
         * @param tween
         * @result void(0)
         */
        function destroyTween(tween) {

            tween.stop();

            if (destroyFrame({
                    task: tween.animate,
                    id: tween.id
                })) {
                _tweenLen--;
            };
            tween.animate = null;
            tween = null;

        };

        return {
            registFrame: registFrame,
            destroyFrame: destroyFrame,
            registTween: registTween,
            destroyTween: destroyTween
        };
    }
);
