(function (namespace, undefined) {
    "use strict";

    ////////
    // MessageDataCompDef
    namespace.Comp = namespace.Comp || {};
    namespace.Comp.Def = namespace.Comp.Def || {};
    namespace.Comp.Def.MessageDefinition = function (name, valueNames, deliveryFunction) {
        this.name = name;
        this.valueNames = valueNames;
        this.values = {};
        this.deliveryFunction = deliveryFunction;
    };

    namespace.Comp.Def.MessageDefinition.prototype.assignValues = function (values) {
        var that = this;
        this.valueNames.forEach(function (valueName) {
            if (namespace.DebugEnabled === true && values[valueName] === undefined) {
                throw "For message " + that.messageName + ": value \"" + valueName + "\" not present in list of provided values.";
            }
            that.values[valueName] = values[valueName];
        });
    };

    ////////
    // MessageCompInst
    namespace.Comp = namespace.Comp || {};
    namespace.Comp.Inst = namespace.Comp.Inst || {};
    namespace.Comp.Inst.Message = function (name, values) {
        this.name = name;
        this.values = values;
    };

    namespace.Engines = namespace.Engines || {};
    namespace.Engines.MessengerEngine = function () {
        var requestStr = "Request";
        var messageDefinitions = [];
        var messageRegistration = {};
        var messages = [];

        var requestTypeName = function(messageType) {
            return messageType + requestStr;
        };

        var validMessageType = function (messageType) {
            return messageDefinitions.any(function (x) {
                return x === messageType;
            });
        }

        var createMessageType = function (messageType) {
            if (!validMessageType(messageType)) {
                messageDefinitions.push(messageType);

                if (messageRegistration[messageType] === undefined) {
                    messageRegistration[messageType] = [];
                }
            }
        };

        var createRequestType = function (messageType) {
            createMessageType(requestTypeName(messageType));
        };

        this.register = function (messageType, object, funct) {
            if (!validMessageType(messageType)) {
                throw "Cannot register for " + messageType + ", a messageType that does not exist.";
            }

            if (messageRegistration[messageType] === undefined) {
                messageRegistration[messageType] = [];
            }

            messageRegistration[messageType].push({
                caller: object,
                toCall: funct
            });
        };

        this.unregister = function (messageType, funct) {
            if (!validMessageType(messageType)) {
                throw "Cannot unregister from " + messageType + ", a messageType that does not exist.";
            }

            var messageTypeRegistration = messageRegistration[messageType];
            var messageRegisterer = messageTypeRegistration.firstOrNull(function (x) {
                return x.toCall === funct;
            });
            if (messageRegisterer) { // intentional truthiness
                var index = messageTypeRegistration.indexOf(messageRegisterer);
                if (index > -1) {
                    messageTypeRegistration.splice(index, 1);
                }
            }
        };

        this.unregisterAll = function (object) {
            messageDefinitions.forEach(function (messageType) {
                var messageRegisterer = null;
                var i = 0;
                while (i < messageRegistration[messageType].length) {
                    messageRegisterer = messageRegistration[messageType][i];
                    if (messageRegisterer.caller === object) {
                        messageRegistration[messageType].splice(i, 1);
                    } else {
                        ++i;
                    }
                }
            });
        };

        this.queueForPosting = function (messageType) {
            if (!validMessageType(messageType)) {
                throw "Cannot queue " + messageType + " for posting, as this messageType does not exist.";
            }

            var params = Array.prototype.slice.call(arguments, 1);

            messages.push({
                messageType: messageType,
                data: params
            });
        };

        this.request = function (messageType, callback) {
            var requestType = requestTypeName(messageType);
            if (!validMessageType(requestType)) {
                throw "Cannot request " + requestType + ", as this messageType does not exist.";
            }

            if (callback === false) { // false means that we don't care about a callback
                post(requestType, Array.prototype.slice.call(arguments, 2));
            } else {
                if (typeof (callback) !== "function") {
                    throw "No callback function provided for request.";
                }
                post(requestType, Array.prototype.slice.call(arguments, 1));
            }

        };

        var post = function (messageType, messageData) {
            var messageTypeRegistration = messageRegistration[messageType];
            messageTypeRegistration.forEach(function (x) {
                x.toCall.apply(x.caller, messageData);
            });
        };

        this.update = function () {
            for (var i = 0; i < messages.length; ++i) {
                post(messages[i].messageType, messages[i].data);
            }
            messages = [];
        };

        // audio messages/requests
        createMessageType("playAudio");
        createMessageType("stopAudio");


        // behavior messages/requests
        createMessageType(new namespace.Comp.Def.MessageDefinition("setInstanceData", ["instanceId", "data"], function(values) {
            return [values.instanceId, values.data];
        }));
        createMessageType(new namespace.Comp.Def.MessageDefinition("setBehaviorConstructor");
        createMessageType(new namespace.Comp.Def.MessageDefinition("setBehaviorInstanceData");

        createRequestType(new namespace.Comp.Def.MessageDefinition("getBehaviorComponentInstanceForEntityInstance");


        // graphics messages/requests
        createMessageType(new namespace.Comp.Def.MessageDefinition("setShaderProgram");
        createMessageType(new namespace.Comp.Def.MessageDefinition("setInstanceAnimationState");
        createMessageType(new namespace.Comp.Def.MessageDefinition("setInstanceAnimationFrame");
        createMessageType(new namespace.Comp.Def.MessageDefinition("setInstanceRenderPass");
        createMessageType(new namespace.Comp.Def.MessageDefinition("addDuplicateInstanceZOrderRenderPass");
        createMessageType(new namespace.Comp.Def.MessageDefinition("removeDuplicateInstanceZOrderRenderPass");
        createMessageType(new namespace.Comp.Def.MessageDefinition("setInstanceText");
        createMessageType(new namespace.Comp.Def.MessageDefinition("clearInstanceText");

        createRequestType(new namespace.Comp.Def.MessageDefinition("getGraphicsComponentInstanceForEntityInstance");


        // physics messages/requests
        createMessageType(new namespace.Comp.Def.MessageDefinition("setInstanceAndBoundingDataPosition");

        createRequestType(new namespace.Comp.Def.MessageDefinition("getPhysicsComponentInstanceForEntityInstance");
        createRequestType(new namespace.Comp.Def.MessageDefinition("setMouseClickCollider");
        createRequestType(new namespace.Comp.Def.MessageDefinition("setMouseHeldCollider");

        // entity messages/requests
        createMessageType(new namespace.Comp.Def.MessageDefinition("createAndPositionPlayerEntityInstance");
        createMessageType(new namespace.Comp.Def.MessageDefinition("createEntityInstance");
        createMessageType(new namespace.Comp.Def.MessageDefinition("removeEntityInstance");
        createMessageType(new namespace.Comp.Def.MessageDefinition("removeEntityInstancesByPriority");
        createMessageType(new namespace.Comp.Def.MessageDefinition("setInstancePriority");
        createMessageType(new namespace.Comp.Def.MessageDefinition("setInstancePosition");
        createMessageType(new namespace.Comp.Def.MessageDefinition("setInstanceScale");

        createRequestType(new namespace.Comp.Def.MessageDefinition("getTransformationForEntityInstance");


        // input messages/requests

        createRequestType(new namespace.Comp.Def.MessageDefinition("mouseClicked");
        createRequestType(new namespace.Comp.Def.MessageDefinition("mouseHeld");


        // data messages/requests
        createMessageType(new namespace.Comp.Def.MessageDefinition("loadLevel");
    };

    namespace.Globals = namespace.Globals || {};
    namespace.Globals.globalMessengerEngine = new namespace.Engines.MessengerEngine();

}(window.TTTD = window.TTTD || {}));