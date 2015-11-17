(function () {
    if (BehaviorScore === undefined) {
        var BehaviorScore = function (entity) {
            this.instanceId = entity.instanceId;
            this.scoreTextInstanceId = null;

            this.score = 0;
            var scoreElem = null;

            var messengerEngine = globalMessengerEngine;

            var that = this;
            var init = function () {
                messengerEngine.queueForPosting("createEntityInstance", "Text_LargeRedFont", {
                    position: {
                        x: 0,
                        y: 0
                    }}, function (x) {
                        that.scoreTextInstanceId = x;
                        incrementPlayerScore(0);
                });
            };

            this.update = function () {
            };

            var incrementPlayerScore = function (scoreIncr) {
                that.score += scoreIncr;
                messengerEngine.queueForPosting("setInstanceText", that.scoreTextInstanceId, "SCORE: " + that.score);
            };

            init();

            messengerEngine.register("incrementPlayerScore", this, incrementPlayerScore);
        };

        globalMessengerEngine.postImmediate("setBehaviorConstructor", "BehaviorScore", BehaviorScore);
    }
}());