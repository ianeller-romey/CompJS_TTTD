(function () {
    if (BehaviorCentipedeManager === undefined) {
        var BehaviorCentipedeManager = function (entity) {
            this.instanceId = entity.instanceId;

            var sequentialSegments = 10;
            var totalSegments = 0;
            var activeSegments = 0;

            var currentWave = 0;

            var messengerEngine = globalMessengerEngine;

            this.update = function () {
            };

            var nextWave = function (incrementWave) {
                if (incrementWave) {
                    ++currentWave;
                }
                createCentipede();
            };

            var createCentipede = function () {
                totalSegments = sequentialSegments;
                messengerEngine.queueForPosting("createEntityInstance", "CentipedeSegment", {
                    position: {
                        x: 512,
                        y: 8
                    },
                    data: {
                        nextTransformation: null,
                        nextSegment: null,
                        segmentId: 0,
                        sequentialSegments: totalSegments
                    }
                });
                for (var i = 0, j = currentWave / 3; i < j; ++i, ++totalSegments) {
                    var segmentId = sequentialSegments + 2 + (i * 2);
                    messengerEngine.queueForPosting("createEntityInstance", "CentipedeSegment", {
                        position: {
                            x: (Math.random() < .5) ? 512 : 16,
                            y: (Math.random() < .5) ? 488 : 472
                        },
                        data: {
                            nextTransformation: null,
                            nextSegment: null,
                            segmentId: segmentId,
                            sequentialSegments: 0
                        }
                    });
                }
                activeSegments = totalSegments;
                messengerEngine.postImmediate("playAudio", "Centipede");
            };

            var centipedeSegmentDestroyed = function () {
                if (--activeSegments == 0) {
                    globalMessengerEngine.queueForPosting("nextWave", true);
                    messengerEngine.postImmediate("stopAudio", "Centipede");
                }
            };

            var playerDeath = function () {
                activeSegments = 0;
                messengerEngine.postImmediate("stopAudio", "Centipede");
            };

            messengerEngine.register("nextWave", this, nextWave);
            messengerEngine.register("centipedeSegmentDestroyed", this, centipedeSegmentDestroyed);
            messengerEngine.register("playerDeath", this, playerDeath);
        };

        globalMessengerEngine.postImmediate("setBehaviorConstructor", "BehaviorCentipedeManager", BehaviorCentipedeManager);
    }
}());