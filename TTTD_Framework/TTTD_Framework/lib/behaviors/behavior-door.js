(function (namespace, undefined) {
    "use strict";

    if (namespace.BehaviorDoor === undefined) {
        namespace.BehaviorDoor = function (entity) {
            this.instanceId = entity.instanceId;
            this.transformation = entity.transformation;
            this.physics = null;
            this.loadLevelId = null;
            this.loadLevelPriority = null;

            var that = this;

            var messengerEngine = namespace.Globals.globalMessengerEngine;
            var inputEngine = namespace.Globals.globalInputEngine;

            this.state_init = function (delta) {
                if (that.data["loadLevelId"] != null) { // intentional truthiness
                    that.loadLevelId = that.data["loadLevelId"];
                }
                if (that.data["loadLevelPriority"] != null) { // intentional truthiness
                    that.loadLevelPriority = that.data["loadLevelPriority"];
                }
                messengerEngine.request("getPhysicsComponentInstanceForEntityInstance", function (instance) {
                    that.physics = instance;
                }, that.instanceId);
                if (that.loadLevelId !== null && that.loadLevelPriority !== null) {
                    return [that.state_update];
                } else {
                    if (namespace.DebugEnabled === true) {
                        throw "BehaviorDoor was not initialized with correct data.";
                    }
                }
            };

            this.state_update = function (delta) {
                var forReturn = false;
                if (that.physics.physical.colliders) { // intentional truthiness
                    that.physics.physical.colliders.forEach(function (x) {
                        if (x.instanceDefinitionName === "MouseHeld") {
                            forReturn = [that.state_enterActive];
                        }
                    });
                }
                return forReturn;
            };

            this.state_enterActive = function (delta) {
                messengerEngine.queueForPosting("addDuplicateInstanceZOrderRenderPass", that.instanceId, 1, 1);
                messengerEngine.queueForPosting("createEntityInstance", "Text", 1, {
                    position: {
                        x: 100,
                        y: 100
                    },
                    fontText: "YAY!"
                });
                return [that.state_active];
            };

            this.state_active = function (delta) {
                if (that.physics.physical.colliders) { // intentional truthiness
                    that.physics.physical.colliders.forEach(function (x) {
                        if (x.instanceDefinitionName === "Player") {
                            messengerEngine.queueForPosting("loadLevel", that.loadLevelId, that.loadLevelPriority);
                        }
                    });
                }
                return false;
            };

            this.firstBehavior = this.state_init;
        };

        namespace.Globals.globalMessengerEngine.queueForPosting("setBehaviorConstructor", "BehaviorDoor", namespace.BehaviorDoor);
    }
}(window.TTTD = window.TTTD || {}));