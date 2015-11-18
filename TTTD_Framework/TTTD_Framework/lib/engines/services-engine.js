(function (namespace, undefined) {
    "use strict";

    namespace.Engines = namespace.Engines || {};
    namespace.Engines.ServicesEngine = function () {
        this.retrieveAudioTypes = function () {
            return sendHttpGetJSONRequest("compjsservices/compjs/audioTypes/");
        };

        this.retrievePhysTypes = function () {
            return sendHttpGetJSONRequest("compjsservices/compjs/physTypes/");
        };

        this.retrieveCollisionTypes = function () {
            return sendHttpGetJSONRequest("compjsservices/compjs/collisionTypes/");
        };

        this.retrieveAllLevelsForGame = function () {
            return sendHttpGetJSONRequest("compjsservices/game/levels/");
        };

        this.retrieveAllEntityTypeDefinitionsForGame = function () {
            return sendHttpGetJSONRequest("compjsservices/game/ent/");
        };

        this.retrieveAllAudioForGame = function () {
            return sendHttpGetJSONRequest("compjsservices/game/aud/");
        };

        this.retrieveAllBhvCompDefinitionsForGame = function () {
            return sendHttpGetJSONRequest("compjsservices/game/bhv/");
        };

        this.retrieveAllGfxCompDefinitionsForGame = function () {
            return sendHttpGetJSONRequest("compjsservices/game/gfx/");
        };

        this.retrieveAllShadersForGame = function () {
            return sendHttpGetJSONRequest("compjsservices/game/shaders/");
        };

        this.retrieveAllPhysCompDefinitionsForGame = function () {
            return sendHttpGetJSONRequest("compjsservices/game/phys/");
        };

        this.loadLevel = function (levelId) {
            return sendHttpGetJSONRequest("compjsservices/game/levels/" + levelId);
        };
    };
    globalServicesEngine = new namespace.Engines.ServicesEngine();

}(window.TTTD = window.TTTD || {}));
