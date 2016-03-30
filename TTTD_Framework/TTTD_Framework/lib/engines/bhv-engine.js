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
            }
            this.behavior.data = {};
        };
    };

    namespace.Comp.Inst.Behavior.prototype = new namespace.Comp.Inst.Component();

    namespace.Comp.Inst.Behavior.prototype.destroy = function (messengerEngine) {
        if (messengerEngine !== null) {
            messengerEngine.unregisterAll(this);
            if (this.behavior !== null) {
                messengerEngine.unregisterAll(this.behavior);
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

        var bhvConstructors = namespace.Engines.BhvEngine.bhvConstructors;
        var bhvCompDefinitions = [];
        var bhvCompInstances = [];

        var buildBehaviorComponentInstanceDefinitions = function (data) {
            data.forEach(function (x) {
                bhvCompDefinitions[x.id] = new Def.Behavior(x);
            });
        };

        this.init = function () {
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
            for (var i = 0; i < bhvCompInstances.length; ++i) {
                bhvCompInstances[i].processBehaviorQueue(delta);
            }
        };

        this.shutdown = function () {
            var that = this;
            return new Promise(function (resolve, reject) {
                bhvCompDefinitions = [];
                while (bhvCompInstances.length > 0) {
                    bhvCompInstances[0].destroy(messengerEngine);
                    bhvCompInstances.shift();
                }
                messengerEngine.unregisterAll(that);
                resolve();
            });
        };

        this.createBehaviorComponentInstance = function (entity, bhvCompDefId) {
            var behavior = new bhvConstructors[bhvCompDefinitions[bhvCompDefId].behaviorConstructor](entity);
            var instance = new Inst.Behavior(entity, behavior);
            bhvCompInstances.push(instance);
        };

        this.setBehaviorComponentInstanceData = function (instanceId, data) {
            var instance = bhvCompInstances.firstOrNull(function (x) {
                return x.instanceId === instanceId;
            });
            if (instance !== null) {
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        instance.behavior.data[key] = data[key];
                    }
                }
            }
        };

        var getBehaviorComponentInstanceForEntityInstance = function (instanceId) {
            var instance = bhvCompInstances.firstOrNull(function (x) {
                return x.instanceId === instanceId;
            });
            if (instance !== null) {
                messengerEngine.postImmediate("getBehaviorComponentInstanceForEntityInstanceResponse", instanceId, instance);
            }
        };

        var removeBehaviorComponentInstanceFromMessage = function (instanceId) {
            for (var i = 0; i < bhvCompInstances.length; ++i) {
                if (bhvCompInstances[i].instanceId === instanceId) {
                    bhvCompInstances[i].destroy(messengerEngine);
                    bhvCompInstances.splice(i, 1);
                    break;
                }
            }
        };

        messengerEngine.register("setInstanceData", this, this.setBehaviorComponentInstanceData);
        messengerEngine.register("getBehaviorComponentInstanceForEntityInstanceRequest", this, getBehaviorComponentInstanceForEntityInstance);
        messengerEngine.register("removeEntityInstance", this, removeBehaviorComponentInstanceFromMessage);
    };

    namespace.Engines.BhvEngine.setBehaviorConstructor = function (constructorName, constructorFunction) {
        var bhvConstructorList = namespace.Engines.BhvEngine.bhvConstructors;
        if (bhvConstructorList[constructorName] === undefined || bhvConstructorList[constructorName] === null) {
            bhvConstructorList[constructorName] = constructorFunction;
        }
    };

    namespace.Globals.globalMessengerEngine.register("setBehaviorConstructor", namespace.Engines.BhvEngine, namespace.Engines.BhvEngine.setBehaviorConstructor);

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
                    for (var key in bhvConstructorList) {
                        if (bhvConstructorList.hasOwnProperty(key)) {
                            count += 1;
                        }
                    }
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
}(window.TTTD = window.TTTD || {}));