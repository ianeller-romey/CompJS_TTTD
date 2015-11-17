(function () {
    if (BehaviorLife === undefined) {
        var BehaviorLife = function (entity) {
            this.instanceId = entity.instanceId;

            var life = null;

            var messengerEngine = globalMessengerEngine;

            this.update = function () {
                if (this.data["life"] !== undefined) {
                    life = this.data["life"];
                }
            };

            this.removeLife = function (lifeToRemove) {
                if (life === lifeToRemove) {
                    messengerEngine.queueForPosting("removeEntityInstance", this.instanceId);
                }
            };

            messengerEngine.register("removeLife", this, this.removeLife);
        };

        globalMessengerEngine.postImmediate("setBehaviorConstructor", "BehaviorLife", BehaviorLife);
    }
}());