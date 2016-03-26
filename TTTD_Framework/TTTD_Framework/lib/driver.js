(function (namespace, undefined) {
    "use strict";

    var errorState = function (error) {
        var errorString = error + " :(";

        var errorElem = document.createElement("div");
        errorElem.classList.add("center");
        errorElem.style.position = "absolute";
        errorElem.style.top = 0;
        errorElem.style.left = 0;
        errorElem.style.width = "100%";
        errorElem.style.color = "white";
        errorElem.style.textAlign = "center";
        errorElem.style["font-family"] = "Courier New";
        errorElem.style["font-size"] = "36px";
        errorElem.innerHTML = errorString;
        document.body.appendChild(errorElem);
    };

    if (window.addEventListener === null) {
        errorState("Browser does not support window.addEventListener");
    } else {
        var initialize = function () {
            var headElem = document.getElementsByTagName("head")[0];
            var canvasElem = document.getElementById("glCanvas");
            // statically load behaviors
            var loadScriptsPromise = new Promise(function (resolve, reject) {
                namespace.Globals.globalDataEngine.loadAllBehaviorInstanceDefinitions().then(function (data) {
                    namespace.Engines.BhvEngine.loadBehaviorScripts(data, headElem).then(function () {
                        resolve();
                    }, function () {
                        reject("Failed to load behavior scripts");
                    });
                }, function () {
                    reject("Failed to load behavior scripts");
                });
            });
            // statically load shaders
            var loadShadersPromise = new Promise(function (resolve, reject) {
                namespace.Globals.globalDataEngine.loadAllShaders().then(function (data) {
                    namespace.Engines.GfxEngine.loadShaderScripts(data, headElem).then(function () {
                        resolve();
                    }, function (reason) {
                        var reasonPlus = "Failed to load shaders";
                        if (reason != null) {
                            reasonPlus = reasonPlus + "\r\n" + reason;
                        }
                        reject(reasonPlus);
                    });
                }, function (reason) {
                    var reasonPlus = "Failed to load shaders";
                    if (reason != null) {
                        reasonPlus = reasonPlus + "\r\n" + reason;
                    }
                    reject(reasonPlus);
                });
            });
            Promise.all([loadScriptsPromise, loadShadersPromise]).then(function () {
                var messengerEngine = namespace.Globals.globalMessengerEngine;
                var dataEngine = namespace.Globals.globalDataEngine;
                var audEngine;
                var bhvEngine;
                var gfxEngine;
                var physEngine;
                var entManager;
                var inputEngine;
                var run = function () {
                    audEngine = new namespace.Engines.AudEngine();
                    bhvEngine = new namespace.Engines.BhvEngine(headElem);
                    gfxEngine = new namespace.Engines.GfxEngine(canvasElem);
                    physEngine = new namespace.Engines.PhysEngine();
                    entManager = new namespace.Engines.EntityManager(audEngine, bhvEngine, gfxEngine, physEngine);
                    inputEngine = namespace.Globals.globalInputEngine;
                    var initPromise = Promise.all([audEngine.init(), bhvEngine.init(), gfxEngine.init(), entManager.init(), physEngine.init(), inputEngine.init()]);
                    initPromise.then(function () {
                        dataEngine.loadLevel(0);

                        var d = new Date();
                        var n = d.getTime();
                        var gameLoop = function () {
                            d = new Date();
                            var newN = d.getTime();
                            var delta = (newN - n);
                            n = newN;
                            if (delta > 100) {
                                delta = 10;
                            }
                            inputEngine.update(delta);
                            messengerEngine.update(delta);
                            audEngine.update(delta);
                            gfxEngine.update(delta);
                            bhvEngine.update(delta);
                            physEngine.update(delta);

                            if (inputEngine.isTriggered(inputEngine.keys.escape)) {
                                var shutdownPromise = Promise.all([audEngine.shutdown(), bhvEngine.shutdown(), gfxEngine.shutdown(), entManager.shutdown(), physEngine.shutdown(), inputEngine.shutdown()]);
                                shutdownPromise.then(function () {
                                    Promise.all([namespace.Engines.BhvEngine.unloadBehaviorScripts(), namespace.Engines.GfxEngine.unloadShaderScripts()]).then(function () {
                                        setTimeout(displayMenu, 1);
                                    });
                                });
                            } else {
                                setTimeout(gameLoop, 1);
                            }
                        };
                        gameLoop();
                    }, function (reason) {
                        var reasonPlus = "Failed to initialize engines";
                        if (reason != null) {
                            reasonPlus = reasonPlus + "\r\n" + reason;
                        }
                        errorState(reasonPlus);
                    });
                };
                run();
            });
        };

        var MENU = document.getElementById("menu");
        var GAME = document.getElementById("game");
        if (MENU && GAME) {
            var driver = new Cabinet(MENU, GAME);
            driver.init();
        }
    };

    window.addEventListener("load", function load(event) {
        window.removeEventListener("load", load, false);

        function suppressBackspace(event) { // we don't want the delete key to act like the browser back button
            event = event || window.event;
            var target = event.target || event.srcElement;
            if (event.keyCode == 8 && !/input|textarea/i.test(target.nodeName)) {
                return false;
            }
        };
        document.onkeydown = suppressBackspace;
        document.onkeypress = suppressBackspace;

        initialize();
    }, false);

}(window.TTTD = window.TTTD || {}));