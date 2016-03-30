(function (namespace, undefined) {
    "use strict";

    if (namespace.BehaviorPlayer === undefined) {
        namespace.BehaviorPlayer = function (entity) {
            this.instanceId = entity.instanceId;
            this.transformation = entity.transformation;

            var that = this;

            var messengerEngine = namespace.Globals.globalMessengerEngine;
            var inputEngine = namespace.Globals.globalInputEngine;

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

            this.state_enterIdle = function (delta) {
                messengerEngine.queueForPosting("setInstanceAnimationState", that.instanceId, 0);
                return [that.state_updateIdle];
            };

            this.state_updateIdle = function (delta) {
                if (controllerLeft()) {
                    that.transformation.velocity.x = -50;
                } else if (controllerRight()) {
                    that.transformation.velocity.x = 50;
                } else {
                    that.transformation.velocity.x = 0;
                }

                if (controllerUp()) {
                    that.transformation.velocity.y = -50;
                } else if (controllerDown()) {
                    that.transformation.velocity.y = 50;
                } else {
                    that.transformation.velocity.y = 0;
                }
            };

            this.firstBehavior = this.state_enterIdle;
        };

        namespace.Globals.globalMessengerEngine.queueForPosting("setBehaviorConstructor", "BehaviorPlayer", namespace.BehaviorPlayer);
    }
}(window.TTTD = window.TTTD || {}));