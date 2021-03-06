﻿(function (namespace, undefined) {
    "use strict";

    ////////
    // GameStateEngine
    namespace.Engines = namespace.Engines || {};
    namespace.Engines.GameStateEngine = function () {
        var gameStates = [namespace.Engines.GameStateEngine.defaultGameState];
        var activeAudGameStates = [];
        var activeBhvGameStates = [];
        var activeGfxGameStates = [];
        var activePhysGameStates = [];

        var that = this;

        var addGameStateToAnyArray = function (array, gameState) {
            if (!array.contains(gameState)) {
                array.push(gameState);
            }
        };

        var removeGameStateFromArray = function (array, gameState) {
            for (var i = 0; i < array.length; ++i) {
                if (array[i] === gameState) {
                    array.splice(i, 1);
                    break;
                }
            }
        };

        this.getGameStates = function () {
            return gameStates;
        }

        this.getActiveAudGameStates = function () {
            return activeAudGameStates;
        };

        this.getActiveBhvGameStates = function () {
            return activeBhvGameStates;
        };

        this.getActiveGfxGameStates = function () {
            return activeGfxGameStates;
        };

        this.getActivePhysGameStates = function () {
            return activePhysGameStates;
        };

        this.addGameState = function (gameState) {
            if (namespace.DebugEnabled === true) {
                if (typeof (gameState) !== "string") {
                    throw "Game states must be named.";
                }
            }
            addGameStateToAnyArray(gameStates, gameState);
        };

        this.removeGameState = function (gameState) {
            removeGameStateFromArray(gameStates, gameState);
            removeGameStateFromArray(activeAudGameStates, gameState);
            removeGameStateFromArray(activeBhvGameStates, gameState);
            removeGameStateFromArray(activeGfxGameStates, gameState);
            removeGameStateFromArray(activePhysGameStates, gameState);
        };

        this.addAudGameState = function (gameState) {
            that.addGameState(gameState);
            addGameStateToAnyArray(activeAudGameStates, gameState);
        };

        this.addBhvGameState = function (gameState) {
            that.addGameState(gameState);
            addGameStateToAnyArray(activeBhvGameStates, gameState);
        };


        this.addGfxGameState = function (gameState) {
            that.addGameState(gameState);
            addGameStateToAnyArray(activeGfxGameStates, gameState);
        };


        this.addPhysGameState = function (gameState) {
            that.addGameState(gameState);
            addGameStateToAnyArray(activePhysGameStates, gameState);
        };


        this.addActiveGameStateForAllEngines = function (gameState, addAud, addBhv, addGfx, addPhys) {
            that.addGameState(gameState);
            if (addAud) { // intentional truthiness
                that.addAudGameState(gameState);
            }
            if (addBhv) { // intentional truthiness
                that.addBhvGameState(gameState);
            }
            if (addGfx) { // intentional truthiness
                that.addGfxGameState(gameState);
            }
            if (addPhys) { // intentional truthiness
                that.addPhysGameState(gameState);
            }
        };

        this.addActiveGameStateForAllEngines(namespace.Engines.GameStateEngine.defaultGameState, true, true, true, true);
        this.addActiveGameStateForAllEngines(namespace.Engines.GameStateEngine.explorationGameState, true, true, true, true);
        this.addActiveGameStateForAllEngines(namespace.Engines.GameStateEngine.combatGameState, false, false, false, false);
        this.addActiveGameStateForAllEngines(namespace.Engines.GameStateEngine.tutorialGameState, false, false, false, false);
        this.addActiveGameStateForAllEngines(namespace.Engines.GameStateEngine.dialogGameState, false, false, false, false);
        this.addActiveGameStateForAllEngines(namespace.Engines.GameStateEngine.menuGameState, false, false, false, false);
    };

    // ordered from lowest to highest priority
    namespace.Engines.GameStateEngine.defaultGameState = "default";
    namespace.Engines.GameStateEngine.explorationGameState = "exploration";
    namespace.Engines.GameStateEngine.combatGameState = "combat";
    namespace.Engines.GameStateEngine.tutorialGameState = "tutorial";
    namespace.Engines.GameStateEngine.dialogGameState = "dialog";
    namespace.Engines.GameStateEngine.menuGameState = "menu";

    namespace.Globals = namespace.Globals || {};
    namespace.Globals.globalGameStateEngine = new namespace.Engines.GameStateEngine();

}(window.TTTD = window.TTTD || {}));
