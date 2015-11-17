(function () {
    if (BehaviorPlayer === undefined) {
        var BehaviorPlayer = function (entity) {
            this.instanceId = entity.instanceId;
            this.transformation = entity.transformation;

            var deathMessages = ["OUCH", "RATS", "UGH", "DEAD", "OH NO!", "SPLAT", "OOPS!"];

            var messengerEngine = globalMessengerEngine;
            var inputManager = globalInputManager;

            var godMode = false;

            var controllerLeft = function () {
                return inputManager.isPressed(inputManager.keys.arrowLeft) || inputManager.isPressed(inputManager.keys.a);
            };

            var controllerRight = function () {
                return inputManager.isPressed(inputManager.keys.arrowRight) || inputManager.isPressed(inputManager.keys.d);
            };

            var controllerUp = function () {
                return inputManager.isPressed(inputManager.keys.arrowUp) || inputManager.isPressed(inputManager.keys.w);
            };

            var controllerDown = function () {
                return inputManager.isPressed(inputManager.keys.arrowDown) || inputManager.isPressed(inputManager.keys.s);
            };

            var controllerShoot = function () {
                return inputManager.isTriggered(inputManager.keys.space) || inputManager.isTriggered(inputManager.keys.enter)
            };

            this.playerDeath = function () {
                if (!godMode) {
                    messengerEngine.queueForPosting("createEntityInstance", "Kaboom", {
                        position: this.transformation.position.toXYObject(0, -16), data: {
                            score: deathMessages[Math.floor(Math.random() * 10) % deathMessages.length]
                        }
                    });
                    messengerEngine.postImmediate("removeEntityInstance", this.instanceId);
                    messengerEngine.queueForPosting("playerModifyLives", -1);
                    messengerEngine.queueForPosting("playerDeath", true);
                    messengerEngine.postImmediate("playAudio", "PlayerDeath");
                }
            };

            this.update = function () {
                if (this.data["spiderDamage"] !== undefined || this.data["scorpionDamage"] !== undefined || this.data["fleaDamage"] !== undefined || this.data["centipedeDamage"] !== undefined) {
                    this.playerDeath();
                }

                var xVel = 0.0;
                if (controllerLeft() && this.transformation.position.x > 4) {
                    xVel = -0.25;
                } else if (controllerRight() && this.transformation.position.x < 500) {
                    xVel = 0.25;
                }

                var yVel = 0.0;
                if (controllerUp() && this.transformation.position.y > 402) {
                    yVel = -0.25;
                } else if (controllerDown() && this.transformation.position.y < 500) {
                    yVel = 0.25;
                }

                this.transformation.setVelocity(xVel, yVel);

                if (controllerShoot()) {
                    messengerEngine.queueForPosting("createEntityInstance", "PlayerBullet", {
                        position: new Vector2D(this.transformation.position.x + 7, this.transformation.position.y - 7)
                    });
                }
            };

            var setPlayerGodMode = function (bool) {
                godMode = bool;
            };

            this.getPlayerInstanceId = function () {
                messengerEngine.queueForPosting("getPlayerInstanceIdResponse", this.instanceId);
            };

            messengerEngine.register("setPlayerGodMode", this, setPlayerGodMode);
            messengerEngine.register("getPlayerInstanceIdRequest", this, this.getPlayerInstanceId);

            messengerEngine.queueForPosting("setPointLightTransform", this.transformation);
        };

        globalMessengerEngine.postImmediate("setBehaviorConstructor", "BehaviorPlayer", BehaviorPlayer);
    }
}());