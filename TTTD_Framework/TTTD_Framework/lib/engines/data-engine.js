(function (namespace, undefined) {
    "use strict";

    ////////
    // LevelLayoutCompDef
    namespace.Comp = namespace.Comp || {};
    namespace.Comp.Def = namespace.Comp.Def || {};
    namespace.Comp.Def.LevelLayout = function (def) {
        this.layout = def.layout;
        this.playerPosition = def.playerPosition;

        this.layout.forEach(function (x) {
            if (x.data.length > 0) {
                var dataTemp = {};
                x.data.forEach(function (y) {
                    dataTemp[y.key] = y.value;
                });
                x.data = dataTemp;
            } else {
                x.data = null;
            }
        });
    };

    namespace.Engines = namespace.Engines || {};
    namespace.Engines.DataEngine = function () {
        var audioTypesFile = "/compjs/tttd/assets/json/AudioType.json";
        var physTypesFile = "/compjs/tttd/assets/json/PhysType.json";
        var collisionTypesFile = "/compjs/tttd/assets/json/CollisionType.json";
        var audioFile = "/compjs/tttd/assets/json/Audio.json";
        var shadersFile = "/compjs/tttd/assets/json/Shader.json";
        var textureInformationFile = "/compjs/tttd/assets/json/TextureInformation.json";
        var behaviorInstanceDefinitionsFile = "/compjs/tttd/assets/json/BehaviorInstanceDefinition.json";
        var graphicsAnimationInstanceDefinitionsFile = "/compjs/tttd/assets/json/GraphicsAnimationInstanceDefinition.json";
        var graphicsFontInstanceDefinitionsFile = "/compjs/tttd/assets/json/GraphicsFontInstanceDefinition.json";
        var physicsInstanceDefinitionsFile = "/compjs/tttd/assets/json/PhysicsInstanceDefinition.json";
        var entityInstanceDefinitionsFile = "/compjs/tttd/assets/json/EntityInstanceDefinition.json";
        var levelsFile = "/compjs/tttd/assets/json/Level.json";
        var levels = {};
        var levelLayouts = {};

        var messengerEngine = namespace.Globals.globalMessengerEngine;

        var httpPromise = function (xmlHttp, parameters, dataFormat) {
            return new Promise(function (resolve, reject) {
                xmlHttp.onreadystatechange = function () {
                    if (xmlHttp.readyState == XMLHttpRequest.DONE) {
                        if (xmlHttp.status == 200) {
                            var data = dataFormat(xmlHttp);
                            resolve(data);
                        } else {
                            reject("HTTP STATUS: " + xmlHttp.status);
                        }
                    }
                };

                if (parameters !== undefined) {
                    xmlHttp.send(parameters);
                } else {
                    xmlHttp.send();
                }
            });
        };

        var sendHttpGetJSONRequest = function (url, parameters) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.url = url;
            xmlHttp.open("GET", url, true);
            xmlHttp.setRequestHeader("Content-type", "text/plain");

            return httpPromise(xmlHttp, parameters, function (x) {
                return JSON.parse(x.responseText);
            });
        };

        var setupLevelCache = function () {
            sendHttpGetJSONRequest(levelsFile).then(function (data) {
                data.forEach(function (x) {
                    levels[x.id] = {
                        name: x.name,
                        order: x.order,
                        width: x.width,
                        height: x.height
                    };
                });
            });
        };

        var readLevelLayout = function (levelId) {
            return new Promise(function (resolve, reject) {
                sendHttpGetJSONRequest(levelsFile).then(function (data) {
                    var level = data.firstOrNull(function (x) {
                        return x.id === levelId;
                    });
                    resolve((level !== null) ? new namespace.Comp.Def.LevelLayout(level) : null);
                });
            });
        };

        this.loadAudioTypes = function () {
            return sendHttpGetJSONRequest(audioTypesFile);
        };

        this.loadPhysTypes = function () {
            return sendHttpGetJSONRequest(physTypesFile);
        };
        
        this.loadCollisionTypes = function () {
            return sendHttpGetJSONRequest(collisionTypesFile);
        };

        this.loadAllAudio = function () {
            return sendHttpGetJSONRequest(audioFile);
        };

        this.loadAllShaders = function () {
            return sendHttpGetJSONRequest(shadersFile);
        };

        this.loadAllTextureInformation = function () {
            return sendHttpGetJSONRequest(textureInformationFile);
        };

        this.loadAllBehaviorInstanceDefinitions = function () {
            return sendHttpGetJSONRequest(behaviorInstanceDefinitionsFile);
        };

        this.loadAllGraphicsInstanceDefinitions = function () {
            return new Promise(function (resolve, reject) {
                Promise.all([sendHttpGetJSONRequest(graphicsAnimationInstanceDefinitionsFile), sendHttpGetJSONRequest(graphicsFontInstanceDefinitionsFile)]).then(function (values) {
                    var gaids = values[0];
                    var gfids = values[1];

                    var data = {
                        animations: gaids,
                        fonts: gfids
                    };
                    resolve(data);
                });
            });
        };

        this.loadAllPhysicsInstanceDefinitions = function () {
            return sendHttpGetJSONRequest(physicsInstanceDefinitionsFile);
        };

        this.loadAllEntityInstanceDefinitions = function () {
            return sendHttpGetJSONRequest(entityInstanceDefinitionsFile);
        };

        var loadLevelLayout = function (levelId) {
            var levelLayoutToLoad = levelLayouts[levelId];
            if (levelLayoutToLoad.playerPosition) { // intentional truthiness
                messengerEngine.queueForPosting("createAndPositionPlayerEntityInstance", {
                    position: {
                        x: levelLayoutToLoad.playerPosition.x,
                        y: levelLayoutToLoad.playerPosition.y
                    }
                });
            }
            levelLayouts[levelId].layout.forEach(function (ll) {
                messengerEngine.queueForPosting("createEntityInstance", ll.entityInstanceDefinitionId, ll.priority, {
                    position: {
                        x: ll.x,
                        y: ll.y
                    }, data: ll.data
                });
            });
        };

        this.loadLevel = function (levelId, priority) {
            messengerEngine.queueForPosting("removeEntityInstancesByPriority", priority);
            // TODO: Caching?
            if (levelLayouts[levelId] == null) { // intentional truthiness
                readLevelLayout(levelId).then(function (data) {
                    levelLayouts[levelId] = data;
                    loadLevelLayout(levelId);
                });
            } else {
                loadLevelLayout(levelId);
            }
        };

        setupLevelCache();

        messengerEngine.register("loadLevel", this, this.loadLevel);
    };

    namespace.Globals = namespace.Globals || {};
    namespace.Globals.globalDataEngine = new namespace.Engines.DataEngine();

}(window.TTTD = window.TTTD || {}));
