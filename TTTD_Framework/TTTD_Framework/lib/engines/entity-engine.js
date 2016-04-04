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
            messengerEngine.unregisterAll(this);
        }
    };

    ////////
    // TransformationInst
    namespace.Comp = namespace.Comp || {};
    namespace.Comp.Inst = namespace.Comp.Inst || {};
    namespace.Comp.Inst.Transformation = function (position, rotation, scale, velocity) {
        var that = this;

        this.position = null;
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
        };

        this.rotation = null;
        var initRotation = function () {
            var rot = 0;
            if (rotation != null) {
                rot = rotation;
            }
            that.rotation = new Number(rot);
        };

        this.scale = null;
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
        };

        this.velocity = null;
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
        };

        initPosition();
        initRotation();
        initScale();
        initVelocity();
    };

    namespace.Comp.Inst.Transformation.prototype.setPosition = function (x, y) {
        this.position = this.position.setAndNotify(new namespace.Math.Vector2D(x, y));
    };

    namespace.Comp.Inst.Transformation.prototype.setRotation = function (rot) {
        this.rotation = this.rotation.setAndNotify(rot);
    };

    namespace.Comp.Inst.Transformation.prototype.setScale = function (x, y) {
        this.scale = this.scale.setAndNotify(new namespace.Math.Vector2D(x, y));
    };

    namespace.Comp.Inst.Transformation.prototype.setVelocity = function (x, y) {
        this.velocity = this.velocity.setAndNotify(new namespace.Math.Vector2D(x, y));
    };

    ////////
    // EntityInst
    namespace.Comp = namespace.Comp || {};
    namespace.Comp.Inst = namespace.Comp.Inst || {};
    namespace.Comp.Inst.Entity = function (instanceId, entityInstanceDefinitionId, entityInstanceDefinitionName, priority, position, rotation, scale, velocity) {
        this.instanceId = instanceId;
        this.instanceDefinitionId = entityInstanceDefinitionId;
        this.instanceDefinitionName = entityInstanceDefinitionName;
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
        var audioEngine = audEng;
        var behaviorEngine = bhvEng;
        var graphicsEngine = gfxEng;
        var physicsEngine = physEng;

        var entityInstanceDefinitions = [];
        var entityInstanceDefinitionNamedIds = [];
        var entityInstances = [];

        var playerEntityInstanceDefinitionName = "Player";
        var playerEntityInstanceDefaultPriority = 0;
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

        this.shutdown = function () {
            var that = this;
            return new Promise(function (resolve, reject) {
                entityInstanceDefinitions = [];
                entityInstanceDefinitionNamedIds = [];
                entityInstances = [];
                messengerEngine.unregisterAll(that);
                resolve();
            });
        };

        var createEntityInstance = function (xEntityType, priority, data, callback) {
            var entity = new namespace.Comp.Inst.Entity(entityIdGenerator++, xEntityType.entityInstanceDefinitionId, xEntityType.entityInstanceDefinitionName, priority, xEntityType.position, xEntityType.rotation, xEntityType.scale, xEntityType.velocity);
            entityInstances.push(entity);

            if (playerEntityInstance === null && xEntityType.entityInstanceDefinitionName === playerEntityInstanceDefinitionName) {
                playerEntityInstance = entity;
            }

            var entityDefinition = entityInstanceDefinitions[entity.instanceDefinitionId];
            if (entityHasBehavior(entityDefinition)) {
                behaviorEngine.createBehaviorComponentInstance(entity, entityDefinition.behavior);
                if (data !== undefined && data !== null) {
                    behaviorEngine.setBehaviorComponentInstanceData(entity.instanceId, data);
                }
            }
            if (entityHasGraphics(entityDefinition)) {
                graphicsEngine.createGraphicsComponentInstance(entity, entityDefinition.graphics);
            }
            if (entityHasPhysics(entityDefinition)) {
                physicsEngine.createPhysicsComponentInstance(entity, entityDefinition.physics);
            }
            if (entityHasAudible(entityDefinition)) {
                throw "Not yet implemented";
            }

            if (callback) { // intentional truthiness
                callback(entity.instanceId);
            }
        };

        var createAndPositionPlayerEntityInstance = function (additional, callback) {
            if (namespace.DebugEnabled) { // intentional truthiness
                if (additional.position == null) { // intentional truthiness
                    throw "createAndPositionPlayerEntityInstance called without providing position data.";
                }
            }

            if (playerEntityInstance === null) {
                createEntityInstanceFromMessage(playerEntityInstanceDefinitionName, playerEntityInstanceDefaultPriority, additional, callback);
            } else {
                messengerEngine.queueForPosting("setInstanceAndBoundingDataPosition", playerEntityInstance.instanceId, new namespace.Math.Vector2D(additional.position.x, additional.position.y));
            }
        };

        var createEntityInstanceFromMessage = function (identifier, priority, additional, callback) {
            var entityInstanceDefinitionId;
            var entityInstanceDefinitionName;
            if (typeof (identifier) === "number") {
                entityInstanceDefinitionId = identifier;
                entityInstanceDefinitionName = entityInstanceDefinitions[identifier].name;
            } else if (typeof (identifier) === "string") {
                entityInstanceDefinitionId = entityInstanceDefinitionNamedIds[identifier];
                entityInstanceDefinitionName = identifier;
            }
            if (entityInstanceDefinitionId !== undefined && entityInstanceDefinitionId !== null) {
                var xEntityType = {
                    entityInstanceDefinitionId: entityInstanceDefinitionId,
                    entityInstanceDefinitionName: entityInstanceDefinitionName
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
                    createEntityInstance(xEntityType, priority, additional.data, callback);
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

        var setInstancePosition = function (instanceId, position) {
            var instance = entityInstances.firstOrNull(function (x) {
                return x.instanceId === instanceId;
            });
            if (instance !== null) {
                var xPos = instance.transformation.position.x;
                var yPos = instance.transformation.position.y;
                if (position.x !== undefined) {
                    xPos = position.x;
                }
                if (position.y !== undefined) {
                    yPos = position.y;
                }
                instance.transformation.setPosition(xPos, yPos);
            }
        };

        var setInstanceScale = function (instanceId, scale) {
            var instance = entityInstances.firstOrNull(function (x) {
                return x.instanceId === instanceId;
            });
            if (instance !== null) {
                var xPos = instance.transformation.scale.x;
                var yPos = instance.transformation.scale.y;
                if (scale.x !== undefined) {
                    xPos = scale.x;
                }
                if (scale.y !== undefined) {
                    yPos = scale.y;
                }
                instance.transformation.setScale(xPos, yPos);
            }
        };

        messengerEngine.register("createAndPositionPlayerEntityInstance", this, createAndPositionPlayerEntityInstance);
        messengerEngine.register("createEntityInstance", this, createEntityInstanceFromMessage);
        messengerEngine.register("removeEntityInstance", this, removeEntityInstanceFromMessage);
        messengerEngine.register("removeEntityInstancesByPriority", this, removeEntityInstancesByPriority);
        messengerEngine.register("setInstancePosition", this, setInstancePosition);
        messengerEngine.register("setInstanceScale", this, setInstanceScale);
        messengerEngine.register("getTransformationForEntityInstanceRequest", this, getTransformationForEntityInstance);
    };
}(window.TTTD = window.TTTD || {}));