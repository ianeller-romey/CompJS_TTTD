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
            that.position = new Vector2D(x, y);
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
            that.scale = new Vector2D(x, y);
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
            that.velocity = new Vector2D(x, y);
        };

        initPosition();
        initRotation();
        initScale();
        initVelocity();
    };

    namespace.Comp.Inst.Transformation.prototype.setPosition = function (x, y) {
        this.position = this.position.setAndNotify(new Math.Vector2D(x, y));
    };

    namespace.Comp.Inst.Transformation.prototype.setRotation = function (rot) {
        this.rotation = this.rotation.setAndNotify(rot);
    };

    namespace.Comp.Inst.Transformation.prototype.setScale = function (x, y) {
        this.scale = this.scale.setAndNotify(new Math.Vector2D(x, y));
    };

    namespace.Comp.Inst.Transformation.prototype.setVelocity = function (x, y) {
        this.velocity = this.velocity.setAndNotify(new Math.Vector2D(x, y));
    };

    ////////
    // EntityInst
    namespace.Comp = namespace.Comp || {};
    namespace.Comp.Inst = namespace.Comp.Inst || {};
    namespace.Comp.Inst.Entity = function (instanceId, entityTypeId, entityTypeName, position, rotation, scale, velocity) {
        this.instanceId = instanceId;
        this.typeId = entityTypeId;
        this.typeName = entityTypeName;

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
        this.name = x.name;
        this.behavior = x.behavior;
        this.graphics = x.graphics;
        this.physics = x.physics;
        this.audible = x.audible;
    };

    ////////
    // EntityEngine
    namespace.Engines = namespace.Engines || {};
    namespace.Engines.EntityManager = function () {
        var Inst = namespace.Comp.Inst;
        var Def = namespace.Comp.Def;

        var messengerEngine = namespace.Globals.globalMessengerEngine;
        var servicesEngine = namespace.Globals.globalServicesEngine;

        var entityTypeDefinitions = [];
        var entityTypeNamedIds = [];
        var entityInstances = [];

        var entityHasBehavior = namespace.Comp.Inst.Entity.hasBehavior;
        var entityHasGraphics = namespace.Comp.Inst.Entity.hasGraphics;
        var entityHasPhysics = namespace.Comp.Inst.Entity.hasPhysics;
        var entityHasAudible = namespace.Comp.Inst.Entity.hasAudible;

        var entityIdGenerator = 0;

        var buildEntityTypeDefinitions = function (data) {
            data.forEach(function (x) {
                entityTypeDefinitions[x.id] = new namespace.Comp.Def.Entity(x);

                entityTypeNamedIds[x.name] = x.id;
            });
        };

        this.init = function () {
            return new Promise(function (resolve, reject) {
                servicesEngine.retrieveAllEntityTypeDefinitionsForGame().then(function (data) {
                    buildEntityTypeDefinitions(data);
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
                entityTypeDefinitions = [];
                entityTypeNamedIds = [];
                entityInstances = [];
                messengerEngine.unregisterAll(that);
                resolve();
            });
        };

        var createEntityInstance = function (xEntityType, data, callback) {
            var entity = new namespace.Comp.Inst.Entity(entityIdGenerator++, xEntityType.entityTypeId, xEntityType.entityTypeName, xEntityType.position, xEntityType.rotation, xEntityType.scale, xEntityType.velocity);
            entityInstances.push(entity);

            var entityDefinition = entityTypeDefinitions[entity.typeId];
            if (entityHasBehavior(entityDefinition)) {
                messengerEngine.postImmediate("createBehavior", entity, entityDefinition.behavior);
                if (data !== undefined && data !== null) {
                    messengerEngine.postImmediate("setBehaviorInstanceData", entity.instanceId, data);
                }
            }
            if (entityHasGraphics(entityDefinition)) {
                messengerEngine.postImmediate("createGraphics", entity, entityDefinition.graphics);
            }
            if (entityHasPhysics(entityDefinition)) {
                messengerEngine.postImmediate("createPhysics", entity, entityDefinition.physics);
            }
            if(entityHasAudible(entityDefinition)) {
                messengerEngine.postImmediate("createAudible", entity, entityDefinition.audible);
            }

            if (callback) { // intentional truthiness
                callback(entity.instanceId);
            }
        };

        var createEntityInstanceFromMessage = function (name, additional, callback) {
            var entityTypeNamedId = entityTypeNamedIds[name];
            if (entityTypeNameId !== undefined && entityTypeNamedId !== null) {
                var xEntityType = {
                    entityTypeId: entityTypeNamedId,
                    entityTypeName: name
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
                    createEntityInstance(xEntityType, additional.data, callback);
                } else {
                    createEntityInstance(xEntityType, null, callback);
                }
            }
        };

        var removeEntityInstanceFromMessage = function (instanceId) {
            for (var i = 0; i < entityInstances.length; ++i) {
                var instance = entityInstances[i];
                if (instance.instanceId === instanceId) {
                    entityInstances.splice(i, 1);
                    break;
                }
            }
        };

        var removeAllEntityInstancesButOne = function (instanceId) {
            while (entityInstances.length > 1) {
                var index = (entityInstances[0].instanceId === instanceId) ? 1 : 0;
                messengerEngine.postImmediate("removeEntityInstance", entityInstances[index].instanceId);
            }
        };

        var getTransformationForEntityInstance = function (instanceId) {
            var entityInstance = entityInstances.firstOrNull(function (x) {
                return x.instanceId === instanceId;
            });
            if (entityInstance !== null) {
                messengerEngine.postImmediate("getTransformationForEntityInstanceResponse", instanceId, entityInstance.transformation);
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

        this.loadLevel = function (levelId) {
            servicesEngine.loadLevel(levelId).then(function (data) {
                entityInstances = [];

                data.levelPositions.forEach(function (x) {
                    createEntityInstance(x);
                });

                data.entityTypesOnAllLevels.forEach(function (x) {
                    createEntityInstance({
                        entityTypeId: x.id,
                        entityTypeName: x.name,
                        behavior: x.behavior,
                        graphics: x.graphics,
                        physics: x.physics,
                        audible: x.audible,
                        x: 0,
                        y: 0
                    });
                });
            }, function (reason) {
                var reasonPlus = "Failed to load game level";
                if (reason) { // intentional truthiness
                    reasonPlus = reasonPlus + "\r\n" + reason;
                }
                reject(reasonPlus);
            });
        };

        messengerEngine.register("createEntityInstance", this, createEntityInstanceFromMessage);
        messengerEngine.register("removeEntityInstance", this, removeEntityInstanceFromMessage);
        messengerEngine.register("removeAllEntityInstancesButOne", this, removeAllEntityInstancesButOne);
        messengerEngine.register("setInstancePosition", this, setInstancePosition);
        messengerEngine.register("setInstanceScale", this, setInstanceScale);
        messengerEngine.register("getTransformationForEntityInstanceRequest", this, getTransformationForEntityInstance);
    };
}(window.TTTD = window.TTTD || {}));