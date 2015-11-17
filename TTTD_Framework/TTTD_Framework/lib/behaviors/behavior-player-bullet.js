(function () {
    if (BehaviorPlayerBullet === undefined) {
        globalMessengerEngine.addMessageType("playerBulletDamage");

        var BehaviorPlayerBullet = function (entity) {
            this.instanceId = entity.instanceId;
            this.transformation = entity.transformation;

            this.physComp = null;

            var messengerEngine = globalMessengerEngine;

            this.transformation.setVelocity(0, -.35);

            this.update = function () {
                if (this.physComp != null) {
                    if (this.transformation.position.y <= 0) {
                        messengerEngine.queueForPosting("removeEntityInstance", this.instanceId);
                    }

                    for (var i = 0; i < this.physComp.colliders.length; ++i) {
                        var c = this.physComp.colliders[i];
                        if (c.entityTypeName != "Player") {
                            messengerEngine.queueForPosting("removeEntityInstance", this.instanceId);
                            messengerEngine.queueForPosting("setBehaviorInstanceData", c.instanceId, { playerBulletDamage: 1 });
                        }
                    };
                }
            };

            this.capturePhysicsInstance = function (physComp, instanceId) {
                if (instanceId === this.instanceId) {
                    this.physComp = physComp;
                    messengerEngine.unregister("createdPhysicsInstance", this.capturePhysicsInstance);
                }
            };

            messengerEngine.register("createdPhysicsInstance", this, this.capturePhysicsInstance);

            messengerEngine.postImmediate("playAudio", "PlayerBullet");
        };

        globalMessengerEngine.postImmediate("setBehaviorConstructor", "BehaviorPlayerBullet", BehaviorPlayerBullet);
    }
}());