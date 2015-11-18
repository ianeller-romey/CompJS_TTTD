(function (namespace, undefined) {
    "use strict";

    ////////
    // PhysCompInst
    namespace.Comp = namespace.Comp || {};
    namespace.Comp.Inst = namespace.Comp.Inst || {};
    namespace.Comp.Inst.Phys = function (entity, physCompDefinition) {
        this.instanceId = entity.instanceId;
        this.entityTypeName = entity.typeName;
        this.transformation = entity.transformation;
        this.physics = new namespace.Comp.Inst.Phys.Physics(physCompDefinition);
    };

    namespace.Comp.Inst.Phys.prototype = new namespace.Comp.Inst.Component();

    namespace.Comp.Inst.Phys.prototype.destroy = function (messengerEngine) {
        if (messengerEngine !== null) {
            messengerEngine.unregisterAll(this);
            if (this.physics !== null) {
                messengerEngine.unregisterAll(this.physics);
            }
        }
    };

    namespace.Comp.Inst.Phys.Physics = function (physCompDefinition, transformation) {
        this.physTypeId = physCompDefinition.physTypeId;
        this.collisionTypeId = physCompDefinition.collisionTypeId;
        this.boundingData = physCompDefinition.boundingData.clone();
        this.colliders = [];
        
        this.boundingData.translateSelf(transformation.position.x, transformation.position.y);
    };

    ////////
    // PhysCompDef
    namespace.Comp = namespace.Comp || {};
    namespace.Comp.Def = namespace.Comp.Def || {};
    namespace.Comp.Def.Phys = function (def, boundingData) {
        this.physTypeId = def.physTypeId;
        this.collisionTypeId = def.collisionTypeId;
        this.boundingData = boundingData;
    };

    ////////
    // PhysEngine
    namespace.Engines = namespace.Engines || {};
    namespace.Engines.PhysEngine = function () {
        var Inst = namespace.Comp.Inst;
        var Def = namespace.Comp.Def;

        var messengerEngine = namespace.Globals.globalMessengerEngine;
        var servicesEngine = namespace.Globals.globalServicesEngine;

        var physTypeDefinitions = [];
        var collisionTypeDefinitions = [];
        var physCompDefinitions = [];
        var physCompInstances = [];

        var buildPhysTypeDefinitions = function (data) {
            data.forEach(function (x) {
                physTypeDefinitions[x.id] = new Def.TypeDesc(x);
            });
        };

        var buildCollisionTypeDefinitions = function (data) {
            data.forEach(function (x) {
                collisionTypeDefinitions[x.id] = new Def.TypeDesc(x);
            });
        };

        var buildPhysCompDefinitions = function (data) {
            data.forEach(function (x) {
                var physType = physTypeDefinitions[x.physTypeId];
                var boundingData;
                if (physType == "Circle") {
                    boundingData = new BoundingCircle(JSON.parse(x.boundingData));
                } else if (physType == "AABB") {
                    boundingData = new BoundingAABB(JSON.parse(x.boundingData));
                }
                physCompDefinitions[x.id] = new Def.Phys(x, boundingData);
            });
        };

        this.init = function () {
            var physTypesPromise = new Promise(function (resolve, reject) {
                servicesEngine.retrievePhysTypes().then(function (data) {
                    buildPhysTypeDefinitions(data);
                    resolve();
                }, function (reason) {
                    var reasonPlus = "Failed to load physics types";
                    if (reason !== null) {
                        reasonPlus = reasonPlus + "\r\n" + reason;
                    }
                    reject(reasonPlus);
                });
            });
            var collisionTypesPromise = new Promise(function (resolve, reject) {
                servicesEngine.retrieveCollisionTypes().then(function (data) {
                    buildCollisionTypeDefinitions(data);
                    resolve();
                }, function (reason) {
                    var reasonPlus = "Failed to load collision types";
                    if (reason !== null) {
                        reasonPlus = reasonPlus + "\r\n" + reason;
                    }
                    reject(reasonPlus);
                });
            });

            return new Promise(function (resolve, reject) {
                Promise.all([physTypesPromise, collisionTypesPromise]).then(function () {
                    servicesEngine.retrieveAllPhysCompDefinitionsForGame().then(function (data) {
                        buildPhysCompDefinitions(data);
                        resolve();
                    }, function (reason) {
                        var reasonPlus = "Failed to load physics definitions";
                        if (reason !== null) {
                            reasonPlus = reasonPlus + "\r\n" + reason;
                        }
                        reject(reasonPlus);
                    });
                }, function (reason) {
                    var reasonPlus = "Failed to load physics and collision types";
                    if (reason !== null) {
                        reasonPlus = reasonPlus + "\r\n" + reason;
                    }
                    reject(reasonPlus);
                });
            });
        };

        var addColliders = function (instance, otherInstance) {
            instance.physics.colliders.push({
                instanceId: otherInstance.instanceId,
                entityTypeName: otherInstance.entityTypeName,
                position: new Vector2D(otherInstance.transformation.position.x, otherInstance.transformation.position.y)
            });
        };

        this.update = function (delta) {
            for (var i = 0; i < physCompInstances.length; ++i) {
                var instance = physCompInstances[i];
                instance.physics.colliders = [];

                var collisionTypeDefinition = collisionTypeDefinitions[instance.physics.collisionTypeId];
                if (collisionTypeDefinition !== "Static") {
                    var transformation = instance.transformation;
                    var bounding = instance.physics.boundingData;

                    var hasNonGhostCollider = false;
                    var totalDisplacementVector = new Math.Vector2D(0, 0);
                    for (var j = 0; j < physCompInstances.length; ++j) {
                        if (j === i) {
                            continue;
                        }
                        // TODO: Optimize so we don't check the same two instances twice
                        var otherInstance = physCompInstances[j];
                        var otherTransformation = otherInstance.transformation;
                        var otherBounding = otherInstance.physics.boundingData;

                        var relativeVelocity = transformation.velocity.translate(-otherTransformation.velocity.x, -otherTransformation.velocity.y);
                        var currentDisplacementVector;

                        if (physTypeDefinitions[otherInstance.physics.physTypeId] === "Circle") {
                            currentDisplacementVector = bounding.collideWithBoundingCircle(otherBounding, relativeVelocity);
                        } else if (physTypeDefinitions[otherInstance.physics.physTypeId] === "AABB") {
                            currentDisplacementVector = bounding.collideWithBoundingAABB(otherBounding, relativeVelocity);
                        }
                        // TODO: OBB

                        if (currentDisplacementVector) {
                            if (!hasNonGhostCollider && collisionTypeDefinitions[otherInstance.physics.collisionTypeId] !== "Ghost") {
                                hasNonGhostCollider = true;
                            }
                            totalDisplacementVector.translateSelf(currentDisplacementVector);
                            addColliders(instance, otherInstance);
                        }
                    }

                    if (!hasNonGhostCollider || collisionTypeDefinition === "Ghost") {
                        instance.transformation.position.translate(transformation.velocity.x + totalDisplacementVector.x, transformation.velocity.y + totalDisplacementVector.y);
                    }
                }
            }
        };

        this.shutdown = function (gameId) {
            var that = this;
            return new Promise(function (resolve, reject) {
                var physTypeDefinitions = [];
                var collisionTypeDefinitions = [];
                var physCompDefinitions = [];
                while (physCompInstances.length > 0) {
                    physCompInstances[0].destroy();
                    physCompInstances.shift();
                }
                messengerEngine.unregisterAll(that);
                resolve();
            });
        };

        var createPhysCompInstance = function (entity, physCompId) {
            var physCompDefinition = physCompDefinitions[physCompId];
            var instance = new PhysicsComponentInstance(entity, physCompDefinition);
            physCompInstances.push(instance);
            messengerEngine.queueForPosting("createdPhysicsInstance", instance.physics, instance.instanceId);
        };

        var getPhysCompInstanceForEntityInstance = function (instanceId) {
            var instance = physCompInstances.firstOrNull(function (x) {
                return x.instanceId === instanceId;
            });
            if (instance !== null) {
                messengerEngine.postImmediate("getPhysCompInstanceForEntityInstanceResponse", instanceId, instance);
            }
        };

        var removePhysCompInstanceFromMessage = function (instanceId) {
            for (var i = 0; i < physCompInstances.length; ++i) {
                var instance = physCompInstances[i];
                if (instance.instanceId === instanceId) {
                    physCompInstances[i].destroy();
                    physCompInstances.splice(i, 1);
                    break;
                }
            }
        };

        messengerEngine.register("createPhysics", this, createPhysCompInstance);
        messengerEngine.register("getPhysCompInstanceForEntityInstanceRequest", this, getPhysCompInstanceForEntityInstance);
        messengerEngine.register("removeEntityInstance", this, removePhysCompInstanceFromMessage);
    };
        
    var Phys = namespace.Engines.PhysEngine;
    Phys.Collision = Phys.Collision || {};

    if(!Phys.Collision.Axes) { // intentional truthiness
        Phys.Collision.Axes = {};
        Phys.Collision.Axes.X = new Math.Vector2D(1, 0);
        Phys.Collision.Axes.Y = new Math.Vector2D(0, 1);
        Phys.Collision.Axes.ProjectionData = function (min, max) {
            this.min = min;
            this.max = max;
        };
        Phys.Collision.Axes.ProjectionData.prototype.getIntervalDistance = function (other) {
            return (this.min < other.min) ? other.min - this.max : this.min - other.max;
        };
    }

    if(!Phys.Collision.Data) {
        Phys.Collision.Calculation = function() {
            this.intersecting = true;
            this.willIntersect = true;
            this.minIntervalDistance = Number.MAX_VALUE;
            this.displacementAxis = new Math.Vector2D(0, 0);
        };

        Phys.Collision.Calculation.prototype.getDisplacementVector = function() {
            return this.displacementAxis.scale(this.minIntervalDistance);
        };

        Phys.Collision.SAT = function (first, second, axis, relativeVelocity, calculation) {
            axis = axis.clone().normalize();

            // X axis projection
            var firstData = first.projectOntoAxis(axis);
            var secondData = aabb.projectOntoAxis(axis);

            // currently intersecting?
            if (firstData.getIntervalDistance(secondData) > 0) {
                calculation.intersecting = false;
            }

            // will intersect?
            var velocityProjection = axis.dot(relativeVelocity);
            if(velocityProjection < 0) {
                firstData.min += velocityProjection;
            } else {
                firstData.max += velocityProjection;
            }
            var intervalDistance = firstData.getIntervalDistance(secondData);
            if(intervalDistance > 0) {
                calculation.willIntersect = false;
            }

            if(!calculation.intersecting && !calculation.willIntersect) {
                return false;
            }

            intervalDistance = Math.abs(intervalDistance);
            if (intervalDistance < calculation.minIntervalDistance) {
                calculation.minIntervalDistance = intervalDistance;

                var displacementAxis = axis;

                var d = first.origin.translate({
                    x: -second.origin.x, 
                    y: -second.origin.y
                });
                if (d.dot(displacementAxis) < 0) {
                    displacementAxis = new Math.Vector2D(-displacementAxis.x, -displacementAxis.y);
                }

                calculation.displacementAxis = displacementAxis;
            }

            return true;
        };
    }

    if (!Phys.Collision.BoundingCircle) { // intentional truthiness
        Phys.Collision.BoundingCircle = function (origin, radius) {
            this.origin = new Math.Vector2D(origin.x, origin.y);
            this.radius = radius;
        };

        Phys.Collision.BoundingCircle.prototype.translate = function(vector) {
            this.origin.translateSelf(vector.x, vector.y);
        };

        /*
            Returns false if no collision will happen, and the necessary displacement vector if a collision has happened (or will happen if the velocity is added);
            the necessary displacement vector can be 0, 0.
        */
        Phys.Collision.BoundingCircle.prototype.collideWithBoundingAABB = function (rect) {
            var outerCircle = new Phys.Collision.BoundingCircle(rect.origin, rect.halfVals.diag);
            if (!outerCircle.collideWithBoundingCircle(circle)) {
                return false;
            }

            var calculation = new Phys.Collision.Calculation();

            var yesOnThisAxis = Phys.Collision.SAT(this, rect, Phys.Collision.Axes.X, relativeVelocity, calculation);
            if (!yesOnThisAxis) {
                return false;
            }

            yesOnThisAxis = Phys.Collision.SAT(this, rect, Phys.Collision.Axes.Y, relativeVelocity, calculation);
            if (!yesOnThisAxis) {
                return false;
            }

            // naive voronoi calculation
            // don't check for equals; unnecessary
            var voronoiVertex;
            if (rect.origin.x > this.origin.x) {
                voronoiVertex = (rect.origin.y > this.origin.y) ? rect.maxVals.clone() : new Math.Vector2D(rect.maxVals.x, rect.minVals.y);
            } else {
                voronoiVertex = (rect.origin.y < this.origin.y) ? rect.minVals.clone() : new Math.Vector2D(rect.minVals.x, rect.maxVals.y);
            }
            var finalAxis = circle.origin.translate(-voronoiVertex.x, -voronoiVertex.y).normalize();
            yesOnThisAxis = Phys.Collision.SAT(this, rect, finalAxis, relativeVelocity, calculation);
            if(!yesOnThisAxis) {
                return false;
            }

            var displacementVector = (calculation.willIntersect) ? calculation.getDisplacementVector() : new Math.Vector2D(0, 0);
            return displacementVector;
        };

        /*
            Returns false if no collision will happen, and the necessary displacement vector if a collision has happened (or will happen if the velocity is added);
            the necessary displacement vector can be 0, 0.
        */
        Phys.Collision.BoundingCircle.prototype.collideWithBoundingCircle = function (circle, relativeVelocity) {
            var r = this.radius + circle.radius;
            r *= r;
            if(this.origin.distance2(circle.origin) > r) {
                return false;
            }

            var calculation = new Phys.Collision.Calculation();

            var yesOnThisAxis = Phys.Collision.SAT(this, circle, Phys.Collision.Axes.X, relativeVelocity, calculation);
            if (!yesOnThisAxis) {
                return false;
            }

            yesOnThisAxis = Phys.Collision.SAT(this, circle, Phys.Collision.Axes.Y, relativeVelocity, calculation);
            if (!yesOnThisAxis) {
                return false;
            }

            // naive voronoi calculation
            // don't check for equals; unnecessary
            var finalAxis = circle.origin.translate(-this.origin.x, -this.origin.y).normalize();
            yesOnThisAxis = Phys.Collision.SAT(this, circle, finalAxis, relativeVelocity, calculation);
            if(!yesOnThisAxis) {
                return false;
            }

            var displacementVector = (calculation.willIntersect) ? calculation.getDisplacementVector() : new Math.Vector2D(0, 0);
            return displacementVector;
        };
        
        /*
            The provided axis should already be normalized.
        */
        Phys.Collision.BoundingCircle.prototype.projectOntoAxis = function (axis) {
            var translated = axis.translate(this.origin.x, this.origin.y);
            var scaledUp = axis.dot(translated.scale(this.radius));
            var scaledDown = axis.dot(translated.scale(-this.radius));

            return (scaledDown < scaledUp) ? new Phys.Collision.Axes.ProjectionData(scaled, scaledUp) : new Phys.Collision.Axes.ProjectionData(scaledUp, scaledDown);
        };
    }

    if (!Phys.Collision.BoundingAABB) { // intentional truthiness
        Phys.Collision.BoundingAABB = function (minVals, maxVals) {
            this.minVals = new Math.Vector2D(minVals.x, minVals.y);
            this.maxVals = new Math.Vector2D(maxVals.x, maxVals.y);
            this.halfVals = {
                x: (this.maxVals.x - this.minVals.x) / 2,
                y: (this.maxVals.y - this.minVals.y) / 2,
                diag: this.maxVals.distance(this.minVals)
            };
            this.origin = new Math.Vector2D(this.minVals.x + this.halfVals.x, this.minVals.y + this.halfVals.y);
        };

        Phys.Collision.BoundingCircle.prototype.translate = function(vector) {
            this.minVals.translateSelf(vector.x, vector.y);
            this.maxVals.translateSelf(vector.x, vector.y);
            this.origin.translateSelf(vector.x, vector.y);
        };

        /*
            Returns false if no collision will happen, and the necessary displacement vector if a collision has happened (or will happen if the velocity is added);
            the necessary displacement vector can be 0, 0.
        */
        Phys.Collision.BoundingAABB.prototype.collideWithBoundingAABB = function (aabb, relativeVelocity) {
            if (this.maxVals.x < aabb.minVals.x || this.minVals.x > aabb.maxVals.x) {
                return false;
            }
            if (this.maxVals.y < aabb.minVals.y || this.minVals.y > aabb.maxVals.y) {
                return false;
            }

            var calculation = new Phys.Collision.Calculation();

            var yesOnThisAxis = Phys.Collision.SAT(this, aabb, Phys.Collision.Axes.X, relativeVelocity, calculation);
            if (!yesOnThisAxis) {
                return false;
            }

            yesOnThisAxis = Phys.Collision.SAT(this, aabb, Phys.Collision.Axes.Y, relativeVelocity, calculation);
            if (!yesOnThisAxis) {
                return false;
            }

            var displacementVector = (calculation.willIntersect) ? calculation.getDisplacementVector() : new Math.Vector2D(0, 0);
            return displacementVector;
        };

        /*
            Returns false if no collision will happen, and the necessary displacement vector if a collision has happened (or will happen if the velocity is added);
            the necessary displacement vector can be 0, 0.
        */
        Phys.Collision.BoundingAABB.prototype.collideWithBoundingCircle = function (circle) {
            var r = this.halfVals.diag + circle.radius;
            r *= r;
            if (this.origin.distance2(circle.origin) > r) {
                return false;
            }

            var calculation = new Phys.Collision.Calculation();

            var yesOnThisAxis = Phys.Collision.SAT(this, circle, Phys.Collision.Axes.X, relativeVelocity, calculation);
            if (!yesOnThisAxis) {
                return false;
            }

            yesOnThisAxis = Phys.Collision.SAT(this, circle, Phys.Collision.Axes.Y, relativeVelocity, calculation);
            if (!yesOnThisAxis) {
                return false;
            }

            // naive voronoi calculation
            // don't check for equals; unnecessary
            var voronoiVertex;
            if (this.origin.x > circle.origin.x) {
                voronoiVertex = (this.origin.y > circle.origin.y) ? this.maxVals.clone() : new Math.Vector2D(this.maxVals.x, this.minVals.y);
            } else {
                voronoiVertex = (this.origin.y < circle.origin.y) ? this.minVals.clone() : new Math.Vector2D(this.minVals.x, this.maxVals.y);
            }
            var finalAxis = circle.origin.translate(-voronoiVertex.x, -voronoiVertex.y).normalize();
            yesOnThisAxis = Phys.Collision.SAT(this, circle, finalAxis, relativeVelocity, calculation);
            if(!yesOnThisAxis) {
                return false;
            }

            var displacementVector = (calculation.willIntersect) ? calculation.getDisplacementVector() : new Math.Vector2D(0, 0);
            return displacementVector;
        };

        /*
            The provided axis should already be normalized.
        */
        Phys.Collision.BoundingAABB.prototype.projectOntoAxis = function (axis) {
            var dot = axis.dot(this.minVals);
            var data = new Phys.Collision.Axes.ProjectionData(dot, dot);

            dot = axis.dot({
                x: this.minVals.x,
                y: this.maxVals.y
            });
            if (dot < data.min) {
                data.min = dot;
            } else if (dot > data.max) {
                data.max = dot;
            }

            dot = axis.dot({
                x: this.maxVals.x,
                y: this.minVals.y
            });
            if (dot < data.min) {
                data.min = dot;
            } else if (dot > data.max) {
                data.max = dot;
            }

            dot = axis.dot(this.maxVals);
            if (dot < data.min) {
                data.min = dot;
            } else if (dot > data.max) {
                data.max = dot;
            }

            return data;
        };
    }
}(window.TTTD = window.TTTD || {}));