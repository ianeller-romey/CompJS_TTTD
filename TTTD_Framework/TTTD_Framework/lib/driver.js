(function () {
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

    if (window.addEventListener == null) {
        errorState("Browser does not support window.addEventListener");
    } else {
        var initialize = function () {
            var Cabinet = function (menuElem, gameElem) {
                var menuElement = menuElem;
                var gameElement = gameElem;
                var servicesEngine = globalServicesEngine;

                var gamesDefinitions = [];

                var that = this;

                this.init = function () {
                    var supported = false;
                    try {
                        supported = (Promise != null);
                    } catch(x) {
                        supported = false;
                    }

                    if (supported) {
                        servicesEngine.retrieveAllGames().then(function (data) {
                            buildGamesDefinitions(data);
                            displayMenu();
                        }, function (reason) {
                            var reasonPlus = "Failed to load the list of games";
                            if (reason != null) {
                                reasonPlus = reasonPlus + "\r\n" + reason;
                            }
                            reject(reasonPlus);
                        });
                    } else {
                        errorState("Browser does not support native Promise declaration");
                    }
                };

                var buildGamesDefinitions = function (data) {
                    data.forEach(function (g) {
                        gamesDefinitions[g.id] = g.name;
                    });
                };

                var createOnMenuSelect = function (id) {
                    return function () {
                        displayGame();
                        loadGame(id);
                    };
                };

                var createOnMenuMouseEvents = function (selectionElement, g) {
                    var go;
                    var blink1 = function (selectionElement, g) {
                        selectionElement.innerHTML = ">" + g;
                        if (go) {
                            setTimeout(blink2, 500, selectionElement, g);
                        }
                    };
                    var blink2 = function (selectionElement, g) {
                        if (go) {
                            selectionElement.innerHTML = ">" + g + "_";
                            setTimeout(blink1, 500, selectionElement, g);
                        }
                    };
                    return {
                        enter: function () {
                            go = true;
                            blink2(selectionElement, g);
                        },
                        leave: function () {
                            go = false;
                            blink1(selectionElement, g);
                        }
                    };
                };

                var displayMenu = function () {
                    gameElement.style.display = "none";
                    menuElement.style.display = "";

                    var menuViewElem = document.getElementById("menuView");
                    gamesDefinitions.forEach(function (g, i) {
                        var selectionElem = document.createElement("span");
                        selectionElem.classList.add("menuSelected");
                        selectionElem.classList.add("transition150");
                        selectionElem.style["margin-top"] = "32px";
                        selectionElem.style.display = "inline-block";
                        var onSelect = createOnMenuSelect(i);
                        var onMouse = createOnMenuMouseEvents(selectionElem, g);
                        selectionElem.addEventListener("click", function () {
                            onSelect();
                        });
                        selectionElem.addEventListener("mouseenter", function () {
                            onMouse.enter();
                        });
                        selectionElem.addEventListener("mouseleave", function () {
                            onMouse.leave();
                        });
                        selectionElem.innerHTML = ">" + g;

                        menuViewElem.appendChild(selectionElem);
                    });
                };

                var displayGame = function () {
                    gameElement.style.display = "";
                    menuElement.style.display = "none";
                    var menuViewElem = document.getElementById("menuView");
                    menuViewElem.innerHTML = "";
                };

                var loadGame = function (gameId) {
                    var headElem = document.getElementsByTagName("head")[0];
                    var canvasElem = document.getElementById("glCanvas");
                    // statically load behaviors
                    var loadScriptsPromise = new Promise(function (resolve, reject) {
                        servicesEngine.retrieveAllBhvCompDefinitionsForGame(gameId).then(function (data) {
                            BhvEngine.loadStateScripts(data, headElem).then(function () {
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
                        servicesEngine.retrieveAllShadersForGame(gameId).then(function (data) {
                            GfxEngine.loadShaderScripts(data, headElem).then(function () {
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
                        var messengerEngine = globalMessengerEngine;
                        var audEngine;
                        var bhvEngine;
                        var gfxEngine;
                        var physEngine;
                        var entManager;
                        var inputManager;
                        var run = function () {
                            audEngine = new AudEngine();
                            bhvEngine = new BhvEngine(headElem);
                            gfxEngine = new GfxEngine(canvasElem);
                            entManager = new EntityManager(gameId);
                            physEngine = new PhysEngine();
                            inputManager = globalInputManager;
                            var initPromise = Promise.all([audEngine.init(gameId), bhvEngine.init(gameId), gfxEngine.init(gameId), entManager.init(gameId), physEngine.init(gameId), inputManager.init()]);
                            initPromise.then(function () {
                                servicesEngine.retrieveAllLevelsForGame(gameId).then(function (data) {
                                    entManager.loadLevel(gameId, data[0].id);

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
                                        inputManager.update(delta);
                                        messengerEngine.update(delta);
                                        audEngine.update(delta);
                                        gfxEngine.update(delta);
                                        bhvEngine.update(delta);
                                        physEngine.update(delta);

                                        if (inputManager.isTriggered(inputManager.keys.escape)) {
                                            var shutdownPromise = Promise.all([audEngine.shutdown(gameId), bhvEngine.shutdown(gameId), gfxEngine.shutdown(gameId), entManager.shutdown(gameId), physEngine.shutdown(gameId), inputManager.shutdown()]);
                                            shutdownPromise.then(function () {
                                                Promise.all([BhvEngine.unloadStateScripts(), GfxEngine.unloadShaderScripts()]).then(function () {
                                                    setTimeout(displayMenu, 1);
                                                });
                                            });
                                        } else {
                                            setTimeout(gameLoop, 1);
                                        }
                                    };
                                    gameLoop();
                                }, function (reason) {
                                    var reasonPlus = "Failed to load game levels";
                                    if (reason != null) {
                                        reasonPlus = reasonPlus + "\r\n" + reason;
                                    }
                                    errorState(reasonPlus);
                                });
                            }, function (reason) {
                                var reasonPlus = "Failed to initialize game engine";
                                if (reason != null) {
                                    reasonPlus = reasonPlus + "\r\n" + reason;
                                }
                                errorState(reasonPlus);
                            });
                        };
                        run();
                    });
                };
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
    }
}());