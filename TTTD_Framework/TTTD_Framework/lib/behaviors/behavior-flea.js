(function () {
    if (BehaviorFlea === undefined) {
        var BehaviorFlea = function (entity) {
            this.instanceId = entity.instanceId;
            this.transformation = entity.transformation;

            this.physComp = null;

            var numRows = 31;
            var viewportHeight = 512;
            var mushroomHeight = 16;
            var rowStartPoint = mushroomHeight / 2;
            var rowEndPoint = rowStartPoint + (numRows * mushroomHeight) - mushroomHeight * 2;

            var canDrop = false;
            var dropChance = .85;

            var hitState = 0;

            var messengerEngine = globalMessengerEngine;

            this.update = function (delta) {
                if (this.data["velocity"] !== undefined) {
                    var vel = this.data["velocity"];
                    this.transformation.setVelocity(0.0, vel);
                }
                if (this.data["playerBulletDamage"] !== undefined) {
                    this.playerBulletDamage();
                } else if (this.physComp != null) {
                    if (this.transformation.position.y >= 530) {
                        // fell off the map
                        messengerEngine.queueForPosting("removeEntityInstance", this.instanceId);
                    } else {
                        var distance = (this.transformation.position.y - rowStartPoint) % 16;
                        if (distance <= .1) {
                            if (canDrop && Math.random() <= dropChance && this.physComp != null && this.physComp.colliders.length > 0) {
                                messengerEngine.queueForPosting("createEntityInstance", "Mushroom", {
                                    position: {
                                        x: this.transformation.position.x,
                                        y: this.transformation.position.y - distance
                                    }
                                });
                                canDrop = false;
                            }
                        } else {
                            canDrop = true;
                        }
                    }

                    for (var i = 0; i < this.physComp.colliders.length; ++i) {
                        var c = this.physComp.colliders[i];
                        messengerEngine.queueForPosting("setBehaviorInstanceData", c.instanceId, { fleaDamage: 1 });
                    };
                }
            };

            this.playerBulletDamage = function () {
                if (hitState === 0) {
                    hitState = 1;
                    this.transformation.setVelocity(0, this.transformation.velocity.y * 1.5);
                } else {
                    var score = 200;
                    messengerEngine.queueForPosting("incrementPlayerScore", score);
                    messengerEngine.queueForPosting("createEntityInstance", "Kaboom", {
                        position: this.transformation.position.toXYObject(), data: {
                            score: score
                        }
                    });
                    messengerEngine.queueForPosting("removeEntityInstance", this.instanceId);
                    messengerEngine.postImmediate("playAudio", "EnemyDeath");
                }
            };

            this.playerDeath = function () {
                messengerEngine.queueForPosting("removeEntityInstance", this.instanceId);
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

            messengerEngine.postImmediate("playAudio", "Flea");
        };

        globalMessengerEngine.postImmediate("setBehaviorConstructor", "BehaviorFlea", BehaviorFlea);
    }
}());