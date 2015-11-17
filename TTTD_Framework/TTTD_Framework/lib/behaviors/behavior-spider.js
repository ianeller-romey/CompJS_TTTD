(function () {
    if (BehaviorSpider === undefined) {
        var BehaviorSpider = function (entity) {
            this.instanceId = entity.instanceId;
            this.transformation = entity.transformation;

            this.physComp = null;

            var playerInstanceId = null;
            var playerPosition = null;

            var ceiling = 0;
            var durationSwitchDirection = 750;
            var durationCurrent = durationSwitchDirection;
            var velocityAmount = .15;

            var messengerEngine = globalMessengerEngine;

            this.update = function (delta) {
                if (this.physComp != null) {
                    for (var i = 0; i < this.physComp.colliders.length; ++i) {
                        var c = this.physComp.colliders[i];
                        if (c.entityTypeName === "Player") {
                            messengerEngine.queueForPosting("setBehaviorInstanceData", c.instanceId, { centipedeDamage: 1 });
                        }
                    };
                }

                if (this.data["ceiling"] !== undefined) {
                    ceiling = this.data["ceiling"];
                }

                if (this.data["playerBulletDamage"] !== undefined) {
                    this.playerBulletDamage();
                } else {
                    if (this.transformation.position.x >= 512) {
                        this.transformation.setVelocity(this.switchDirectionX(-velocityAmount), this.switchDirectionY());
                        durationCurrent = 0;
                    } else if (this.transformation.position.x <= 0) {
                        this.transformation.setVelocity(this.switchDirectionX(velocityAmount), this.switchDirectionY());
                        durationCurrent = 0;
                    }

                    if (this.transformation.position.y >= 512) {
                        this.transformation.setVelocity(this.switchDirectionX(), this.switchDirectionY(-velocityAmount));
                        durationCurrent = 0;
                    } else if (this.transformation.position.y <= ceiling) {
                        this.transformation.setVelocity(this.switchDirectionX(), this.switchDirectionY(velocityAmount));
                        durationCurrent = 0;
                    } else {
                        durationCurrent += delta;
                        if (durationCurrent >= durationSwitchDirection) {
                            this.switchDirection();
                            durationCurrent = 0;
                        }
                    }

                    if (this.physComp != null) {
                        for (var i = 0; i < this.physComp.colliders.length; ++i) {
                            var c = this.physComp.colliders[i];
                            messengerEngine.queueForPosting("setBehaviorInstanceData", c.instanceId, { spiderDamage: 1 });
                        };
                    }
                }
            };

            this.switchDirectionX = function (x) {
                if (x === undefined) {
                    var rand = Math.random();
                    if (rand <= .33) {
                        x = velocityAmount;
                    } else if (rand > .33 && rand <= .66) {
                        x = -velocityAmount;
                    } else {
                        x = 0.0;
                    }
                }
                return x;
            }

            this.switchDirectionY = function (y) {
                if (y === undefined) {
                    y = (Math.random() < .5)  ? velocityAmount : -velocityAmount;
                }
                return y;
            }

            this.switchDirection = function () {
                this.transformation.setVelocity(this.switchDirectionX(), this.switchDirectionY());
            };

            this.playerBulletDamage = function () {
                if (playerPosition != null) {
                    var score = 0;
                    var dist = this.transformation.position.distance(playerPosition);
                    if (dist <= 64) {
                        score = 900;
                    } else if (dist > 64 && dist <= 256) {
                        score = 600;
                    } else {
                        score = 300;
                    }
                }
                messengerEngine.queueForPosting("incrementPlayerScore", score);
                messengerEngine.queueForPosting("createEntityInstance", "Kaboom", {
                    position: this.transformation.position.toXYObject(), data: {
                        score: score
                    }
                });
                messengerEngine.queueForPosting("removeEntityInstance", this.instanceId);
                messengerEngine.postImmediate("spiderDestroyed", true);
                messengerEngine.postImmediate("stopAudio", "Spider");
                messengerEngine.postImmediate("playAudio", "EnemyDeath");
            };

            this.playerDeath = function () {
                messengerEngine.queueForPosting("removeEntityInstance", this.instanceId);
                messengerEngine.postImmediate("stopAudio", "Spider");
            };

            this.capturePhysicsInstance = function (physComp, instanceId) {
                if (instanceId === this.instanceId) {
                    this.physComp = physComp;
                    messengerEngine.unregister("createdPhysicsInstance", this.capturePhysicsInstance);
                }
            };

            var getPlayerInstanceId = function (instanceId) {
                playerInstanceId = instanceId;
                messengerEngine.unregister("getPlayerInstanceIdResponse", getPlayerInstanceId);
                messengerEngine.postImmediate("getTransformationForEntityInstanceRequest", playerInstanceId);
            };

            var getPlayerTransformation = function (instanceId, transformation) {
                if (playerInstanceId === instanceId) {
                    playerPosition = transformation.position;
                    messengerEngine.unregister("getTransformationForEntityInstanceResponse", getPlayerTransformation);
                }
            };

            messengerEngine.register("playerDeath", this, this.playerDeath);
            messengerEngine.register("createdPhysicsInstance", this, this.capturePhysicsInstance);
            messengerEngine.register("getPlayerInstanceIdResponse", this, getPlayerInstanceId);
            messengerEngine.register("getTransformationForEntityInstanceResponse", this, getPlayerTransformation);

            messengerEngine.queueForPosting("getPlayerInstanceIdRequest", true);
            messengerEngine.postImmediate("playAudio", "Spider");
        };

        globalMessengerEngine.postImmediate("setBehaviorConstructor", "BehaviorSpider", BehaviorSpider);
    }
}());