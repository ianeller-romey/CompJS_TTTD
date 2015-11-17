(function () {
    if (BehaviorScorpion === undefined) {
        var BehaviorScorpion = function (entity) {
            this.instanceId = entity.instanceId;
            this.transformation = entity.transformation;

            this.physComp = null;

            this.xDirection = null;
            var velocityAmount = .25;

            var messengerEngine = globalMessengerEngine;

            if (this.transformation.position.x > 256) {
                messengerEngine.queueForPosting("setInstanceAnimationState", this.instanceId, 0);
                this.transformation.setVelocity(-velocityAmount, 0.0);
                this.xDirection = function () {
                    return this.transformation.position.x <= -10;
                };
            } else {
                messengerEngine.queueForPosting("setInstanceAnimationState", this.instanceId, 1);
                this.transformation.setVelocity(velocityAmount, 0.0);
                this.xDirection = function () {
                    return this.transformation.position.x >= 528;
                };
            }

            this.update = function (delta) {
                if (this.data["playerBulletDamage"] !== undefined) {
                    this.playerBulletDamage();
                } else {
                    if (this.xDirection()) {
                        messengerEngine.queueForPosting("removeEntityInstance", this.instanceId);
                    }

                    if (this.physComp != null) {
                        for (var i = 0; i < this.physComp.colliders.length; ++i) {
                            var c = this.physComp.colliders[i];
                            messengerEngine.queueForPosting("setBehaviorInstanceData", c.instanceId, { scorpionDamage: 1 });
                        }
                    }
                }
            };

            this.playerBulletDamage = function () {
                var score = 1000;
                messengerEngine.queueForPosting("incrementPlayerScore", score);
                messengerEngine.queueForPosting("createEntityInstance", "Kaboom", {
                    position: this.transformation.position.toXYObject(16, 0), data: {
                        score: score
                    }
                });
                messengerEngine.queueForPosting("removeEntityInstance", this.instanceId);
                messengerEngine.postImmediate("stopAudio", "Scorpion");
                messengerEngine.postImmediate("playAudio", "EnemyDeath");
            };

            this.playerDeath = function () {
                messengerEngine.queueForPosting("removeEntityInstance", this.instanceId);
                messengerEngine.postImmediate("stopAudio", "Scorpion");
            };

            this.capturePhysicsInstance = function (physComp, instanceId) {
                if (instanceId === this.instanceId) {
                    this.physComp = physComp;
                    messengerEngine.unregister("createdPhysicsInstance", this.capturePhysicsInstance);
                }
            };

            messengerEngine.register("playerDeath", this, this.playerDeath);
            messengerEngine.register("playerBulletDamage", this, this.playerBulletDamage);
            messengerEngine.register("createdPhysicsInstance", this, this.capturePhysicsInstance);

            messengerEngine.postImmediate("startAudio", "Scorpion");
        };

        globalMessengerEngine.postImmediate("setBehaviorConstructor", "BehaviorScorpion", BehaviorScorpion);
    }
}());