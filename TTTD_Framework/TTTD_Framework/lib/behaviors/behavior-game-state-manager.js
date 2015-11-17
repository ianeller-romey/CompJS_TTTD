(function () {
    if (BehaviorGameStateManager === undefined) {
        var BehaviorGameStateManager = function (entity) {
            this.instanceId = entity.instanceId;
            var that = this;

            var state;
            var stateMainMenu = 1;
            var stateDisplayHighScores = 2;
            var stateInGame = 3;
            var statePostGame = 4;

            var gameId = null;

            var activeEntities = [];
            var entityMenuCursorState;
            var entityMenuCursorIndex = null;
            var entityStartGameIndex = null;
            var entityHighScoresIndex = null;
            var entityScoreIndex = null;
            var entityScoreBehavior = null;
            var entityPlayerNameIndex = null;
            var playerNameAtGameOver = "";
            var scoreAtGameOver = 0;
            var maxNameLength = 16;

            var resumeAfterHalftime = true;
            var currentWave = 0;
            var waveColors = [{
                r: 0,
                g: 0,
                b: 0
            }, {
                r: 0,
                g: -1,
                b: .75
            }, {
                r: 0,
                g: .75,
                b: 1
            }, {
                r: .75,
                g: -.45,
                b: -1
            }, {
                r: -.5,
                g: -.5,
                b: .5
            }, {
                r: -1,
                g: 0,
                b: -1
            }, {
                r: .35,
                g: -1,
                b: -1
            }, {
                r: 0,
                g: 1,
                b: .25
            }, {
                r: -.25,
                g: .75,
                b: -.25
            }, {
                r: -.5,
                g: -.5,
                b: -1
            }];

            var messengerEngine = globalMessengerEngine;
            var servicesEngine = globalServicesEngine;
            var inputManager = globalInputManager;

            var addToActiveEntities = function (id) {
                activeEntities.push(id);
            };

            var clearActiveEntities = function() {
                activeEntities.forEach(function(x){
                    messengerEngine.queueForPosting("removeEntityInstance", x);
                });
                activeEntities = [];
            };

            var controllerUp = function () {
                return inputManager.isTriggered(inputManager.keys.arrowUp) || inputManager.isTriggered(inputManager.keys.w);
            };

            var controllerDown = function () {
                return inputManager.isTriggered(inputManager.keys.arrowDown) || inputManager.isTriggered(inputManager.keys.s);
            };

            var controllerSelect = function () {
                return inputManager.isTriggered(inputManager.keys.space) || inputManager.isTriggered(inputManager.keys.enter)
            };

            var moveMainMenuCursor = function (upOrDown) {
                if (upOrDown) {
                    entityMenuCursorState = stateInGame;
                    messengerEngine.queueForPosting("setInstancePosition", activeEntities[entityMenuCursorIndex], {
                        x: 80,
                        y: 226
                    });
                    messengerEngine.queueForPosting("setInstanceScale", activeEntities[entityStartGameIndex], {
                        x: 2,
                        y: 2
                    });
                    messengerEngine.queueForPosting("setInstanceScale", activeEntities[entityHighScoresIndex], {
                        x: 1,
                        y: 1
                    });
                } else {
                    entityMenuCursorState = stateDisplayHighScores;
                    messengerEngine.queueForPosting("setInstancePosition", activeEntities[entityMenuCursorIndex], {
                        x: 80,
                        y: 276
                    });
                    messengerEngine.queueForPosting("setInstanceScale", activeEntities[entityStartGameIndex], {
                        x: 1,
                        y: 1
                    });
                    messengerEngine.queueForPosting("setInstanceScale", activeEntities[entityHighScoresIndex], {
                        x: 2,
                        y: 2
                    });
                }
            };

            var initMainMenu = function () {
                clearActiveEntities();
                state = stateMainMenu;

                messengerEngine.postImmediate("createEntityInstance", "Text_LargeGreenFont", {
                    position: {
                        x: 4,
                        y: 0
                    },
                    scale: {
                        x: 3.5,
                        y: 4
                    }
                }, function (id) {
                    activeEntities.push(id);
                    messengerEngine.queueForPosting("setInstanceText", id, "CENTIPEDE");
                });
                messengerEngine.postImmediate("createEntityInstance", "MenuCursor", {
                    position: {
                        x: 80,
                        y: 226
                    }
                }, function (id) {
                    entityMenuCursorIndex = activeEntities.push(id) - 1;
                });
                messengerEngine.postImmediate("createEntityInstance", "Text_LargeGreenFont", {
                    position: {
                        x: 100,
                        y: 206
                    }
                }, function (id) {
                    entityStartGameIndex = activeEntities.push(id) - 1;
                    messengerEngine.queueForPosting("setInstanceText", id, "Start Game");
                });
                messengerEngine.postImmediate("createEntityInstance", "Text_LargeGreenFont", {
                    position: {
                        x: 100,
                        y: 256
                    }
                }, function (id) {
                    entityHighScoresIndex = activeEntities.push(id) - 1;
                    messengerEngine.queueForPosting("setInstanceText", id, "High Scores");
                });
                messengerEngine.postImmediate("createEntityInstance", "Text_LargeRedFont", {
                    position: {
                        x: 0,
                        y: 476
                    }
                }, function (id) {
                    activeEntities.push(id);
                    messengerEngine.queueForPosting("setInstanceText", id, "Copyright (C) 2015 Microsoft Corporation.\nAll rights reserved.");
                });

                moveMainMenuCursor(true);
                messengerEngine.queueForPosting("playAudio", "GameLife");
            };

            var updateMainMenu = function () {
                if (controllerUp()) {
                    moveMainMenuCursor(true);
                } else if (controllerDown()) {
                    moveMainMenuCursor(false);
                } else if (controllerSelect()) {
                    switch (entityMenuCursorState) {
                        case stateInGame:
                            initInGame();
                            break;

                        case stateDisplayHighScores:
                            initDisplayHighScores();
                            break;
                    }
                }
            };

            var initDisplayHighScores = function () {
                clearActiveEntities();
                state = stateDisplayHighScores;

                messengerEngine.postImmediate("createEntityInstance", "Text_LargeRedFont", {
                    position: {
                        x: 91,
                        y: 0
                    },
                    scale: {
                        x: 2.5,
                        y: 2.5
                    }
                }, function (id) {
                    activeEntities.push(id);
                    messengerEngine.queueForPosting("setInstanceText", id, "High Scores");
                });
                servicesEngine.retrieveHighScoresForGame(gameId, 10).then(function (data) {
                    var yStart = 100;
                    var characterHeight = 16;
                    var s = 1;
                    for (var i = 0, j = data.length; i < j; ++i) {
                        messengerEngine.postImmediate("createEntityInstance", "Text_LargeRedFont", {
                            position: {
                                x: 91,
                                y: yStart + (i * characterHeight * s) + 10
                            },
                            scale: {
                                x: s,
                                y: s
                            }
                        }, function (id) {
                            activeEntities.push(id);
                            messengerEngine.queueForPosting("setInstanceText", id, data[i].playerName + ": " + data[i].score);
                        });
                    }
                });
            };

            var updateDisplayHighScores = function () {
                if (inputManager.isAnyTriggered()) {
                    initMainMenu();
                }
            };

            var initInGame = function () {
                clearActiveEntities();
                state = stateInGame;

                messengerEngine.postImmediate("createEntityInstance", "MushroomManager", null, addToActiveEntities);
                messengerEngine.postImmediate("createEntityInstance", "CentipedeManager", null, addToActiveEntities);
                messengerEngine.postImmediate("createEntityInstance", "MinionManager", null, addToActiveEntities);
                messengerEngine.postImmediate("createEntityInstance", "Score", null, function (id) {
                    entityScoreIndex = activeEntities.push(id) - 1;
                    var getScoreBehaviorCompInstance = function (bhv) {
                        messengerEngine.unregister("getBhvCompInstanceForEntityInstanceResponse", getScoreBehaviorCompInstance);
                        entityScoreBehavior = bhv.behavior;
                    };
                    messengerEngine.register("getBhvCompInstanceForEntityInstanceResponse", this, getScoreBehaviorCompInstance);
                    messengerEngine.postImmediate("getBhvCompInstanceForEntityInstanceRequest", id);
                });
                messengerEngine.postImmediate("createEntityInstance", "Lives", null, addToActiveEntities);
                messengerEngine.postImmediate("createEntityInstance", "Text_LargeRedFont", {
                    position: {
                        x: 380,
                        y: 0
                    }
                }, function (id) {
                    activeEntities.push(id);
                    servicesEngine.retrieveHighScoresForGame(gameId, 1).then(function (data) {
                        if (data.length === 1) {
                            messengerEngine.postImmediate("setInstanceText", id, "HIGH SCORE:\n" + data[0].score);
                        }
                    });
                });

                resumeAfterHalftime = true;
                halftimeEnd();
            };

            var updateInGame = function () {
            };

            var initPostGame = function () {
                playerNameAtGameOver = "";
                scoreAtGameOver = entityScoreBehavior.score;
                clearActiveEntities();
                state = statePostGame;

                messengerEngine.postImmediate("createEntityInstance", "Text_LargeRedFont", {
                    position: {
                        x: 32,
                        y: 128
                    },
                    scale: {
                        x: 2,
                        y: 2
                    }
                }, function (id) {
                    activeEntities.push(id);
                    messengerEngine.queueForPosting("setInstanceText", id, "SCORE:\n" + scoreAtGameOver);
                });
                messengerEngine.postImmediate("createEntityInstance", "Text_LargeGreenFont", {
                    position: {
                        x: 32,
                        y: 256
                    },
                    scale: {
                        x: 1.75,
                        y: 1.75
                    }
                }, function (id) {
                    activeEntities.push(id);
                    var underscoreString = "";
                    while (underscoreString.length < maxNameLength) {
                        underscoreString += "_";
                    }
                    messengerEngine.queueForPosting("setInstanceText", id, underscoreString);
                });
                messengerEngine.postImmediate("createEntityInstance", "Text_LargeGreenFont", {
                    position: {
                        x: 32,
                        y: 220
                    },
                    scale: {
                        x: 1.75,
                        y: 1.75
                    }
                }, function (id) {
                    entityPlayerNameIndex = activeEntities.push(id) - 1;
                    messengerEngine.queueForPosting("clearInstanceText", id);
                });
            };

            var updatePostGame = function () {
                if (playerNameAtGameOver.length > 0 && inputManager.isTriggered(inputManager.keys.enter)) {
                    servicesEngine.createHighScoreForGame(gameId, playerNameAtGameOver, scoreAtGameOver, 10).then(function () {
                        initDisplayHighScores();
                    });
                } else if (playerNameAtGameOver.length > 0 && inputManager.isTriggered(inputManager.keys.backspace)) {
                    playerNameAtGameOver = playerNameAtGameOver.slice(0, -1);
                    if (playerNameAtGameOver.length > 0) {
                        messengerEngine.queueForPosting("setInstanceText", activeEntities[entityPlayerNameIndex], playerNameAtGameOver);
                    } else {
                        messengerEngine.queueForPosting("clearInstanceText", activeEntities[entityPlayerNameIndex]);
                    }
                } else {
                    if (playerNameAtGameOver.length < maxNameLength && inputManager.isAnyTriggered()) {
                        var kc = inputManager.getFirstTriggered();
                        if (inputManager.isCharacter(kc)) {
                            var char = (inputManager.isPressed(inputManager.keys.shift)) ? inputManager.toShiftedCharacter(kc) : inputManager.toCharacter(kc);
                            playerNameAtGameOver += char;
                            messengerEngine.queueForPosting("setInstanceText", activeEntities[entityPlayerNameIndex], playerNameAtGameOver);
                        }
                    }
                }
            };

            this.update = function () {
                switch (state) {
                    case stateMainMenu:
                        updateMainMenu();
                        break;

                    case stateDisplayHighScores:
                        updateDisplayHighScores();
                        break;

                    case stateInGame:
                        updateInGame();
                        break;

                    case statePostGame:
                        updatePostGame();
                        break;
                }
            };

            var halftimeStart = function (zeroLives) {
                resumeAfterHalftime = zeroLives;
            };

            var halftimeEnd = function () {
                if (resumeAfterHalftime) {
                    messengerEngine.queueForPosting("nextWave", false);
                    messengerEngine.queueForPosting("createEntityInstance", "Player", {
                        position: {
                            x: 256,
                            y: 490
                        }
                    });
                } else {
                    messengerEngine.postImmediate("removeAllEntityInstancesButOne", that.instanceId);
                    initPostGame();
                }
            };

            var nextWave = function (incrementWave) {
                if (incrementWave) {
                    ++currentWave;
                }
                var currentColor = currentWave % waveColors.length;
                messengerEngine.queueForPosting("setColorInversion", {
                    r: waveColors[currentColor].r,
                    g: waveColors[currentColor].g,
                    b: waveColors[currentColor].b,
                });
            };
            
            messengerEngine.register("halftimeStart", this, halftimeStart);
            messengerEngine.register("halftimeEnd", this, halftimeEnd);
            messengerEngine.register("nextWave", this, nextWave);

            var getGameId = function (gId) {
                messengerEngine.unregister("getGameIdResponse", getGameId);
                gameId = gId;
            };
            messengerEngine.register("getGameIdResponse", this, getGameId);
            messengerEngine.postImmediate("getGameIdRequest");
            messengerEngine.postImmediate("setShaderProgram", "TextureColorChange", 0);

            initMainMenu();
        };

        globalMessengerEngine.postImmediate("setBehaviorConstructor", "BehaviorGameStateManager", BehaviorGameStateManager);
    }
}());