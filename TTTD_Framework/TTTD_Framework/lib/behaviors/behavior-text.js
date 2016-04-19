(function (namespace, undefined) {
    "use strict";

    if (namespace.BehaviorText === undefined) {
        namespace.BehaviorText = function (entity) {
            this.instanceId = entity.instanceId;
            this.transformation = entity.transformation;

            var that = this;

            var messengerEngine = namespace.Globals.globalMessengerEngine;
            var inputEngine = namespace.Globals.globalInputEngine;

            var textVelocity = 50;
            var textRotation = 0;
            var rotationTimer = 0;
            var rotationInterval = 5;

            var controllerLeft = function () {
                return inputEngine.isPressed(inputEngine.keys.j);
            };

            var controllerRight = function () {
                return inputEngine.isPressed(inputEngine.keys.l);
            };

            var controllerUp = function () {
                return inputEngine.isPressed(inputEngine.keys.i);
            };

            var controllerDown = function () {
                return inputEngine.isPressed(inputEngine.keys.k);
            };

            var controllerAction = function () {
                return inputEngine.isPressed(inputEngine.keys.enter)
            };

            this.state_enterIdle = function (delta) {
                return true;
            };

            this.state_updateIdle = function (delta) {
                if (controllerLeft()) {
                    that.transformation.setVelocity(-textVelocity, null);
                } else if (controllerRight()) {
                    that.transformation.setVelocity(textVelocity, null);
                } else {
                    that.transformation.setVelocity(0, null);
                }

                if (controllerUp()) {
                    that.transformation.setVelocity(null, -textVelocity);
                } else if (controllerDown()) {
                    that.transformation.setVelocity(null, textVelocity);
                } else {
                    that.transformation.setVelocity(null, 0);
                }

                /*if (controllerAction()) {
                    rotationTimer += delta;
                    if (rotationTimer > 5) {
                        rotationTimer = 0;
                        textRotation = (textRotation + 1) % 360;
                        messengerEngine.queueMessage("setInstanceRotation", {
                            instanceId: that.instanceId,
                            rotation: textRotation
                        });
                        console.log(textRotation);
                    }
                } else {
                    rotationTimer = rotationInterval;
                }*/
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
            constructorName: "BehaviorText",
            constructorFunction: namespace.BehaviorText
        });
    }
}(window.TTTD = window.TTTD || {}));