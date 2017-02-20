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

        function enabledAnimationFrame(){
            if (!_requestAid) {
                _requestAid = requestAnimationFrame(function() {
                    console.log("frame__" + _taskList.length);
                    //if ( Tween.getAll().length ) {
                    Tween.update(); //tween自己会做length判断
                    //};
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
         * @param task 要加入到渲染帧队列中的任务
         * @result frameid
         */
        function registFrame( $frame ) {
            if (!$frame) {
                return;
            };
            _taskList.push($frame);
            return enabledAnimationFrame();
        };

        /*
         *  @param task 要从渲染帧队列中删除的任务
         */
        function destroyFrame( $frame ) {
            var d_result = false;
            for (var i = 0, l = _taskList.length; i < l; i++) {
                if (_taskList[i].id === $frame.id) {
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


        /* 
         * @param opt {from , to , onUpdate , onComplete , ......}
         * @result tween
         */
        function registTween(options) {
            var opt = _.extend({
                from: null,
                to: null,
                duration: 500,
                onStart: function(){},
                onUpdate: function() {},
                onComplete: function() {},
                onStop: function(){},
                repeat: 0,
                delay: 0,
                easing: 'Linear.None',
                desc: '' //动画描述，方便查找bug
            }, options);

            var tween = {};
            var tid = "tween_" + Base.getUID();
            opt.id && ( tid = tid+"_"+opt.id );

            if (opt.from && opt.to) {
                tween = new Tween.Tween( opt.from )
                .to( opt.to, opt.duration )
                .onStart(function(){
                    opt.onStart.apply( this )
                })
                .onUpdate( function(){
                    opt.onUpdate.apply( this );
                } )
                .onComplete( function() {
                    destroyFrame({
                        id: tid
                    });
                    tween._isCompleteed = true;
                    opt.onComplete.apply( this , [this] ); //执行用户的conComplete
                } )
                .onStop( function(){
                    destroyFrame({
                        id: tid
                    });
                    tween._isStoped = true;
                    opt.onStop.apply( this , [this] );
                } )
                .repeat( opt.repeat )
                .delay( opt.delay )
                .easing( Tween.Easing[opt.easing.split(".")[0]][opt.easing.split(".")[1]] )
                
                tween.id = tid;
                tween.start();


                function animate() {

                    if ( tween._isCompleteed || tween._isStoped ) {
                        tween = null;
                        return;
                    };
                    registFrame({
                        id: tid,
                        task: animate,
                        desc: opt.desc,
                        tween: tween
                    });
                };
                animate();

            };
            return tween;
        };
        /*
         * @param tween
         * @result void(0)
         */
        function destroyTween(tween , msg) {
            tween.stop();
        };

        return {
            registFrame: registFrame,
            destroyFrame: destroyFrame,
            registTween: registTween,
            destroyTween: destroyTween
        };
    }
);