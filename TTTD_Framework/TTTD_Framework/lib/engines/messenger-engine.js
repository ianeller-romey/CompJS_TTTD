(function (namespace, undefined) {
    "use strict";

    namespace.Engines = namespace.Engines || {};
    namespace.Engines.MessengerEngine = function () {
        var requestStr = "Request";
        var messageTypes = [];
        var messageRegistration = {};
        var messages = [];

        var requestTypeName = function(messageType) {
            return messageType + requestStr;
        };

        var validMessageType = function (messageType) {
            return messageTypes.any(function (x) {
                return x === messageType;
            });
        }

        var createMessageType = function (messageType) {
            if (!validMessageType(messageType)) {
                messageTypes.push(messageType);

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
            messageTypes.forEach(function (messageType) {
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

            if (typeof (callback) !== "function") {
                throw "No callback function provided for request.";
            }

            post(requestType, Array.prototype.slice.call(arguments, 1));
        };

        var post = function (messageType, messageData) {
            var messageTypeRegistration = messageRegistration[message.messageType];
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

        createMessageType("createBehavior");
        createMessageType("createdBehaviorInstance");
        createMessageType("setBehaviorConstructor");
        createMessageType("setBehaviorInstanceData");

        createRequestType("getBhvCompInstanceForEntityInstance");


        createMessageType("createGraphics");
        createMessageType("setShaderProgram");
        createMessageType("createdGraphicsInstance");
        createMessageType("setInstanceAnimationState");
        createMessageType("setInstanceAnimationFrame");
        createMessageType("setInstanceText");
        createMessageType("clearInstanceText");

        createRequestType("getGfxCompInstanceForEntityInstance");


        createMessageType("createPhysics");
        createMessageType("createdPhysicsInstance");

        createRequestType("getPhysCompInstanceForEntityInstance");


        createMessageType("createEntityInstance");
        createMessageType("removeEntityInstance");
        createMessageType("removeAllEntityInstancesButOne");
        createMessageType("setInstancePosition");
        createMessageType("setInstanceScale");

        createRequestType("getTransformationForEntityInstance");
    };

    globalMessengerEngine = new namespace.Engines.MessengerEngine();

}(window.TTTD = window.TTTD || {}));