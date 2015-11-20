define(
    "canvax/animation/AnimationFrame", [],
    function() {
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
        var _taskList = [];
        var _requestAid = null;

        function registTask(task) {
            if (!_requestAid && _taskList.length == 0 && task) {
                _requestAid = requestAnimationFrame(function() {
                    for( var i=0,l=_taskList.length ; i<l ; i++){
                        var task = _taskList.shift();
                        task();
                        i--;
                        l--;
                    };
                    _requestAid = null;
                });
            };
            _taskList.push(task);
            return _requestAid;
        };

        function destroyTask(task) {
            for(var i=0,l=_taskList.length ; i<l ; i++){
                if(_taskList[i] === task){
                    _taskList.splice( i , 1 );
                }
            };
            if( _taskList.length == 0 ){
                cancelAnimationFrame( _requestAid );
                _requestAid = null;
            };
            return _requestAid;
        };

        return {
            registTask: registTask,
            destroyTask: destroyTask
        };
    }
);