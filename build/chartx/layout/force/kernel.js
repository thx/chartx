define(
        "chartx/layout/force/kernel",
        [
            'chartx/layout/force/physics/physics'
        ],
        function( Physics ){
            var Kernel = function(pSystem){
                // in chrome, web workers aren't available to pages with file:// urls
                var chrome_local_file = window.location.protocol == "file:" && navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
                var USE_WORKER = (window.Worker !== undefined && !chrome_local_file);    

                //USE_WORKER = false;

                var _physics = null;
                var _tween = null;
                var _fpsWindow = []; // for keeping track of the actual frame rate
                _fpsWindow.last = new Date();
                var _screenInterval = null;
                var _attached = null;

                var _tickInterval = null;
                var _lastTick = null;
                var _paused = false;

                var that = {
                    system:pSystem,
                    tween:null,
                    nodes:{},

                    init:function(){ 

                        /* tween暂时用不到
                        if (typeof(Tween)!='undefined'){
                            _tween = Tween()
                        } else if (typeof(arbor.Tween)!='undefined') {
                            _tween = arbor.Tween()
                        } else {
                            _tween = {
                                busy:function(){return false},
                                tick:function(){return true},
                                to:function(){
                                    trace('Please include arbor-tween.js to enable tweens');
                                    _tween.to=function(){}; return
                                } 
                            }
                        };
                        */


                        that.tween = _tween;

                        var params = pSystem.parameters();

                        if(USE_WORKER){
                            _screenInterval = setInterval(that.screenUpdate, params.timeout);

                            _physics = new Worker( Chartx.path + 'chartx/layout/force/worker.js');
                            _physics.onmessage = that.workerMsg;
                            _physics.onerror = function(e){
                                //error
                            };
                            _physics.postMessage({
                                type : "physics", 
                                physics : _.extend( params , {
                                    timeout:Math.ceil(params.timeout)
                                })
                            });
                        } else {
                            _physics = Physics(
                                    params.dt,
                                    params.stiffness,
                                    params.repulsion,
                                    params.friction,
                                    that.system._updateGeometry,
                                    params.integrator
                                    );
                            that.start()
                        }

                        return that
                    },

                    graphChanged:function(changes){
                        if (USE_WORKER) {
                            _physics.postMessage({type:"changes","changes":changes});
                        } else {
                            _physics._update(changes)
                        }
                        that.start() 
                    },

                    particleModified:function(id, mods){
                        if (USE_WORKER) {
                            _physics.postMessage({type:"modify", id:id, mods:mods}) 
                        } else {
                            _physics.modifyNode(id, mods)
                        }
                        that.start() 
                    },
                    physicsModified:function(param){
                        if (!isNaN(param.timeout)){
                            if (USE_WORKER){
                                clearInterval(_screenInterval);
                                _screenInterval = setInterval(that.screenUpdate, param.timeout);
                            }else{
                                clearInterval(_tickInterval);
                                _tickInterval=null
                            }
                        }
                        if (USE_WORKER) {
                            _physics.postMessage({type:'sys',param:param});
                        } else {
                            _physics.modifyPhysics(param)
                        }
                        that.start(); 
                    },

                    workerMsg:function(e){
                        var type = e.data.type;
                        if( type == 'stopping' ){
                            clearInterval(_screenInterval); 
                            _screenInterval = null;
                        }
                        if (type=='geometry'){
                            that.workerUpdate(e.data)
                        } else {
                            //trace('physics:',e.data)
                        }
                    },
                    _lastPositions:null,
                    workerUpdate:function(data){
                        that._lastPositions = data;
                        that._lastBounds = data.bounds
                    },

                    // the main render loop when running in web worker mode
                    _lastFrametime:new Date().valueOf(),
                    _lastBounds:null,
                    _currentRenderer:null,
                    screenUpdate:function(){        
                        //console.log("run")
                        var now = new Date().valueOf();

                        var shouldRedraw = false;
                        if (that._lastPositions!==null){
                            that.system._updateGeometry(that._lastPositions);
                            that._lastPositions = null;
                            shouldRedraw = true;
                        }

                        if (_tween && _tween.busy()) {
                            shouldRedraw = true
                        }

                        if (that.system._updateBounds(that._lastBounds)){
                            shouldRedraw=true
                        }


                        if (shouldRedraw){
                            var render = that.system.renderer;
                            if (render!==undefined){
                                if (render !== _attached){
                                    render.init(that.system);
                                    _attached = render;
                                }          

                                if (_tween){
                                    _tween.tick()
                                }
                                render.redraw();

                                var prevFrame = _fpsWindow.last;
                                _fpsWindow.last = new Date();
                                _fpsWindow.push(_fpsWindow.last-prevFrame);
                                if (_fpsWindow.length>50) {
                                    _fpsWindow.shift()
                                }
                            }
                        }
                    },

                    // the main render loop when running in non-worker mode
                    physicsUpdate:function(){

                        if (_tween) {
                            _tween.tick();
                        }
                        _physics.tick();

                        var stillActive = that.system._updateBounds();
                        if (_tween && _tween.busy()) {
                            stillActive = true
                        }

                        var render = that.system.renderer;
                        var now = new Date();  
                        var render = that.system.renderer;
                        if (render!==undefined){
                            if (render !== _attached){
                                render.init(that.system);
                                _attached = render;
                            }          
                            render.redraw({timestamp:now});
                        }

                        var prevFrame = _fpsWindow.last;
                        _fpsWindow.last = now;
                        _fpsWindow.push(_fpsWindow.last-prevFrame);
                        if (_fpsWindow.length>50) {
                            _fpsWindow.shift()
                        }

                        var sysEnergy = _physics.systemEnergy();
                        if ((sysEnergy.mean + sysEnergy.max)/2 < 1){
                            if (_lastTick===null) {
                                _lastTick=new Date().valueOf()
                            }
                            if (new Date().valueOf()-_lastTick>1000){
                                //console.log('stop-nonWorker')
                                clearInterval(_tickInterval);
                                _tickInterval = null
                            } else {
                                // 'pausing'
                            }
                        }else{
                            // 'continuing'
                            _lastTick = null
                        }
                    },


                    fps:function(newTargetFPS){
                        if (newTargetFPS!==undefined){
                            var timeout = 1000/Math.max(1,targetFps);
                            that.physicsModified({timeout:timeout});
                        }

                        var totInterv = 0;
                        for (var i=0, j=_fpsWindow.length; i<j; i++){
                            totInterv+=_fpsWindow[i]
                        }
                        var meanIntev = totInterv/Math.max(1,_fpsWindow.length);
                        if (!isNaN(meanIntev)){
                            return Math.round(1000/meanIntev)
                        } else {
                            return 0
                        }
                    },
                    start:function(unpause){
                        if (_tickInterval !== null) return; // already running
                        if (_paused && !unpause) return; // we've been .stopped before, wait for unpause
                        _paused = false;

                        if (USE_WORKER){
                            _physics.postMessage({type:"start"})
                        }else{
                            _lastTick = null;
                            _tickInterval = setInterval(that.physicsUpdate, that.system.parameters().timeout)
                        }
                    },
                    stop:function(){
                        _paused = true;
                        if (USE_WORKER){
                            _physics.postMessage({type:"stop"});
                        }else{
                            if (_tickInterval!==null){
                                clearInterval(_tickInterval);
                                _tickInterval = null
                            }
                        }
                    }
                }

                return that.init()    
            }

            return Kernel;

        }
);


