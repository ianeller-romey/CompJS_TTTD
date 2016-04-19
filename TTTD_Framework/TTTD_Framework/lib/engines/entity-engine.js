(function (namespace, undefined) {
    "use strict";

    ////////
    // ComponentInst
    namespace.Comp = namespace.Comp || {};
    namespace.Comp.Inst = namespace.Comp.Inst || {};
    namespace.Comp.Inst.Component = function () {
    };

    namespace.Comp.Inst.Component.prototype.destroy = function (messengerEngine) {
        if (messengerEngine) { // intentional truthiness
            messengerEngine.unregisterObject(this);
        }
    };

    ////////
    // TransformationInst
    namespace.Comp = namespace.Comp || {};
    namespace.Comp.Inst = namespace.Comp.Inst || {};
    namespace.Comp.Inst.Transformation = function (position, rotation, scale, velocity) {
        var that = this;

        this.position = null;
        this.lastPosition = null;
        var initPosition = function () {
            var x = 0;
            var y = 0;
            if (position != null) {
                if (position.x != null) {
                    x = position.x;
                }
                if (position.y != null) {
                    y = position.y;
                }
            }
            that.position = new namespace.Math.Vector2D(x, y);
            that.lastPosition = new namespace.Math.Vector2D(that.position.x, that.position.y);
        };

        this.rotation = null;
        this.lastRotation = null;
        var initRotation = function () {
            var rot = 0;
            if (rotation != null) {
                rot = rotation;
            }
            that.rotation = rot;
            that.lastRotation = that.rotation;
        };

        this.scale = null;
        this.lastScale = null;
        var initScale = function () {
            var x = 1;
            var y = 1;
            if (scale != null) {
                if (scale.x != null) {
                    x = scale.x;
                }
                if (scale.y != null) {
                    y = scale.y;
                }
            }
            that.scale = new namespace.Math.Vector2D(x, y);
            that.lastScale = new namespace.Math.Vector2D(that.scale.x, that.scale.y);
        };

        this.velocity = null;
        this.lastVelocity = null;
        var initVelocity = function () {
            var x = 0;
            var y = 0;
            if (velocity != null) {
                if (velocity.x != null) {
                    x = velocity.x;
                }
                if (velocity.y != null) {
                    y = velocity.y;
                }
            }
            that.velocity = new namespace.Math.Vector2D(x, y);
            that.lastVelocity = new namespace.Math.Vector2D(that.velocity.x, that.velocity.y);
        };

        initPosition();
        initRotation();
        initScale();
        initVelocity();
    };

    namespace.Comp.Inst.Transformation.prototype.translateSelf = function (x, y) {
        this.setPosition(this.position.x + x, this.position.y + y);
    };

    namespace.Comp.Inst.Transformation.prototype.setPosition = function (x, y) {
        if (x !== null || y !== null) {
            if (x !== null) {
                this.position.x = x;
            }
            if (y !== null) {
                this.position.y = y;
            }
        }
    };

    namespace.Comp.Inst.Transformation.prototype.positionChanged = function () {
        return !this.position.equalsVector(this.lastPosition);
    };

    namespace.Comp.Inst.Transformation.prototype.getPositionChange = function () {
        return this.position.subtract(this.lastPosition.x, this.lastPosition.y);
    };

    namespace.Comp.Inst.Transformation.prototype.setRotation = function (rot) {
        if (rot !== null) {
            this.lastRotation = this.rotation;
            this.rotation = rot;
        }
    };

    namespace.Comp.Inst.Transformation.prototype.rotationChanged = function () {
        return this.rotation !== this.lastRotation;
    };

    namespace.Comp.Inst.Transformation.prototype.getRotationChange = function () {
        // THIS IS PROBABLY BUGGY
        return (this.rotation === 0 && this.lastRotation !== 0) ? 360 - this.lastRotation : this.rotation - this.lastRotation;
    };

    namespace.Comp.Inst.Transformation.prototype.setScale = function (x, y) {
        if (x !== null || y !== null) {
            if (x !== null) {
                this.scale.x = x;
            }
            if (y !== null) {
                this.scale.y = y;
            }
        }
    };

    namespace.Comp.Inst.Transformation.prototype.scaleChanged = function () {
        return !this.scale.equalsVector(this.lastScale);
    };

    namespace.Comp.Inst.Transformation.prototype.getScaleChange = function () {
        return this.scale.subtract(this.lastScale.x, this.lastScale.y);
    };

    namespace.Comp.Inst.Transformation.prototype.setVelocity = function (x, y) {
        if (x !== null || y !== null) {
            if (x !== null) {
                this.velocity.x = x;
            }
            if (y !== null) {
                this.velocity.y = y;
            }
        }
    };

    namespace.Comp.Inst.Transformation.prototype.velocityChanged = function () {
        return !this.velocity.equalsVector(this.lastVelocity);
    };

    namespace.Comp.Inst.Transformation.prototype.getVelocityChange = function () {
        return this.velocity.subtract(this.lastVelocity.x, this.lastVelocity.y);
    };

    namespace.Comp.Inst.Transformation.prototype.update = function () {
        this.lastPosition = new namespace.Math.Vector2D(this.position.x, this.position.y);
        this.lastRotation = this.rotation;
        this.lastScale = new namespace.Math.Vector2D(this.scale.x, this.scale.y);
        this.lastVelocity = new namespace.Math.Vector2D(this.velocity.x, this.velocity.y);
    };

    ////////
    // EntityInst
    namespace.Comp = namespace.Comp || {};
    namespace.Comp.Inst = namespace.Comp.Inst || {};
    namespace.Comp.Inst.Entity = function (instanceId, entityInstanceDefinitionId, entityInstanceDefinitionName, entityInstanceDefinitionGameState, priority, position, rotation, scale, velocity) {
        this.instanceId = instanceId;
        this.instanceDefinitionId = entityInstanceDefinitionId;
        this.instanceDefinitionName = entityInstanceDefinitionName;
        this.gameState = entityInstanceDefinitionGameState;
        this.priority = priority;

        this.transformation = new namespace.Comp.Inst.Transformation(position, rotation, scale, velocity);
    };

    namespace.Comp.Inst.Entity.hasBehavior = function (ent) {
        return ent.behavior !== undefined && ent.behavior !== null;
    };

    namespace.Comp.Inst.Entity.hasGraphics = function (ent) {
        return ent.graphics !== undefined && ent.graphics !== null;
    };

    namespace.Comp.Inst.Entity.hasPhysics = function (ent) {
        return ent.physics !== undefined && ent.physics !== null;
    };

    namespace.Comp.Inst.Entity.hasAudible = function (ent) {
        return ent.audible !== undefined && ent.audible !== null;
    };

    ////////
    // CompDefDesc
    namespace.Comp = namespace.Comp || {};
    namespace.Comp.Def = namespace.Comp.Def || {};
    namespace.Comp.Def.TypeDesc = function (def) {
        this.name = def.name;
    };

    ////////
    // EntityDef
    namespace.Comp = namespace.Comp || {};
    namespace.Comp.Def = namespace.Comp.Def || {};
    namespace.Comp.Def.Entity = function (def) {
        this.name = def.name;
        this.gameState = def.gameState;
        this.behavior = def.behavior;
        this.graphics = def.graphics;
        this.physics = def.physics;
        this.audible = def.audible;
    };

    ////////
    // EntityEngine
    namespace.Engines = namespace.Engines || {};
    namespace.Engines.EntityManager = function (audEng, bhvEng, gfxEng, physEng) {
        var Inst = namespace.Comp.Inst;
        var Def = namespace.Comp.Def;

        var messengerEngine = namespace.Globals.globalMessengerEngine;
        var dataEngine = namespace.Globals.globalDataEngine;
        var gameStateEngine = namespace.Globals.globalGameStateEngine;

        var audioEngine = audEng;
        var behaviorEngine = bhvEng;
        var graphicsEngine = gfxEng;
        var physicsEngine = physEng;

        var entityInstanceDefinitions = [];
        var entityInstanceDefinitionNamedIds = [];
        var entityInstances = [];

        var playerEntityInstanceDefinitionName = "Player";
        var playerEntityInstanceDefaultPriority = 0;
        var playerEntityInstanceDefaultGameState = namespace.Engines.GameStateEngine.defaultGameState;
        var playerEntityInstance = null;

        var entityHasBehavior = namespace.Comp.Inst.Entity.hasBehavior;
        var entityHasGraphics = namespace.Comp.Inst.Entity.hasGraphics;
        var entityHasPhysics = namespace.Comp.Inst.Entity.hasPhysics;
        var entityHasAudible = namespace.Comp.Inst.Entity.hasAudible;

        var entityIdGenerator = 0;

        var buildEntityInstanceDefinitions = function (data) {
            data.forEach(function (x) {
                entityInstanceDefinitions[x.id] = new namespace.Comp.Def.Entity(x);

                entityInstanceDefinitionNamedIds[x.name] = x.id;
            });
        };

        this.init = function () {
            return new Promise(function (resolve, reject) {
                dataEngine.loadAllEntityInstanceDefinitions().then(function (data) {
                    buildEntityInstanceDefinitions(data);
                    resolve();
                }, function (reason) {
                    var reasonPlus = "Failed to load entity definitions";
                    if (reason) { // intentional truthiness
                        reasonPlus = reasonPlus + "\r\n" + reason;
                    }
                    reject(reasonPlus);
                });
            });
        };

        this.update = function (delta) {
            entityInstances.forEach(function (x) {
                x.transformation.update();
            });
        };

        this.shutdown = function () {
            var that = this;
            return new Promise(function (resolve, reject) {
                entityInstanceDefinitions = [];
                entityInstanceDefinitionNamedIds = [];
                entityInstances = [];
                messengerEngine.unregisterObject(that);
                resolve();
            });
        };

        var createEntityInstance = function (xEntityType, priority, additional, callback) {
            var entity = new namespace.Comp.Inst.Entity(entityIdGenerator++, xEntityType.entityInstanceDefinitionId, xEntityType.entityInstanceDefinitionName, xEntityType.entityInstanceDefinitionGameState, priority, xEntityType.position, xEntityType.rotation, xEntityType.scale, xEntityType.velocity);
            entityInstances.push(entity);

            if (playerEntityInstance === null && xEntityType.entityInstanceDefinitionName === playerEntityInstanceDefinitionName) {
                playerEntityInstance = entity;
            }

            var entityDefinition = entityInstanceDefinitions[entity.instanceDefinitionId];
            if (entityHasBehavior(entityDefinition)) {
                behaviorEngine.createBehaviorComponentInstance(entity, entityDefinition.behavior, entityDefinition.gameState);
                if (additional != null && additional.data != null) { // intentional truthiness
                    behaviorEngine.setBehaviorComponentInstanceData(entity.instanceId, additional.data);
                }
            }
            if (entityHasGraphics(entityDefinition)) {
                if (additional != null && additional.fontText != null) { // intentional truthiness
                    graphicsEngine.createGraphicsComponentInstanceForFont(entity, entityDefinition.graphics, additional.fontText, entityDefinition.gameState);
                } else {
                    graphicsEngine.createGraphicsComponentInstance(entity, entityDefinition.graphics, entityDefinition.gameState);
                }
            }
            if (entityHasPhysics(entityDefinition)) {
                if (additional != null && additional.fontText != null) { // intentional truthiness
                    physicsEngine.createPhysicsComponentFontInstance(entity, entityDefinition.physics, additional.fontText, entityDefinition.gameState);
                } else {
                    physicsEngine.createPhysicsComponentInstance(entity, entityDefinition.physics, entityDefinition.gameState);
                }
            }
            if (entityHasAudible(entityDefinition)) {
                throw "Not yet implemented";
            }

            if (callback) { // intentional truthiness
                callback(entity.instanceId);
            }
        };

        var createAndPositionPlayerEntityInstance = function (additional, callback) {
            if (namespace.DebugEnabled === true) {
                if (additional.position == null) { // intentional truthiness
                    throw "createAndPositionPlayerEntityInstance called without providing position data.";
                }
            }

            if (playerEntityInstance === null) {
                createEntityInstanceFromMessage(playerEntityInstanceDefinitionName, playerEntityInstanceDefaultPriority, additional, callback);
            } else {
                physEng.setInstanceAndBoundingDataPosition(playerEntityInstance.instanceId, new namespace.Math.Vector2D(additional.position.x, additional.position.y));
            }
        };

        var createEntityInstanceFromMessage = function (identifier, priority, additional, callback) {
            var entityInstanceDefinitionId;
            var entityInstanceDefinitionName;
            var entityInstanceDefinitionGameState;
            if (typeof (identifier) === "number") {
                entityInstanceDefinitionId = identifier;
                entityInstanceDefinitionName = entityInstanceDefinitions[identifier].name;
                entityInstanceDefinitionGameState = entityInstanceDefinitions[identifier].gameState;
            } else if (typeof (identifier) === "string") {
                entityInstanceDefinitionId = entityInstanceDefinitionNamedIds[identifier];
                entityInstanceDefinitionName = identifier;
                entityInstanceDefinitionGameState = entityInstanceDefinitions[entityInstanceDefinitionId].gameState;
            }
            if (entityInstanceDefinitionId !== undefined && entityInstanceDefinitionId !== null) {
                var xEntityType = {
                    entityInstanceDefinitionId: entityInstanceDefinitionId,
                    entityInstanceDefinitionName: entityInstanceDefinitionName,
                    entityInstanceDefinitionGameState: entityInstanceDefinitionGameState
                };
                if (additional != undefined) {
                    if (additional.position !== undefined) {
                        xEntityType.position = {
                            x: additional.position.x,
                            y: additional.position.y
                        };
                    }
                    if (additional.rotation !== undefined) {
                        xEntityType.rotation = {
                            x: additional.rotation.x,
                            y: additional.rotation.y
                        };
                    }
                    if (additional.scale !== undefined) {
                        xEntityType.scale = {
                            x: additional.scale.x,
                            y: additional.scale.y
                        };
                    }
                    if (additional.velocity !== undefined) {
                        xEntityType.velocity = {
                            x: additional.velocity.x,
                            y: additional.velocity.y
                        };
                    }
                    createEntityInstance(xEntityType, priority, additional, callback);
                } else {
                    createEntityInstance(xEntityType, priority, null, callback);
                }
            }
        };

        var removeEntityInstanceFromMessage = function (instanceId) {
            for (var i = 0; i < entityInstances.length; ++i) {
                var instance = entityInstances[i];
                if (instance.instanceId === instanceId) {
                    var entityDefinition = entityInstanceDefinitions[instance.instanceDefinitionId];
                    if (entityHasBehavior(entityDefinition)) {
                        behaviorEngine.removeBehaviorComponentInstanceFromMessage(instance.instanceId);
                    }
                    if (entityHasGraphics(entityDefinition)) {
                        graphicsEngine.removeGraphicsComponentInstanceFromMessage(instance.instanceId);
                    }
                    if (entityHasPhysics(entityDefinition)) {
                        physicsEngine.removePhysicsComponentInstanceFromMessage(instance.instanceId);
                    }
                    if (entityHasAudible(entityDefinition)) {
                        throw "Not yet implemented";
                    }
                    if (instance.entityInstanceDefinitionName === playerEntityInstanceDefinitionName && playerEntityInstance !== null) {
                        playerEntityInstance = null;
                    }
                    entityInstances.splice(i, 1);
                    break;
                }
            }
        };

        var removeEntityInstancesByPriority = function (priority) {
            var entitiesToRemove = entityInstances.where(function (x) {
                return x.priority >= priority;
            }).select(function(x){
                return x.instanceId;
            });
            entitiesToRemove.forEach(function (instanceId) {
                removeEntityInstanceFromMessage(instanceId);
            });
        };

        var getTransformationForEntityInstance = function (callback, instanceId) {
            var entityInstance = entityInstances.firstOrNull(function (x) {
                return x.instanceId === instanceId;
            });
            if (entityInstance !== null) {
                callback(entityInstance.transformation);
            }
        };

        var setInstancePriority = function (instanceId, priority) {
            var instance = entityInstances.firstOrNull(function (x) {
                return x.instanceId === instanceId;
            });
            if (instance !== null) {
                instance.priority = priority;
            }
        };

        var setInstanceGameState = function (instanceId, gameState) {
            var instance = entityInstances.firstOrNull(function (x) {
                return x.instanceId === instanceId;
            });
            if (instance !== null) {
                var oldGameState = instance.gameState;
                instance.gameState = gameState;
                var entityDefinition = entityInstanceDefinitions[instanceId];
                if (entityHasBehavior(entityDefinition)) {
                    behaviorEngine.swapInstanceGameState(instanceId, oldGameState, gameState);
                }
                if (entityHasGraphics(entityDefinition)) {
                    graphicsEngine.swapInstanceGameState(instanceId, oldGameState, gameState);
                }
                if (entityHasPhysics(entityDefinition)) {
                    physicsEngine.swapInstanceGameState(instanceId, oldGameState, gameState);
                }
                if (entityHasAudible(entityDefinition)) {
                    throw "Not yet implemented";
                }
            }
        };

        var setInstancePosition = function (instanceId, position) {
            var instance = entityInstances.firstOrNull(function (x) {
                return x.instanceId === instanceId;
            });
            if (instance !== null) {
                instance.transformation.setPosition(position.x, position.y);
            }
        };

        var setInstanceRotation = function (instanceId, rotation) {
            var instance = entityInstances.firstOrNull(function (x) {
                return x.instanceId === instanceId;
            });
            if (instance !== null) {
                instance.transformation.setRotation(rotation);
            }
        };

        var setInstanceScale = function (instanceId, scale) {
            var instance = entityInstances.firstOrNull(function (x) {
                return x.instanceId === instanceId;
            });
            if (instance !== null) {
                instance.transformation.setScale(scale.x, scale.y);
            }
        };

        var setInstanceVelocity = function (instanceId, velocity) {
            var instance = entityInstances.firstOrNull(function (x) {
                return x.instanceId === instanceId;
            });
            if (instance !== null) {
                instance.transformation.setVelocity(velocity.x, velocity.y);
            }
        };

        messengerEngine.registerForMessage("createAndPositionPlayerEntityInstance", this, createAndPositionPlayerEntityInstance);
        messengerEngine.registerForMessage("createEntityInstance", this, createEntityInstanceFromMessage);
        messengerEngine.registerForMessage("removeEntityInstance", this, removeEntityInstanceFromMessage);
        messengerEngine.registerForMessage("removeEntityInstancesByPriority", this, removeEntityInstancesByPriority);
        messengerEngine.registerForMessage("setInstancePriority", this, setInstancePriority);
        messengerEngine.registerForMessage("setInstanceGameState", this, setInstanceGameState);
        messengerEngine.registerForMessage("setInstancePosition", this, setInstancePosition);
        messengerEngine.registerForMessage("setInstanceRotation", this, setInstanceRotation);
        messengerEngine.registerForMessage("setInstanceScale", this, setInstanceScale);
        messengerEngine.registerForMessage("setInstanceVelocity", this, setInstanceVelocity);
        messengerEngine.registerForRequest("getTransformationForEntityInstance", this, getTransformationForEntityInstance);
    };
}(window.TTTD = window.TTTD || {}));