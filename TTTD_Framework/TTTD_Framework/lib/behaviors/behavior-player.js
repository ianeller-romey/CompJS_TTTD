(function (namespace, undefined) {
    "use strict";

    if (namespace.BehaviorPlayer === undefined) {
        namespace.BehaviorPlayer = function (entity) {
            this.instanceId = entity.instanceId;
            this.transformation = entity.transformation;

            var that = this;

            var messengerEngine = namespace.Globals.globalMessengerEngine;
            var inputEngine = namespace.Globals.globalInputEngine;

            var destination = null;
            var destinationThreshold = .5;
            var playerSpeed = 50;

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
                return inputEngine.isTriggered(inputEngine.keys.space) || inputEngine.isTriggered(inputEngine.keys.enter)
            };

            this.getVelocityFromMouseClick = function () {
                if (inputEngine.isMouseClicked()) {
                    destination = inputEngine.getMousePosition();
                    return true;
                } else {
                    return false;
                }
            };

            this.state_enterIdle = function (delta) {
                that.transformation.velocity.x = that.transformation.velocity.x.setAndNotify(0);
                that.transformation.velocity.x = that.transformation.velocity.y.setAndNotify(0);
                messengerEngine.queueMessage("setInstanceAnimationState", {
                    instanceId: that.instanceId,
                    animationState: 0
                });
                return true;
            };

            this.state_updateIdle = function (delta) {
                if (that.getVelocityFromMouseClick()) {
                    return that.getState_moving();
                } else {
                    return false;
                }
            };
            
            this.getState_idle = function () {
                return [that.state_enterIdle, that.state_updateIdle];
            };

            this.state_enterMoving = function (delta) {
                var velocity = (destination.x > that.transformation.position.x) ? playerSpeed : -playerSpeed;
                that.transformation.velocity.x = that.transformation.velocity.x.setAndNotify(velocity);
                //messengerEngine.queueMessage("setInstanceAnimationState", {
                //    instanceId: that.instanceId, 
                //    animationState: (playerSpeed > 0) ? 1 : 2
                //});
                return true;
            };

            this.state_updateMoving = function (delta) {
                if (that.getVelocityFromMouseClick()) {
                    return that.getState_moving();
                } else {
                    if (Math.abs(that.transformation.position.x + 8 /* half width */ - destination.x) < destinationThreshold) {
                        return that.getState_idle();
                    } else {
                        return false;
                    }
                }
            };

            this.getState_moving = function () {
                return [that.state_enterMoving, that.state_updateMoving];
            };

            this.firstBehavior = function (delta) {
                that.state_enterIdle(delta);
                return [that.state_updateIdle];
            };
        };

        namespace.Globals.globalMessengerEngine.queueMessage("setBehaviorConstructor", {
            constructorName: "BehaviorPlayer",
            constructorFunction: namespace.BehaviorPlayer
        });
    }
}(window.TTTD = window.TTTD || {}));