(function (namespace, undefined) {
    "use strict";

    ////////
    // RegistrationCompDef
    namespace.Comp = namespace.Comp || {};
    namespace.Comp.Def = namespace.Comp.Def || {};
    namespace.Comp.Def.RegistrationDefinition = function (caller, toCall) {
        this.caller = caller;
        this.toCall = toCall;
    };

    namespace.Comp.Def.RegistrationDefinition.prototype.invoke = function (data) {
        this.toCall.apply(this.caller, data)
    };

    ////////
    // MailCompDef
    namespace.Comp = namespace.Comp || {};
    namespace.Comp.Def = namespace.Comp.Def || {};
    namespace.Comp.Def.MailDefinition = function () {
        this.name = "";
        this.valueNames = [];
        this.values = {};
        this.deliveryFunction = function () {
            return [];
        };
        this.registered = [];
    };

    namespace.Comp.Def.MailDefinition.prototype.assignValues = function (values) {
        var that = this;
        this.valueNames.forEach(function (valueName) {
            if (namespace.DebugEnabled === true && values[valueName] === undefined) {
                throw "For mail \"" + that.name + "\": value \"" + valueName + "\" not present in list of provided values.";
            }
            that.values[valueName] = values[valueName];
        });
    };

    namespace.Comp.Def.MailDefinition.prototype.invoke = function (values) {
        this.assignValues(values);
        var orderedValues = this.deliveryFunction(this.values);
        this.registered.forEach(function (x) {
            x.invoke(orderedValues);
        });
    };

    ////////
    // MessageCompDef
    namespace.Comp = namespace.Comp || {};
    namespace.Comp.Def = namespace.Comp.Def || {};
    namespace.Comp.Def.MessageDefinition = function (name, valueNames, deliveryFunction) {
        this.name = name + namespace.Comp.Def.MessageDefinition.nameAddendum;
        this.valueNames = valueNames;
        this.values = {};
        this.deliveryFunction = deliveryFunction;
        this.registered = [];
    };

    namespace.Comp.Def.MessageDefinition.prototype = new namespace.Comp.Def.MailDefinition();

    namespace.Comp.Def.MessageDefinition.nameAddendum = "Message";

    ////////
    // NoticeCompDef
    namespace.Comp = namespace.Comp || {};
    namespace.Comp.Def = namespace.Comp.Def || {};
    namespace.Comp.Def.NoticeDefinition = function (name, valueNames, deliveryFunction) {
        this.name = name + namespace.Comp.Def.NoticeDefinition.nameAddendum;
        this.valueNames = valueNames;
        this.values = {};
        this.deliveryFunction = deliveryFunction;
        this.registered = [];
    };

    namespace.Comp.Def.NoticeDefinition.prototype = new namespace.Comp.Def.MailDefinition();

    namespace.Comp.Def.NoticeDefinition.nameAddendum = "Notice";

    ////////
    // RequestCompDef
    namespace.Comp = namespace.Comp || {};
    namespace.Comp.Def = namespace.Comp.Def || {};
    namespace.Comp.Def.RequestDefinition = function (name, valueNames, deliveryFunction) {
        this.name = name + namespace.Comp.Def.RequestDefinition.nameAddendum;
        this.valueNames = valueNames;
        this.values = {};
        this.callback = null;
        this.deliveryFunction = deliveryFunction;
        this.registered = [];
    };

    namespace.Comp.Def.RequestDefinition.prototype = new namespace.Comp.Def.MailDefinition();

    namespace.Comp.Def.RequestDefinition.nameAddendum = "Request";

    namespace.Comp.Def.RequestDefinition.prototype.invoke = function (callback, values) {
        if (namespace.DebugEnabled === true && (!callback /* intentional truthiness */ || typeof(callback) !== "function")) {
            throw "For request " + that.name + ": callback must be a function.";
        }

        this.assignValues(values);
        var orderedValues = this.deliveryFunction(this.values);
        orderedValues.unshift(callback);
        this.registered.forEach(function (x) {
            x.invoke(orderedValues);
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
        var messageDefinitions = {};
        var noticeDefinitions = {};
        var requestDefinitions = {};
        var messages = [];

        var validDefinition = function (definitions, definitionName) {
            return definitions[definitionName] != null; // intentional truthiness
        };

        var createDefinition = function (definitions, definition) {
            if (!definitions[definition.name]) { // intentional truthiness
                definitions[definition.name] = definition;
            } else {
                if (namespace.DebugEnabled === true) {
                    throw "A definition with name " + definition.name + " already exists.";
                }
            }
        };

        var createMessageDefinition = function (definition) {
            if (namespace.DebugEnabled === true && !(definition instanceof namespace.Comp.Def.MessageDefinition)) {
                throw "Message definitions must be provided as an instance of the namespace.Comp.Def.MessageDefinition class.";
            }

            createDefinition(messageDefinitions, definition);
        };

        var createNoticeDefinition = function (definition) {
            if (namespace.DebugEnabled === true && !(definition instanceof namespace.Comp.Def.NoticeDefinition)) {
                throw "Notice definitions must be provided as an instance of the namespace.Comp.Def.NoticeDefinition class.";
            }

            createDefinition(noticeDefinitions, definition);
        };

        var createRequestDefinition = function (definition) {
            if (namespace.DebugEnabled === true && !(definition instanceof namespace.Comp.Def.RequestDefinition)) {
                throw "Request definitions must be provided as an instance of the namespace.Comp.Def.RequestDefinition class.";
            }

            createDefinition(requestDefinitions, definition);
        };

        var register = function (definitions, definitionName, object, funct) {
            definitions[definitionName].registered.push(new namespace.Comp.Def.RegistrationDefinition(object, funct));
        };

        this.registerForMessage = function (name, object, funct) {
            name = name + namespace.Comp.Def.MessageDefinition.nameAddendum;
            if (!validDefinition(messageDefinitions, name)) {
                throw "Cannot register for \"" + name + "\", a message definition that does not exist.";
            }

            register(messageDefinitions, name, object, funct);
        };

        this.registerForNotice = function (name, object, funct) {
            name = name + namespace.Comp.Def.NoticeDefinition.nameAddendum;
            if (!validDefinition(noticeDefinitions, name)) {
                throw "Cannot register for \"" + name + "\", a notice definition that does not exist.";
            }

            register(noticeDefinitions, name, object, funct);
        };

        this.registerForRequest = function (name, object, funct) {
            name = name + namespace.Comp.Def.RequestDefinition.nameAddendum;
            if (!validDefinition(requestDefinitions, name)) {
                throw "Cannot register for \"" + name + "\", a request definition that does not exist.";
            }

            register(requestDefinitions, name, object, funct);
        };

        var unregister = function (definitions, definitionName, funct) {
            for (var i = 0; i < definitions[definitionName].registered.length; ++i) {
                if (definitions[definitionName].registered[i].toCall === funct) {
                    definitions[definitionName].registered.splice(i, 1);
                    return;
                }
            }
        };

        this.unregisterForMessage = function (name, funct) {
            name = name + namespace.Comp.Def.MessageDefinition.nameAddendum;
            if (!validDefinition(messageDefinitions, name)) {
                throw "Cannot unregister for \"" + name + "\", a message definition that does not exist.";
            }

            unregister(messageDefinitions, name, funct);
        };

        this.unregisterForNotice = function (name, funct) {
            name = name + namespace.Comp.Def.NoticeDefinition.nameAddendum;
            if (!validDefinition(noticeDefinitions, name)) {
                throw "Cannot unregister for \"" + name + "\", a notice definition that does not exist.";
            }

            unregister(noticeDefinitions, name, funct);
        };

        this.unregisterForRequest = function (name, funct) {
            name = name + namespace.Comp.Def.RequestDefinition.nameAddendum;
            if (!validDefinition(requestDefinitions, name)) {
                throw "Cannot unregister for \"" + name + "\", a request definition that does not exist.";
            }

            unregister(requestDefinitions, name, funct);
        };

        var unregisterAll = function (definitions, object) {
            definitions.forOwnProperties(function (key, value) {
                if (value != null) { // intentional truthiness
                    var i = 0;
                    while (i < value.registered.length) {
                        if (value.registered[i].caller === object) {
                            value.registered[i].splice(i, 1);
                        } else {
                            ++i;
                        }
                    }
                }
            });
        };

        this.unregisterAllMessages = function (object) {
            unregisterAll(messageDefinitions, object);
        };

        this.unregisterAllNotices = function (object) {
            unregisterAll(noticeDefinitions, object);
        };

        this.unregisterAllRequests = function (object) {
            unregisterAll(requestDefinitions, object);
        };

        this.unregisterObject = function(object) {
            this.unregisterAllMessages(object);
            this.unregisterAllNotices(object);
            this.unregisterAllRequests(object);
        };

        var postMessage = function (message) {
            messageDefinitions[message.name].invoke(message.values);
        };

        this.queueMessage = function (name) {
            name = name + namespace.Comp.Def.MessageDefinition.nameAddendum;
            if (!validDefinition(messageDefinitions, name)) {
                throw "Cannot queue \"" + name + "\", as this definition does not exist.";
            }

            var values = arguments[1];
            messages.push(new namespace.Comp.Inst.Message(name, values));
        };

        this.postNotice = function (name) {
            name = name + namespace.Comp.Def.NoticeDefinition.nameAddendum;
            if (!validDefinition(noticeDefinitions, name)) {
                throw "Cannot post \"" + name + "\", as this definition does not exist.";
            }
            
            var values = arguments[1];
            noticeDefinitions[name].invoke(values);
        };

        this.sendRequest = function (name) {
            name = name + namespace.Comp.Def.RequestDefinition.nameAddendum;
            if (!validDefinition(requestDefinitions, name)) {
                throw "Cannot send \"" + name + "\", as this definition does not exist.";
            }

            var callback = arguments[1];
            var values = arguments[2];
            requestDefinitions[name].invoke(callback, values);
        };

        this.update = function () {
            for (var i = 0; i < messages.length; ++i) {
                postMessage(messages[i]);
            }
            messages = [];
        };


        ////////
        // audio messages
        createMessageDefinition(new namespace.Comp.Def.MessageDefinition("playAudio", ["audio"], function (values) {
            return [values.audio];
        }));
        createMessageDefinition(new namespace.Comp.Def.MessageDefinition("stopAudio", ["audio"], function (values) {
            return [values.audio];
        }));


        ////////
        // behavior messages
        createMessageDefinition(new namespace.Comp.Def.MessageDefinition("setInstanceData", ["instanceId", "data"], function(values) {
            return [values.instanceId, values.data];
        }));
        createMessageDefinition(new namespace.Comp.Def.MessageDefinition("setBehaviorConstructor", ["constructorName", "constructorFunction"], function(values) {
            return [values.constructorName, values.constructorFunction];
        }));

        ////////
        // behavior requests
        createRequestDefinition(new namespace.Comp.Def.RequestDefinition("getBehaviorComponentInstanceForEntityInstance", ["instanceId"], function (callback, values) {
            return [callback, values.instanceId];
        }));


        ////////
        // graphics messages
        createMessageDefinition(new namespace.Comp.Def.MessageDefinition("setShaderProgram", ["programName", "renderPass"], function(values) {
            return [values.programName, values.renderPass];
        }));
        createMessageDefinition(new namespace.Comp.Def.MessageDefinition("setInstanceAnimationState", ["instanceId", "animationState"], function (values) {
            return [values.instanceId, values.animationState];
        }));
        createMessageDefinition(new namespace.Comp.Def.MessageDefinition("setInstanceAnimationFrame", ["instanceId", "animationFrame"], function(values) {
            return [values.instanceId, values.animationFrame];
        }));
        createMessageDefinition(new namespace.Comp.Def.MessageDefinition("setInstanceRenderPass", ["instanceId", "renderPass"], function(values) {
            return [values.instanceId, values.renderPass];
        }));
        createMessageDefinition(new namespace.Comp.Def.MessageDefinition("addDuplicateInstanceZOrderRenderPass", ["instanceId", "gameState", "zOrder", "renderPass"], function(values) {
            return [values.instanceId, values.gameState, values.zOrder, values.renderPass];
        }));
        createMessageDefinition(new namespace.Comp.Def.MessageDefinition("removeDuplicateInstanceZOrderRenderPass", ["instanceId"], function(values) {
            return [values.instanceId];
        }));
        createMessageDefinition(new namespace.Comp.Def.MessageDefinition("setInstanceText", ["instanceId", "text"], function(values) {
            return [values.instanceId, values.text];
        }));
        createMessageDefinition(new namespace.Comp.Def.MessageDefinition("clearInstanceText", ["instanceId"], function (values) {
            return [values.instanceId];
        }));

        ////////
        // graphics requests
        createRequestDefinition(new namespace.Comp.Def.RequestDefinition("getGraphicsComponentInstanceForEntityInstance", ["instanceId"], function (values) {
            return [values.instanceId];
        }));


        ////////
        // physics messages
        createMessageDefinition(new namespace.Comp.Def.MessageDefinition("setInstanceAndBoundingDataPosition", ["instanceId", "position"], function(values) {
            return [values.instanceId, values.position];
        }));

        ////////
        // physics requests
        createRequestDefinition(new namespace.Comp.Def.RequestDefinition("getPhysicsComponentInstanceForEntityInstance", ["instanceId"], function (values) {
            return [values.instanceId];
        }));

        ////////
        // physics notices
        createNoticeDefinition(new namespace.Comp.Def.NoticeDefinition("setMouseClickCollider", ["point"], function (values) {
            return [values.point];
        }));
        createNoticeDefinition(new namespace.Comp.Def.NoticeDefinition("setMouseHeldCollider", ["point"], function (values) {
            return [values.point];
        }));


        ////////
        // entity messages
        createMessageDefinition(new namespace.Comp.Def.MessageDefinition("createAndPositionPlayerEntityInstance", ["additional", "callback"], function(values) {
            return [values.additional, values.callback];
        }));
        createMessageDefinition(new namespace.Comp.Def.MessageDefinition("createEntityInstance", ["identifier", "priority", "additional", "callback"], function(values) {
            return [values.identifier, values.priority, values.additional, values.callback];
        }));
        createMessageDefinition(new namespace.Comp.Def.MessageDefinition("removeEntityInstance", ["instanceId"], function(values) {
            return [values.instanceId];
        }));
        createMessageDefinition(new namespace.Comp.Def.MessageDefinition("removeEntityInstancesByPriority", ["priority"], function(values) {
            return [values.priority];
        }));
        createMessageDefinition(new namespace.Comp.Def.MessageDefinition("setInstancePriority", ["instanceId", "priority"], function(values) {
            return [values.instanceId, values.priority];
        }));
        createMessageDefinition(new namespace.Comp.Def.MessageDefinition("setInstanceGameState", ["instanceId", "gameState"], function (values) {
            return [values.instanceId, values.gameState];
        }));
        createMessageDefinition(new namespace.Comp.Def.MessageDefinition("setInstancePosition", ["instanceId", "position"], function(values) {
            return [values.instanceId, values.position];
        }));
        createMessageDefinition(new namespace.Comp.Def.MessageDefinition("setInstanceRotation", ["instanceId", "rotation"], function (values) {
            return [values.instanceId, values.rotation];
        }));
        createMessageDefinition(new namespace.Comp.Def.MessageDefinition("setInstanceScale", ["instanceId", "scale"], function (values) {
            return [values.instanceId, values.scale];
        }));
        createMessageDefinition(new namespace.Comp.Def.MessageDefinition("setInstanceVelocity", ["instanceId", "velocity"], function (values) {
            return [values.instanceId, values.velocity];
        }));

        ////////
        // entity requests
        createRequestDefinition(new namespace.Comp.Def.RequestDefinition("getTransformationForEntityInstance", ["instanceId"], function (values) {
            return [values.instanceId];
        }));


        ////////
        // input notices
        createNoticeDefinition(new namespace.Comp.Def.NoticeDefinition("mouseClicked", ["clicked"], function (values) {
            return [values.clicked];
        }));
        createNoticeDefinition(new namespace.Comp.Def.NoticeDefinition("mouseHeld", ["held"], function (values) {
            return [values.held];
        }));


        ////////
        // data messages
        createMessageDefinition(new namespace.Comp.Def.MessageDefinition("loadLevel", ["levelId", "priority"], function(values) {
            return [values.levelId, values.priority];
        }));
    };

    namespace.Globals = namespace.Globals || {};
    namespace.Globals.globalMessengerEngine = new namespace.Engines.MessengerEngine();

}(window.TTTD = window.TTTD || {}));