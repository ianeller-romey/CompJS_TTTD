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

    namespace.Comp.Inst.Phys.Physics = function (physCompDefinition, transformation) {
        this.physTypeId = physCompDefinition.physTypeId;
        this.collisionTypeId = physCompDefinition.collisionTypeId;
        this.boundingData = physCompDefinition.boundingData;
        this.colliders = [];

        // TODO: Update bounding data when position changes
        //transformation.position.notifyMe();
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
                    var newPosition = {
                        x: transformation.position.x + transformation.velocity.x * delta,
                        y: transformation.position.y + transformation.velocity.y * delta
                    };
                    var newBounding = instance.physics.boundingData.clone();
                    newBounding.setPosition(newPosition);

                    var hasNonGhostCollider = false;
                    for (var j = 0; j < physCompInstances.length; ++j) {
                        if (j === i) {
                            continue;
                        }
                        // TODO: Optimize so we don't check the same two instances twice
                        var otherInstance = physCompInstances[j];
                        var otherBounding = otherInstance.physics.boundingData.clone();
                        otherBounding.setPosition(otherInstance.transformation.position);

                        // TODO: Tidy up math in collision functions, because right now it is bad and duplicated
                        if (physTypeDefinitions[otherInstance.physics.physTypeId] === "Circle") {
                            if (newBounding.collideWithBoundingCircle(otherBounding)) {
                                if (!hasNonGhostCollider && collisionTypeDefinitions[otherInstance.physics.collisionTypeId] !== "Ghost") {
                                    hasNonGhostCollider = true;
                                }
                                addColliders(instance, otherInstance);
                            }
                        } else if (physTypeDefinitions[otherInstance.physics.physTypeId] === "AABB") {
                            if (newBounding.collideWithBoundingAABB(otherBounding)) {
                                if (!hasNonGhostCollider && collisionTypeDefinitions[otherInstance.physics.collisionTypeId] !== "Ghost") {
                                    hasNonGhostCollider = true;
                                }
                                addColliders(instance, otherInstance);
                            }
                        }
                        // TODO: OBB
                    }

                    if (!hasNonGhostCollider || collisionTypeDefinition === "Ghost") {
                        instance.transformation.setPosition(newPosition.x, newPosition.y);
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
        
    var Phy = namespace.Engines.PhysEngine;
    Phy.Collision = Phy.Collision || {};

    if(!Phy.Collision.Axes) { // intentional truthiness
        Phy.Collision.Axes = {};
        Phy.Collision.Axes.X = new Math.Vector2D(1, 0);
        Phy.Collision.Axes.Y = new Math.Vector2D(0, 1);
        Phy.Collision.Axes.intervalDistance = function(data1, data2) {
            return (data1.min < data2.min) ? data2.min - data1.max : data1.min - data2.max;
        };
    }

    if(!Phy.Collision.Data) {
        Phy.Collision.Calculation = function(intersecting, willIntersect, minIntervalDistance, displacementAxis) {
            this.intersecting = intersecting;
            this.willIntersect = willIntersect;
            this.minIntervalDistance = minIntervalDistance;
            this.displacementAxis = displacementAxis;
        };

        Phy.Collision.Data = function(intersecting, willIntersect, displacementVector) {
            this.intersecting = interse;
            this.willIntersect = willIntersect;
            this.displacementVector = displacementVector;
        };

        Phy.Collision.Data.check = function(first, second, axis, relativeVelocity, calculation) {
            // X axis projection
            var firstData = first.projectOntoAxis(axis);
            var secondData = aabb.projectOntoAxis(axis);

            // currently intersecting?
            if(Phy.Collision.Axes.intervalDistance(firstData, secondData) > 0) {
                calculation.intersecting = false;
            }

            // will intersect?
            var velocityProjection = axis.dot(relativeVelocity);
            if(velocityProjection < 0) {
                firstData.min += velocityProjection;
            } else {
                firstData.max += velocityProjection;
            }
            var intervalDistance = Phy.Collision.Axes.intervalDistance(firstData, secondData);
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
                if (d.dot(displacementAxis) < 0)
                    displacementAxis = new Math.Vector2D(-displacementAxis.x, -displacementAxis.y);

                calculation.displacementAxis = displacementAxis;
            }

            return true;
        };
    }

    if (!Phy.Collision.BoundingCircle) { // intentional truthiness
        var BoundingCircle = function (origin, radius) {
            this.origin = new Math.Vector2D(origin.x, origin.y);
            this.radius = radius;
        };

        BoundingCircle.prototype.collideWithBoundingAABB = function (rect) {
            var circlePosition = {
                x: this.position.x + this.origin.x,
                y: this.position.y + this.origin.y
            };
            var rectPosition = {
                x: rect.position.x + rect.origin.x,
                y: rect.position.y + rect.origin.y
            };
            var x1 = rectPosition.x - rect.halfValues.width;
            var y1 = rectPosition.y - rect.halfValues.height;
            var x2 = rectPosition.x + rect.halfValues.width;
            var y2 = rectPosition.y + rect.halfValues.height;
            if (x1 <= circlePosition.x && circlePosition.x <= x2 && y1 <= circlePosition.y && circlePosition.y <= y2) {
                return true;
            }

            var circleDistance = {
                x: Math.abs(circlePosition.x - rectPosition.x),
                y: Math.abs(circlePosition.y - rectPosition.y)
            };
            if (circleDistance.x > (rect.halfValues.width + this.radius)) {
                return false;
            }
            if (circleDistance.y > (rect.halfValues.height + this.radius)) {
                return false;
            }
            if (circleDistance.x <= rect.halfValues.width) {
                return true;
            }
            if (circleDistance.y <= rect.halfValues.height) {
                return true;
            }

            return Math.pow(circleDistance.x - rect.halfValues.width, 2) + Math.pow(circleDistance.y - rect.halfValues.height, 2) <= (this.radius * this.radius);
        };

        BoundingCircle.prototype.collideWithBoundingCircle = function (circle) {
            var r = this.radius + circle.radius;
            r *= r;
            return r < ((this.origin.x + circle.origin.x) ^ 2 + (this.origin.y + circle.origin.y) ^ 2);
        };
    }

    if (!Phy.Collision.BoundingAABB) { // intentional truthiness
        Phy.Collision.BoundingAABB = function (minVals, maxVals) {
            this.minVals = new Math.Vector2D(minVals.x, minVals.y);
            this.maxVals = new Math.Vector2D(maxVals.x, maxVals.y);
            this.halfVals = {
                x: (this.maxVals.x - this.minVals.x) / 2,
                y: (this.maxVals.y - this.minVals.y) / 2,
                diag: this.maxVals.distance(this.minVals)
            };
            this.origin = new Math.Vector2D(this.minVals.x + this.halfVals.x, this.minVals.y + this.halfVals.y);
        };

        Phy.Collision.BoundingAABB.prototype.collideWithBoundingAABB = function (aabb, relativeVelocity) {
            var collision = new Phy.Collision.Data(true, true, {
                x: 0,
                y: 0
            });

            if (this.maxVals.x < aabb.minVals.x || this.minVals.x > aabb.maxVals.x) {
                return false;
            }
            if (this.maxVals.y < aabb.minVals.y || this.minVals.y > aabb.maxVals.y) {
                return false;
            }

            var thisData;
            var aabbData;
            var velocityProjection;
            var intervalDistance = Number.MAX_VALUE;
            var minIntervalDistance = Number.MAX_VALUE;
            var displacementAxis;

            // X axis projection
            thisData = this.projectOntoAxis(Phy.Collision.Axes.X);
            aabbData = aabb.projectOntoAxis(Phy.Collision.Axes.X);

            // currently intersecting?
            if(Phy.Collision.Axes.intervalDistance(thisData, aabbData) > 0) {
                collision.intersecting = false;
            }

            // will intersect?
            velocityProjection = Phy.Collision.Axes.X.dot(relativeVelocity);
            if(velocityProjection < 0) {
                thisData.min += velocityProjection;
            } else {
                thisData.max += velocityProjection;
            }
            intervalDistance = Phy.Collision.Axes.intervalDistance(thisData, aabbData);
            if(intervalDistance > 0) {
                collision.willIntersect = false;
            }
            intervalDistance = Math.abs(intervalDistance);
            if (intervalDistance < minIntervalDistance) {
                minIntervalDistance = intervalDistance;
                displacementAxis = axis;

                var d = this.origin.translate({
                    x: -aabb.origin.x, 
                    y: -aabb.origin.y
                });
                if (d.dot(displacementAxis) < 0)
                    displacementAxis = new Math.Vector2D(-displacementAxis.x, -displacementAxis.y);
            }

            // Y axis projection
            thisData = this.projectOntoAxis(Phy.Collision.Axes.Y);
            aabbData = aabb.projectOntoAxis(Phy.Collision.Axes.Y);

            // currently intersecting?
            if(Phy.Collision.Axes.intervalDistance(thisData, aabbData) > 0) {
                collision.intersecting = false;
            }

            // will intersect?
            var velocityProjection = Phy.Collision.Axes.Y.dot(relativeVelocity);
            if(velocityProjection < 0) {
                thisData.min += velocityProjection;
            } else {
                thisData.max += velocityProjection;
            }
            if(Phy.Collision.Axes.intervalDistance(thisData, aabbData) > 0) {
                collision.willIntersect = false;
            }


            // Do the same test as above for the new projection
            float intervalDistance = IntervalDistance(minA, maxA, minB, maxB);
            if (intervalDistance > 0) result.WillIntersect = false;

            // If the polygons are not intersecting and won't intersect, exit the loop
            if (!result.Intersect && !result.WillIntersect) break;

            // Check if the current interval distance is the minimum one. If so store
            // the interval distance and the current distance.
            // This will be used to calculate the minimum translation vector
            intervalDistance = Math.Abs(intervalDistance);
            if (intervalDistance < minIntervalDistance) {
                minIntervalDistance = intervalDistance;
                translationAxis = axis;

                Vector d = polygonA.Center - polygonB.Center;
                if (d.DotProduct(translationAxis) < 0)
                    translationAxis = -translationAxis;
            }
        }

        // The minimum translation vector
        // can be used to push the polygons appart.
        if (result.WillIntersect)
            result.MinimumTranslationVector = 
                   translationAxis * minIntervalDistance;
    };

    Phy.Collision.BoundingAABB.prototype.collideWithBoundingCircle = function (circle) {
        var outerCircle = new Phy.Collision.BoundingCircle(this.origin, this.halfVals.diag);
        if (!outerCircle.collideWithBoundingCircle(circle)) {
            return false;
        }

        var innerCircle = new Phy.Collision.BoundingCircle(this.origin, (this.halfVals.x > this.halfVals.y) ? this.halfVals.x : this.halfVals.y);
        if (innerCircle.collideWithBoundingCircle(circle)) {
            return true;
        }


    };

    Phy.Collision.BoundingAABB.prototype.projectOntoAxis = function (axis) {
        var dot = axis.dot(this.minVals);
        var data = {
            min: dotProduct,
            max: dotProduct
        };

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
}(window.TTTD = window.TTTD || {}));