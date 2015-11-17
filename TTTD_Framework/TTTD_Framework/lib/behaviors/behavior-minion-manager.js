(function () {
    if (BehaviorMinionManager === undefined) {
        var BehaviorMinionManager = function (entity) {
            this.instanceId = entity.instanceId;
            var currentWave = 0;

            var halftime = false;
            var spiderCounter = 0;
            var spiderRelease = 0;
            var spiderActive = false;
            var fleaCounter = 0;
            var fleaRelease = 0;
            var mushroomWidth = 16; // use mushroomWidth instead of fleaWidth
            var viewportWidth = 512;
            var numColumns = 31;
            var columnStartPoint = 0 + (mushroomWidth / 2);
            var columnEndPoint = viewportWidth - (mushroomWidth / 2);

            var playerScore = 0;
            var superPlayerScore = 60000;

            var messengerEngine = globalMessengerEngine;

            var calculateFleaRelease = function () {
                fleaCounter = 0;
                fleaRelease = (Math.random() * 5000);
            };

            this.update = function (delta) {
                if (currentWave >= 0 && !halftime) {
                    if (!spiderActive) {
                        spiderCounter += delta;
                        if (spiderCounter >= spiderRelease) {
                            createSpider();
                        }
                    }
                    if (currentWave >= 1) {
                        fleaCounter += delta;
                        if (fleaCounter >= fleaRelease) {
                            messengerEngine.queueForPosting("createEntityInstance", "Flea", {
                                position: {
                                    x: columnStartPoint + (Math.floor(Math.random() * numColumns) * mushroomWidth),
                                    y: 0
                                },
                                data: {
                                    velocity: (playerScore >= superPlayerScore) ? .4 : .3
                                }
                            });
                            calculateFleaRelease();
                        }
                    }
                }
            };

            var createSpider = function () {
                spiderActive = true;
                messengerEngine.queueForPosting("createEntityInstance", "Spider", {
                    position: {
                        x: (Math.random() <= .5) ? 0 : 512,
                        y: 256
                    },
                    data: {
                        ceiling: (playerScore >= superPlayerScore) ? 300 : 200
                    }
                });
            };

            var createScorpion = function () {
                messengerEngine.queueForPosting("createEntityInstance", "Scorpion", {
                    position: {
                        x: (Math.random() <= .5) ? 0 : 512,
                        y: 256 - 8 - (16 * Math.floor(Math.random() * 10))
                    }
                });
            };

            var nextWave = function (incrementWave) {
                if (incrementWave) {
                    ++currentWave;
                }

                if (currentWave >= 0) {
                    if (!spiderActive) {
                        calculateSpiderRelease();
                    }

                    if (currentWave >= 1) {
                        calculateFleaRelease();

                        if (currentWave >= 5) {
                            createScorpion();
                        }
                    }
                }
            };
            
            var calculateSpiderRelease = function () {
                spiderCounter = 0;
                spiderRelease = (Math.random() * 5000);
                spiderActive = false;
            };

            var halftimeStart = function () {
                halftime = true;
            };

            var halftimeEnd = function () {
                halftime = false;
            };

            var incrementPlayerScore = function (scoreIncr) {
                playerScore += scoreIncr;
            };

            messengerEngine.register("nextWave", this, nextWave);
            messengerEngine.register("spiderDestroyed", this, calculateSpiderRelease);
            messengerEngine.register("halftimeStart", this, halftimeStart);
            messengerEngine.register("halftimeEnd", this, halftimeEnd);
            messengerEngine.register("incrementPlayerScore", this, incrementPlayerScore);

            calculateSpiderRelease();
        };

        globalMessengerEngine.postImmediate("setBehaviorConstructor", "BehaviorMinionManager", BehaviorMinionManager);
    }
}());