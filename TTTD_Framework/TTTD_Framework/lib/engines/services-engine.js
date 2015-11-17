
var ServicesEngine = function () {
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

    var sendHttpGetAudioRequest = function (url, parameters) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.url = url;
        xmlHttp.open("GET", url, true);
        xmlHttp.responseType = "arraybuffer";

        return httpPromise(xmlHttp, parameters, function (x) {
            return x.response;
        });
    };

    var sendHttpPostJSONRequest = function (url, parameters) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.url = url;
        xmlHttp.open("POST", url, true);
        xmlHttp.setRequestHeader("Content-type", "text/plain");

        return httpPromise(xmlHttp, parameters, function (x) {
            return JSON.parse(x.responseText);
        });
    };

    this.retrieveAudioTypes = function () {
        return sendHttpGetJSONRequest("compjsservices/compjs/AudioTypes/");
    };

    this.retrievePhysTypes = function () {
        return sendHttpGetJSONRequest("compjsservices/compjs/PhysTypes/");
    };

    this.retrieveCollisionTypes = function () {
        return sendHttpGetJSONRequest("compjsservices/compjs/CollisionTypes/");
    };

    this.retrieveAllGames = function () {
        return sendHttpGetJSONRequest("compjsservices/game/");
    };

    this.retrieveAllLevelsForGame = function (gameId) {
        return sendHttpGetJSONRequest("compjsservices/game/" + gameId + "/levels");
    };

    this.retrieveAllEntityTypeDefinitionsForGame = function (gameId) {
        return sendHttpGetJSONRequest("compjsservices/game/" + gameId + "/ent/")
    };

    this.retrieveAllAudioForGame = function (gameId) {
        return sendHttpGetJSONRequest("compjsservices/game/" + gameId + "/aud/");
    };

    this.retrieveAllBhvCompDefinitionsForGame = function (gameId) {
        return sendHttpGetJSONRequest("compjsservices/game/" + gameId + "/bhv/");
    };

    this.retrieveAllGfxCompDefinitionsForGame = function (gameId) {
        return sendHttpGetJSONRequest("compjsservices/game/" + gameId + "/gfx/");
    };

    this.retrieveAllShadersForGame = function (gameId) {
        return sendHttpGetJSONRequest("compjsservices/game/" + gameId + "/shaders/");
    };

    this.retrieveAllPhysCompDefinitionsForGame = function (gameId) {
        return sendHttpGetJSONRequest("compjsservices/game/" + gameId + "/phys/");
    };

    this.retrieveHighScoresForGame = function (gameId, count) {
        return sendHttpGetJSONRequest("compjsservices/game/" + gameId + "/highscores/" + count);
    };

    this.createHighScoreForGame = function (gameId, playerName, score, count) {
        return sendHttpPostJSONRequest("compjsservices/game/" + gameId + "/highscores/" + playerName + "/" + score + "/" + count);
    };

    this.loadLevel = function (gameId, levelId) {
        return sendHttpGetJSONRequest("compjsservices/game/" + gameId + "/levels/" + levelId);
    };

    this.loadAudio = function (url) {
        return sendHttpGetAudioRequest(url);
    };
};

var globalServicesEngine = new ServicesEngine();