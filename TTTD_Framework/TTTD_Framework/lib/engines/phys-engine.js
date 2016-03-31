(function (namespace, undefined) {
    "use strict";

    ////////
    // PhysCompInst
    namespace.Comp = namespace.Comp || {};
    namespace.Comp.Inst = namespace.Comp.Inst || {};
    namespace.Comp.Inst.Physics = function (entity, physCompDefinition) {
        this.instanceId = entity.instanceId;
        this.entityTypeName = entity.typeName;
        this.transformation = entity.transformation;
        this.physics = new namespace.Comp.Inst.Physics.Physical(physCompDefinition, this.transformation);
    };

    namespace.Comp.Inst.Physics.prototype = new namespace.Comp.Inst.Component();

    namespace.Comp.Inst.Physics.prototype.destroy = function (messengerEngine) {
        if (messengerEngine !== null) {
            messengerEngine.unregisterAll(this);
            if (this.physics !== null) {
                messengerEngine.unregisterAll(this.physics);
            }
        }
    };

    namespace.Comp.Inst.Physics.Physical = function (physCompDefinition, transformation) {
        this.physTypeId = physCompDefinition.physTypeId;
        this.collisionTypeId = physCompDefinition.collisionTypeId;
        this.boundingData = physCompDefinition.boundingData.clone();
        this.colliders = [];
        
        this.boundingData.translate(transformation.position.x, transformation.position.y);
    };

    ////////
    // PhysCompDef
    namespace.Comp = namespace.Comp || {};
    namespace.Comp.Def = namespace.Comp.Def || {};
    namespace.Comp.Def.Physics = function (def, boundingData) {
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
        var dataEngine = namespace.Globals.globalDataEngine;

        var physTypeDefinitions = [];
        var collisionTypeDefinitions = [];
        var physCompDefinitions = [];
        var physCompInstances = [];

        var gravity = new namespace.Math.Vector2D(0, 50);

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

        var buildPhysicsComponentInstanceDefinitions = function (data) {
            data.forEach(function (x) {
                var physType = physTypeDefinitions[x.physTypeId];
                var boundingData;
                var parsed = JSON.parse(x.boundingData);
                if (physType.name == "Circle") {
                    boundingData = new namespace.Engines.PhysEngine.Collision.BoundingCircle(parsed.origin, parsed.radius);
                } else if (physType.name == "AABB") {
                    boundingData = new namespace.Engines.PhysEngine.Collision.BoundingAABB(parsed.origin, parsed.halfValues);
                }
                physCompDefinitions[x.id] = new Def.Physics(x, boundingData);
            });
        };

        this.init = function () {
            var physTypesPromise = new Promise(function (resolve, reject) {
                dataEngine.loadPhysTypes().then(function (data) {
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
                dataEngine.loadCollisionTypes().then(function (data) {
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
                    dataEngine.loadAllPhysicsInstanceDefinitions().then(function (data) {
                        buildPhysicsComponentInstanceDefinitions(data);
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
                position: new namespace.Math.Vector2D(otherInstance.transformation.position.x, otherInstance.transformation.position.y)
            });
        };

        this.update = function (delta) {
            delta = delta / 1000; // translate milliseconds to seconds
            for (var i = 0; i < physCompInstances.length; ++i) {
                var instance = physCompInstances[i];
                instance.physics.colliders = [];

                var collisionTypeDefinition = collisionTypeDefinitions[instance.physics.collisionTypeId];
                if (collisionTypeDefinition.name !== "Static") {
                    var velocity = instance.transformation.velocity.translate(gravity.x, gravity.y);
                    var bounding = instance.physics.boundingData.clone();

                    var hasNonGhostCollider = false;
                    var totalDisplacementVector = new namespace.Math.Vector2D(0, 0);
                    for (var j = 0; j < physCompInstances.length; ++j) {
                        if (j === i) {
                            continue;
                        }
                        // TODO: Optimize so we don't check the same two instances twice
                        var otherInstance = physCompInstances[j];
                        var otherTransformation = otherInstance.transformation;
                        var otherBounding = otherInstance.physics.boundingData;

                        var relativeVelocity = velocity.translate(-otherTransformation.velocity.x, -otherTransformation.velocity.y);
                        relativeVelocity.x *= delta;
                        relativeVelocity.y *= delta;
                        var currentDisplacementVector;

                        if (physTypeDefinitions[otherInstance.physics.physTypeId].name === "Circle") {
                            currentDisplacementVector = bounding.collideWithBoundingCircle(otherBounding, relativeVelocity);
                        } else if (physTypeDefinitions[otherInstance.physics.physTypeId].name === "AABB") {
                            currentDisplacementVector = bounding.collideWithBoundingAABB(otherBounding, relativeVelocity);
                        }
                        // TODO: OBB

                        if (currentDisplacementVector) {
                            if (!hasNonGhostCollider && collisionTypeDefinitions[otherInstance.physics.collisionTypeId].name !== "Ghost") {
                                hasNonGhostCollider = true;
                            }
                            // the displacement vector will always be positive; use the opposite of whatever direction we're actually heading
                            totalDisplacementVector.translateSelf(currentDisplacementVector.x, currentDisplacementVector.y);
                            addColliders(instance, otherInstance);
                        }
                    }

                    //if (!hasNonGhostCollider || collisionTypeDefinition.name === "Ghost") {
                        var endVector = {
                            x: (velocity.x * delta) + totalDisplacementVector.x,
                            y: (velocity.y * delta) + totalDisplacementVector.y
                        };
                        instance.transformation.position.translateSelf(endVector.x, endVector.y);
                        instance.physics.boundingData.translate(endVector.x, endVector.y);
                    //}
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

        this.createPhysicsComponentInstance = function (entity, physCompId) {
            var physCompDefinition = physCompDefinitions[physCompId];
            var instance = new Inst.Physics(entity, physCompDefinition);
            physCompInstances.push(instance);
        };

        var getPhysicsComponentInstanceForEntityInstance = function (instanceId) {
            var instance = physCompInstances.firstOrNull(function (x) {
                return x.instanceId === instanceId;
            });
            if (instance !== null) {
                messengerEngine.postImmediate("getPhysicsComponentInstanceForEntityInstanceResponse", instanceId, instance);
            }
        };

        var removePhysicsComponentInstanceFromMessage = function (instanceId) {
            for (var i = 0; i < physCompInstances.length; ++i) {
                var instance = physCompInstances[i];
                if (instance.instanceId === instanceId) {
                    physCompInstances[i].destroy();
                    physCompInstances.splice(i, 1);
                    break;
                }
            }
        };

        messengerEngine.register("getPhysicsComponentInstanceForEntityInstanceRequest", this, getPhysicsComponentInstanceForEntityInstance);
    };
        
    var Phys = namespace.Engines.PhysEngine;
    Phys.Collision = Phys.Collision || {};

    if(!Phys.Collision.Axes) { // intentional truthiness
        Phys.Collision.Axes = {};
        Phys.Collision.Axes.X = new namespace.Math.Vector2D(1, 0);
        Phys.Collision.Axes.Y = new namespace.Math.Vector2D(0, 1);
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
            this.displacementAxis = new namespace.Math.Vector2D(0, 0);
        };

        Phys.Collision.Calculation.prototype.getDisplacementVector = function() {
            return this.displacementAxis.scale(this.minIntervalDistance);
        };

        Phys.Collision.SAT = function (first, second, axis, relativeVelocity, calculation) {
            axis = axis.clone().normalize();

            // X axis projection
            var firstData = first.projectOntoAxis(axis);
            var secondData = second.projectOntoAxis(axis);

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

                var d = first.origin.subtract(second.origin.x, second.origin.y);
                if (d.dot(displacementAxis) < 0) {
                    displacementAxis = new namespace.Math.Vector2D(-displacementAxis.x, -displacementAxis.y);
                }

                calculation.displacementAxis = displacementAxis;
            }

            return true;
        };
    }

    if (!Phys.Collision.BoundingCircle) { // intentional truthiness
        Phys.Collision.BoundingCircle = function (origin, radius) {
            this.origin = new namespace.Math.Vector2D(origin.x, origin.y);
            this.radius = radius;
        };

        Phys.Collision.BoundingCircle.prototype.clone = function () {
            return new Phys.Collision.BoundingCircle(this.origin, this.radius);
        };

        Phys.Collision.BoundingCircle.prototype.translate = function(translateX, translateY) {
            this.origin.translateSelf(translateX, translateY);
        };

        /*
            Returns false if no collision will happen, and the necessary displacement vector if a collision has happened (or will happen if the velocity is added);
            the necessary displacement vector can be 0, 0.
        */
        Phys.Collision.BoundingCircle.prototype.collideWithBoundingAABB = function (rect, relativeVelocity) {
            var r = rect.halfVals.diag + this.radius;
            r *= r;
            if (this.origin.distance2(rect.origin) > r) {
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
            var voronoiVertex = new namespace.Math.Vector2D((rect.origin.x > this.origin.x) ? rect.minVals.x : rect.maxVals.x, (rect.origin.y > this.origin.y) ? rect.minVals.y : rect.maxVals.y, false);
            var finalAxis = this.origin.subtract(voronoiVertex.x, voronoiVertex.y).normalize();
            yesOnThisAxis = Phys.Collision.SAT(this, rect, finalAxis, relativeVelocity, calculation);
            if(!yesOnThisAxis) {
                return false;
            }

            var displacementVector = (calculation.willIntersect) ? calculation.getDisplacementVector() : new namespace.Math.Vector2D(0, 0);
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
            var finalAxis = circle.origin.subtract(this.origin.x, this.origin.y).normalize();
            yesOnThisAxis = Phys.Collision.SAT(this, circle, finalAxis, relativeVelocity, calculation);
            if(!yesOnThisAxis) {
                return false;
            }

            var displacementVector = (calculation.willIntersect) ? calculation.getDisplacementVector() : new namespace.Math.Vector2D(0, 0);
            return displacementVector;
        };
        
        /*
            The provided axis should already be normalized.
        */
        Phys.Collision.BoundingCircle.prototype.projectOntoAxis = function (axis) {
            var translated = axis.translate(this.origin.x, this.origin.y);
            var scaledUp = axis.dot(translated.translate(axis.x * this.radius, axis.y * this.radius));
            var scaledDown = axis.dot(translated.translate(axis.x * -this.radius, axis.y * -this.radius));

            return (scaledDown < scaledUp) ? new Phys.Collision.Axes.ProjectionData(scaledDown, scaledUp) : new Phys.Collision.Axes.ProjectionData(scaledUp, scaledDown);
        };
    }

    if (!Phys.Collision.BoundingAABB) { // intentional truthiness
        Phys.Collision.BoundingAABB = function (origin, halfVals) {
            this.minVals = new namespace.Math.Vector2D(origin.x - halfVals.width, origin.y - halfVals.height);
            this.maxVals = new namespace.Math.Vector2D(origin.x + halfVals.width, origin.y + halfVals.height);
            this.halfVals = {
                x: halfVals.width,
                y: halfVals.height,
                diag: this.maxVals.distance(this.minVals) / 2
            };
            this.origin = new namespace.Math.Vector2D(origin.x, origin.y);
        };

        Phys.Collision.BoundingAABB.prototype.clone = function () {
            return new Phys.Collision.BoundingAABB(this.origin, {
                width: this.halfVals.x,
                height: this.halfVals.y
            });
        };

        Phys.Collision.BoundingAABB.prototype.translate = function (translateX, translateY) {
            this.minVals.translateSelf(translateX, translateY);
            this.maxVals.translateSelf(translateX, translateY);
            this.origin.translateSelf(translateX, translateY);
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

            var displacementVector = (calculation.willIntersect) ? calculation.getDisplacementVector() : new namespace.Math.Vector2D(0, 0);
            return displacementVector;
        };

        /*
            Returns false if no collision will happen, and the necessary displacement vector if a collision has happened (or will happen if the velocity is added);
            the necessary displacement vector can be 0, 0.
        */
        Phys.Collision.BoundingAABB.prototype.collideWithBoundingCircle = function (circle, relativeVelocity) {
            var r = this.halfVals.diag + circle.radius;
            r *= r;
            if (circle.origin.distance2(this.origin) > r) {
                return false;
            }

            var calculation = new Phys.Collision.Calculation();

            var yesOnThisAxis = Phys.Collision.SAT(circle, this, Phys.Collision.Axes.X, relativeVelocity, calculation);
            if (!yesOnThisAxis) {
                return false;
            }

            yesOnThisAxis = Phys.Collision.SAT(circle, this, Phys.Collision.Axes.Y, relativeVelocity, calculation);
            if (!yesOnThisAxis) {
                return false;
            }

            // naive voronoi calculation
            // don't check for equals; unnecessary
            var voronoiVertex = new namespace.Math.Vector2D((this.origin.x > circle.origin.x) ? this.minVals.x : this.maxVals.x, (this.origin.y > circle.origin.y) ? this.minVals.y : this.maxVals.y, false);
            var finalAxis = circle.origin.subtract(voronoiVertex.x, voronoiVertex.y).normalize();
            yesOnThisAxis = Phys.Collision.SAT(circle, this, finalAxis, relativeVelocity, calculation);
            if (!yesOnThisAxis) {
                return false;
            }

            var displacementVector = (calculation.willIntersect) ? calculation.getDisplacementVector() : new namespace.Math.Vector2D(0, 0);
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