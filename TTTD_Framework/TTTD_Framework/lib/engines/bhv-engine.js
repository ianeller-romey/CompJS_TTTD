(function (namespace, undefined) {
    "use strict";
        
    ////////
    // BhvCompInst
    namespace.Comp = namespace.Comp || {};
    namespace.Comp.Inst = namespace.Comp.Inst || {};
    namespace.Comp.Inst.Behavior = function (entity, behavior) {
        this.instanceId = entity.instanceId;
        this.behavior = behavior;
        this.behaviorQueue = [];

        this.behaviorQueue.push(this.behavior.firstBehavior);

        // if the behavior doesn't define its own data, do it for them
        if (this.behavior.data === undefined) {
            this.behavior.data = {};
        }

        this.processBehaviorQueue = function (delta) {
            var newBehaviors = this.behaviorQueue[0](delta);
            if (Object.prototype.toString.call(newBehaviors) === "[object Array]") {
                this.behaviorQueue.shift();
                var that = this;
                newBehaviors.forEach(function (x) {
                    that.behaviorQueue.push(x);
                });
            } else if (newBehaviors === true) {
                this.behaviorQueue.shift();
            } else if (newBehaviors === false) {
                // no op
            } else if (namespace.DebugEnabled === true) {
                throw "Behavior update function did not return a valid value.";
            }
            this.behavior.data = {};
        };
    };

    namespace.Comp.Inst.Behavior.prototype = new namespace.Comp.Inst.Component();

    namespace.Comp.Inst.Behavior.prototype.destroy = function (messengerEngine) {
        if (messengerEngine !== null) {
            messengerEngine.unregisterObject(this);
            if (this.behavior !== null) {
                messengerEngine.unregisterObject(this.behavior);
            }
        }
    };

    ////////
    // BhvCompDef
    namespace.Comp = namespace.Comp || {};
    namespace.Comp.Def = namespace.Comp.Def || {};
    namespace.Comp.Def.Behavior = function (def) {
        this.behaviorFile = def.behaviorFile;
        this.behaviorConstructor = def.behaviorConstructor;
    };

    ////////
    // BhvEngine
    namespace.Engines = namespace.Engines || {};
    namespace.Engines.BhvEngine = function () {
        var Inst = namespace.Comp.Inst;
        var Def = namespace.Comp.Def;

        var messengerEngine = namespace.Globals.globalMessengerEngine;
        var dataEngine = namespace.Globals.globalDataEngine;
        var gameStateEngine = namespace.Globals.globalGameStateEngine;

        var bhvConstructors = namespace.Engines.BhvEngine.bhvConstructors;
        var bhvCompDefinitions = [];
        var bhvGameStates = {};

        var buildBehaviorComponentInstanceDefinitions = function (data) {
            data.forEach(function (x) {
                bhvCompDefinitions[x.id] = new Def.Behavior(x);
            });
        };

        this.init = function () {
            var that = this;
            gameStateEngine.getActiveBhvGameStates().forEach(function (gameState) {
                that.addGameState(gameState);
            });

            return new Promise(function (resolve, reject) {
                dataEngine.loadAllBehaviorInstanceDefinitions().then(function (data) {
                    buildBehaviorComponentInstanceDefinitions(data);
                    resolve();
                }, function (reason) {
                    var reasonPlus = "Failed to load behavior definitions";
                    if (reason !== null) {
                        reasonPlus = reasonPlus + "\r\n" + reason;
                    }
                    reject(reasonPlus);
                });
            });
        };

        this.update = function (delta) {
            var activeGameStates = gameStateEngine.getActiveBhvGameStates();
            activeGameStates.forEach(function (gameState) {
                var bhvGameState = bhvGameStates[gameState];
                for (var i = 0; i < bhvGameState.bhvCompInstances.length; ++i) {
                    bhvGameState.bhvCompInstances[i].processBehaviorQueue(delta);
                }
            });
        };

        this.shutdown = function () {
            var that = this;
            return new Promise(function (resolve, reject) {
                bhvCompDefinitions = [];
                while (bhvCompInstances.length > 0) {
                    bhvCompInstances[0].destroy(messengerEngine);
                    bhvCompInstances.shift();
                }
                messengerEngine.unregisterObject(that);
                resolve();
            });
        };
        
        var addGameState = function (name) {
            if (!bhvGameStates[name]) { // intentional truthiness
                bhvGameStates[name] = new namespace.Engines.BhvEngine.GameState(name);
            }
        };

        var removeGameState = function (name) {
            if (bhvGameStates[name]) { // intentional truthiness
                while (bhvGameStates[name].bhvCompInstances.length > 0) {
                    var bhvCompInstance = bhvGameStates[name].bhvCompInstances.pop();
                    bhvCompInstance.destroy(messengerEngine);
                }
                bhvGameStates[name] = null;
            }
        };

        var addBehaviorComponentInstanceToGameState = function (instance, gameState) {
            addGameState(gameState);
            bhvGameStates[gameState].bhvCompInstances.push(instance);
        };

        var getBehaviorComponentInstanceById = function (instanceId) {
            var inst = bhvGameStates.forOwnProperties(function (key, value) {
                var instance = value.bhvCompInstance.firstOrNull(function (x) {
                    return x.instanceId === instanceId;
                });
                if (instance !== null) {
                    return instance;
                }
            });
            return (inst !== undefined) ? inst : null;
        };

        this.createBehaviorComponentInstance = function (entity, bhvCompDefId, gameState) {
            var behavior = new bhvConstructors[bhvCompDefinitions[bhvCompDefId].behaviorConstructor](entity);
            var instance = new Inst.Behavior(entity, behavior);
            addBehaviorComponentInstanceToGameState(instance, gameState);
        };

        this.setBehaviorComponentInstanceData = function (instanceId, data) {
            var instance = getBehaviorComponentInstanceById(instanceId);
            if (instance !== null) {
                data.forOwnProperties(function (key, value) {
                    instance.behavior.data[key] = value;
                });
            }
        };

        var getBehaviorComponentInstanceForEntityInstance = function (callback, instanceId) {
            var instance = getBehaviorComponentInstanceById(instanceId);
            if (instance !== null) {
                callback(instance);
            }
        };

        this.removeBehaviorComponentInstanceFromMessage = function (instanceId) {
            bhvGameStates.forOwnProperties(function (key, value) {
                var bhvCompInstances = value.bhvCompInstances;
                for (var i = 0; i < bhvCompInstances.length; ++i) {
                    if (bhvCompInstances[i].instanceId === instanceId) {
                        bhvCompInstances[i].destroy(messengerEngine);
                        bhvCompInstances.splice(i, 1);
                        return true;
                    }
                }
            });
        };

        messengerEngine.registerForMessage("setInstanceData", this, this.setBehaviorComponentInstanceData);
        messengerEngine.registerForRequest("getBehaviorComponentInstanceForEntityInstance", this, getBehaviorComponentInstanceForEntityInstance);
    };

    namespace.Engines.BhvEngine.setBehaviorConstructor = function (constructorName, constructorFunction) {
        var bhvConstructorList = namespace.Engines.BhvEngine.bhvConstructors;
        if (bhvConstructorList[constructorName] === undefined || bhvConstructorList[constructorName] === null) {
            bhvConstructorList[constructorName] = constructorFunction;
        }
    };

    namespace.Globals.globalMessengerEngine.registerForMessage("setBehaviorConstructor", namespace.Engines.BhvEngine, namespace.Engines.BhvEngine.setBehaviorConstructor);

    namespace.Engines.BhvEngine.loadBehaviorScripts = function (data, headElem) {
        namespace.Engines.BhvEngine.bhvConstructors = {};
        namespace.Engines.BhvEngine.bhvScriptElements = [];

        var bhvScriptElementList = namespace.Engines.BhvEngine.bhvScriptElements;
        data.forEach(function (x) {
            var script = document.createElement("script");
            script.setAttribute("type", "text/javascript");
            script.setAttribute("src", x.behaviorFile);
            headElem.appendChild(script);
            bhvScriptElementList.push(script);
        });

        var bhvConstructorList = namespace.Engines.BhvEngine.bhvConstructors;
        return new Promise(function (resolve, reject) {
            var iterations = 0;
            var iterationsMax = 60000; // try for a whole minute!
            var checkScriptsLoaded = function () {
                if (iterations < iterationsMax) {
                    var count = 0;
                    bhvConstructorList.forOwnProperties(function (key, value) {
                        count += 1;
                    });
                    if (count === data.length) {
                        resolve();
                    } else {
                        // behavior constructors definitely send messages
                        namespace.Globals.globalMessengerEngine.update();
                        setTimeout(checkScriptsLoaded, 1);
                    }
                } else {
                    reject("Timeout on loading behavior scripts");
                }
            };
            setTimeout(checkScriptsLoaded, 1);
        });
    };

    namespace.Engines.BhvEngine.unloadStateScripts = function () {
        return new Promise(function (resolve, reject) {
            namespace.Engines.BhvEngine.bhvScriptElements.forEach(function (e) {
                e.parentElement.removeChild(e);
            });
            namespace.Engines.BhvEngine.bhvScriptElements = [];
            namespace.Engines.BhvEngine.bhvConstructors = {};
            resolve();
        });
    };

    ////////
    // BhvEngine GameState
    namespace.Engines.BhvEngine.GameState = function (name) {
        this.name = name;
        this.bhvCompInstances = [];
    };

}(window.TTTD = window.TTTD || {}));