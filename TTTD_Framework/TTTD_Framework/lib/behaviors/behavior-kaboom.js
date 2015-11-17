(function () {
    if (BehaviorKaboom === undefined) {
        var BehaviorKaboom = function (entity) {
            this.instanceId = entity.instanceId;
            this.transformation = entity.transformation;

            var textInstanceId = null;
            var currentDelta = 0;
            var maxDelta = 1000;

            var messengerEngine = globalMessengerEngine;

            this.init = function () {
                var score = this.data["score"];
                messengerEngine.postImmediate("createEntityInstance", "Text_SmallWhiteFont", {
                    position: this.transformation.position.toXYObject(0, 8),
                }, function (id) {
                    textInstanceId = id;
                    messengerEngine.postImmediate("setInstanceText", textInstanceId, score);
                });
            };

            this.update = function (delta) {
                if (this.data["score"] !== undefined) {
                    this.init();
                }
                currentDelta += delta;
                if (currentDelta >= maxDelta) {
                    messengerEngine.queueForPosting("removeEntityInstance", this.instanceId);
                    if (textInstanceId !== null) {
                        messengerEngine.queueForPosting("removeEntityInstance", textInstanceId);
                    }
                }
            };
        };

        globalMessengerEngine.postImmediate("setBehaviorConstructor", "BehaviorKaboom", BehaviorKaboom);
    }
}());