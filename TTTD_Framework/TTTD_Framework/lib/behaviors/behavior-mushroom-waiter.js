(function () {
    if (BehaviorMushroomWaiter === undefined) {
        var BehaviorMushroomWaiter = function (entity) {
            this.instanceId = entity.instanceId;
            this.transformation = entity.transformation;

            this.physComp = null;

            var messengerEngine = globalMessengerEngine;

            this.update = function () {
                if (this.physComp != null && this.physComp.colliders.length === 0) {
                    messengerEngine.queueForPosting("removeEntityInstance", this.instanceId);
                    messengerEngine.queueForPosting("createEntityInstance", "Mushroom", {
                        position: {
                            x: this.transformation.position.x,
                            y: this.transformation.position.y
                        }
                    });
                }
            };

            this.capturePhysicsInstance = function (physComp, instanceId) {
                if (instanceId == this.instanceId) {
                    this.physComp = physComp;
                    messengerEngine.unregister("createdPhysicsInstance", this.capturePhysicsInstance);
                }
            };

            messengerEngine.register("createdPhysicsInstance", this, this.capturePhysicsInstance);
        };

        globalMessengerEngine.postImmediate("setBehaviorConstructor", "BehaviorMushroomWaiter", BehaviorMushroomWaiter);
    }
}());