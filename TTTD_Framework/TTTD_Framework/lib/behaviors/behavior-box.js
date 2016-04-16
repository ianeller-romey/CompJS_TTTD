(function (namespace, undefined) {
    "use strict";

    if (namespace.BehaviorBox === undefined) {
        namespace.BehaviorBox = function (entity) {
            this.instanceId = entity.instanceId;
            this.transformation = entity.transformation;

            var that = this;

            var messengerEngine = namespace.Globals.globalMessengerEngine;
            var inputEngine = namespace.Globals.globalInputEngine;

            var boxVelocity = 50;
            var boxRotation = 0;
            var rotationTimer = 0;
            var rotationInterval = 5;

            var controllerLeft = function () {
                return inputEngine.isPressed(inputEngine.keys.arrowLeft) || inputEngine.isPressed(inputEngine.keys.a);
            };

            var controllerRight = function () {
                return inputEngine.isPressed(inputEngine.keys.arrowRight) || inputEngine.isPressed(inputEngine.keys.d);
            };

            var controllerUp = function () {
                return inputEngine.isPressed(inputEngine.keys.arrowUp) || inputEngine.isPressed(inputEngine.keys.w);
            };

            var controllerDown = function () {
                return inputEngine.isPressed(inputEngine.keys.arrowDown) || inputEngine.isPressed(inputEngine.keys.s);
            };

            var controllerAction = function () {
                return inputEngine.isPressed(inputEngine.keys.space) || inputEngine.isPressed(inputEngine.keys.enter)
            };

            this.state_enterIdle = function (delta) {
                return true;
            };

            this.state_updateIdle = function (delta) {
                if (controllerLeft()) {
                    that.transformation.setVelocity(-boxVelocity, null);
                } else if (controllerRight()) {
                    that.transformation.setVelocity(boxVelocity, null);
                } else {
                    that.transformation.setVelocity(0, null);
                }

                if (controllerUp()) {
                    that.transformation.setVelocity(null, -boxVelocity);
                } else if (controllerDown()) {
                    that.transformation.setVelocity(null, boxVelocity);
                } else {
                    that.transformation.setVelocity(null, 0);
                }

                if (controllerAction()) {
                    rotationTimer += delta;
                    if (rotationTimer > 5) {
                        rotationTimer = 0;
                        boxRotation = (boxRotation + 1) % 360;
                        messengerEngine.queueMessage("setInstanceRotation", {
                            instanceId: that.instanceId,
                            rotation: boxRotation
                        });
                        console.log(boxRotation);
                    }
                } else {
                    rotationTimer = rotationInterval;
                }
                return false;
            };
            
            this.getState_idle = function () {
                return [that.state_enterIdle, that.state_updateIdle];
            };

            this.firstBehavior = function (delta) {
                that.state_enterIdle(delta);
                return [that.state_updateIdle];
            };
        };

        namespace.Globals.globalMessengerEngine.queueMessage("setBehaviorConstructor", {
            constructorName: "BehaviorBox",
            constructorFunction: namespace.BehaviorBox
        });
    }
}(window.TTTD = window.TTTD || {}));