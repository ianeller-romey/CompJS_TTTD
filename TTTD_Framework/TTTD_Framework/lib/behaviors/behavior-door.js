(function (namespace, undefined) {
    "use strict";

    if (namespace.BehaviorDoor === undefined) {
        namespace.BehaviorDoor = function (entity) {
            this.instanceId = entity.instanceId;
            this.transformation = entity.transformation;
            this.loadLevelId = null;
            this.loadLevelPriority = null;

            var that = this;

            var messengerEngine = namespace.Globals.globalMessengerEngine;
            var inputEngine = namespace.Globals.globalInputEngine;

            this.state_init = function (delta) {
                if (this.data["loadLevelId"] != null) { // intentional truthiness
                    that.loadLevelId = this.data["loadLevelId"];
                }
                if (this.data["loadLevelPriority"] != null) { // intentional truthiness
                    that.loadLevelPriority = this.data["loadLevelPriority"];
                }
                if (that.loadLevelId !== null && that.loadLevelPriority !== null) {
                    return [that.state_update];
                } else {
                    if (namespace.DebugEnabled) { // intentional truthiness
                        throw "BehaviorDoor was not initialized with correct data.";
                    }
                }
            };

            this.state_update = function (delta) {
            };

            this.firstBehavior = this.state_init;
        };

        namespace.Globals.globalMessengerEngine.queueForPosting("setBehaviorConstructor", "BehaviorDoor", namespace.BehaviorDoor);
    }
}(window.TTTD = window.TTTD || {}));