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
        createMessageType("setInstanceData");
        createMessageType("setBehaviorConstructor");
        createMessageType("setBehaviorInstanceData");

        createRequestType("getBehaviorComponentInstanceForEntityInstance");


        // graphics messages/requests
        createMessageType("setShaderProgram");
        createMessageType("setInstanceAnimationState");
        createMessageType("setInstanceAnimationFrame");
        createMessageType("setInstanceText");
        createMessageType("clearInstanceText");

        createRequestType("getGraphicsComponentInstanceForEntityInstance");


        // physics messages/requests
        createMessageType("setInstanceAndBoundingDataPosition");

        createRequestType("getPhysicsComponentInstanceForEntityInstance");


        // entity messages/requests
        createMessageType("createAndPositionPlayerEntityInstance");
        createMessageType("createEntityInstance");
        createMessageType("removeEntityInstance");
        createMessageType("removeEntityInstancesByPriority");
        createMessageType("setInstancePriority");
        createMessageType("setInstancePosition");
        createMessageType("setInstanceScale");

        createRequestType("getTransformationForEntityInstance");


        // data messages/requests
        createMessageType("loadLevel");
    };

    namespace.Globals = namespace.Globals || {};
    namespace.Globals.globalMessengerEngine = new namespace.Engines.MessengerEngine();

}(window.TTTD = window.TTTD || {}));