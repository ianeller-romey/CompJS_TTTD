(function (namespace, undefined) {
    "use strict";

    ////////
    // PhysCompInst
    namespace.Comp = namespace.Comp || {};
    namespace.Comp.Inst = namespace.Comp.Inst || {};
    namespace.Comp.Inst.Physics = function (entity, physCompDefinition) {
        this.instanceId = entity.instanceId;
        this.instanceDefinitionName = entity.instanceDefinitionName;
        this.transformation = entity.transformation;
        this.physical = new namespace.Comp.Inst.Physics.Physical(physCompDefinition, this.transformation);
    };

    namespace.Comp.Inst.Physics.prototype = new namespace.Comp.Inst.Component();

    namespace.Comp.Inst.Physics.prototype.destroy = function (messengerEngine) {
        if (messengerEngine !== null) {
            messengerEngine.unregisterObject(this);
            if (this.physical !== null) {
                messengerEngine.unregisterObject(this.physical);
            }
        }
    };

    namespace.Comp.Inst.Physics.Physical = function (physCompDefinition, transformation) {
        this.physTypeId = physCompDefinition.physTypeId;
        this.collisionTypeId = physCompDefinition.collisionTypeId;
        this.boundingData = physCompDefinition.boundingData.clone();
        this.colliders = [];
        
        this.boundingData.translateSelf(transformation.position.x, transformation.position.y);

        this.update = function () {
            if (transformation.rotationChanged()) {
                this.boundingData.rotateSelf(transformation.getRotationChange());
            }
        };
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
        var gameStateEngine = namespace.Globals.globalGameStateEngine;

        var physTypeDefinitions = [];
        var collisionTypeDefinitions = [];
        var physCompDefinitions = [];
        var physGameStates = {};

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
                if (physType.name === "Circle") {
                    boundingData = new namespace.Engines.PhysEngine.Collision.BoundingCircle(parsed.origin, parsed.radius);
                } else if (physType.name === "AABB") {
                    boundingData = new namespace.Engines.PhysEngine.Collision.BoundingAABB(parsed.origin, parsed.halfValues);
                } else if (physType.name === "OBB") {
                    boundingData = new namespace.Engines.PhysEngine.Collision.BoundingOBB(parsed.origin, {
                        halfVals: parsed.halfValues
                    }, 0);
                }
                physCompDefinitions[x.id] = new Def.Physics(x, boundingData);
            });
        };

        this.init = function () {
            var that = this;
            gameStateEngine.getActivePhysGameStates().forEach(function (gameState) {
                addGameState(gameState);
            });

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
            instance.physical.colliders.push({
                instanceId: otherInstance.instanceId,
                instanceDefinitionName: otherInstance.instanceDefinitionName,
                position: new namespace.Math.Vector2D(otherInstance.transformation.position.x, otherInstance.transformation.position.y)
            });
        };

        this.update = function (delta) {
            delta = delta / 1000; // translate milliseconds to seconds


            var activeGameStates = gameStateEngine.getActivePhysGameStates();
            activeGameStates.forEach(function (gameState) {
                var physGameState = physGameStates[gameState];
                for (var i = 0; i < physGameState.physCompInstances.length; ++i) {
                    var instance = physGameState.physCompInstances[i];
                    instance.physical.colliders = [];

                    instance.physical.update(delta);


                    var collisionTypeDefinition = collisionTypeDefinitions[instance.physical.collisionTypeId];
                    if (collisionTypeDefinition.name !== "Static") {
                        var velocity = (collisionTypeDefinition.name !== "NoGravity") ? instance.transformation.velocity.translate(gravity.x, gravity.y) : instance.transformation.velocity.clone();
                        var bounding = instance.physical.boundingData.clone();

                        var hasNonGhostCollider = false;
                        var displacementAxes = {};
                        var totalDisplacementVector = new namespace.Math.Vector2D(0, 0);
                        for (var j = 0; j < physGameState.physCompInstances.length; ++j) {
                            if (j === i) {
                                continue;
                            }
                            // TODO: Optimize so we don't check the same two instances twice
                            var otherInstance = physGameState.physCompInstances[j];
                            var otherTransformation = otherInstance.transformation;
                            var otherBounding = otherInstance.physical.boundingData;

                            var relativeVelocity = velocity.translate(-otherTransformation.velocity.x, -otherTransformation.velocity.y);
                            relativeVelocity.x *= delta;
                            relativeVelocity.y *= delta;
                            var currentCollisionData;

                            var otherPhysTypeName = physTypeDefinitions[otherInstance.physical.physTypeId].name;
                            if (otherPhysTypeName === "Circle") {
                                currentCollisionData = bounding.collideWithBoundingCircle(otherBounding, relativeVelocity);
                            } else if (otherPhysTypeName === "AABB") {
                                currentCollisionData = bounding.collideWithBoundingAABB(otherBounding, relativeVelocity);
                            } else if (otherPhysTypeName === "OBB") {
                                currentCollisionData = bounding.collideWithBoundingOBB(otherBounding, relativeVelocity);
                            }

                            if (currentCollisionData) { // intentional truthiness
                                if (!hasNonGhostCollider && collisionTypeDefinitions[otherInstance.physical.collisionTypeId].name !== "Ghost") {
                                    hasNonGhostCollider = true;
                                }
                                
                                // if this is a new displacement axis, record it
                                var displacementAxisX = currentCollisionData.displacementAxis.x;
                                var displacementAxisY = currentCollisionData.displacementAxis.y;
                                if (!displacementAxes[displacementAxisX]) { // intentional truthiness
                                    displacementAxes[displacementAxisX] = {};
                                }
                                if (!displacementAxes[displacementAxisX][displacementAxisY]) { // intentional truthiness
                                    displacementAxes[displacementAxisX][displacementAxisY] = new namespace.Math.Vector2D(0, 0);
                                }

                                // if this displacement vector is for an axis we already know of, check if it's bigger;
                                // if so, update the displacement vector
                                var displacementVectorX = currentCollisionData.displacementVector.x;
                                var displacementVectorY = currentCollisionData.displacementVector.y;
                                if (displacementAxisX > 0) {
                                    if (displacementAxes[displacementAxisX][displacementAxisY].x < displacementVectorX) {
                                        displacementAxes[displacementAxisX][displacementAxisY].x = displacementVectorX;
                                    }
                                } else {
                                    if (displacementAxes[displacementAxisX][displacementAxisY].x > displacementVectorX) {
                                        displacementAxes[displacementAxisX][displacementAxisY].x = displacementVectorX;
                                    }
                                }
                                if (displacementAxisY > 0) {
                                    if (displacementAxes[displacementAxisX][displacementAxisY].y < displacementVectorY) {
                                        displacementAxes[displacementAxisX][displacementAxisY].y = displacementVectorY;
                                    }
                                } else {
                                    if (displacementAxes[displacementAxisX][displacementAxisY].y > displacementVectorY) {
                                        displacementAxes[displacementAxisX][displacementAxisY].y = displacementVectorY;
                                    }
                                }

                                addColliders(instance, otherInstance);
                            }
                        }
                        displacementAxes.forOwnProperties(function (xAxis, yAxisObject) {
                            yAxisObject.forOwnProperties(function (yAxis, displacementVector) {
                                totalDisplacementVector.translateSelf(displacementVector.x, displacementVector.y);
                            });
                        });

                        //if (!hasNonGhostCollider || collisionTypeDefinition.name === "Ghost") {
                        var endVector = {
                            x: (velocity.x * delta) + totalDisplacementVector.x,
                            y: (velocity.y * delta) + totalDisplacementVector.y
                        };
                        instance.transformation.translateSelf(endVector.x, endVector.y);
                        instance.physical.boundingData.translateSelf(endVector.x, endVector.y);
                        //}
                    }
                }
            });
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
                messengerEngine.unregisterObject(that);
                resolve();
            });
        };

        var addGameState = function (name) {
            if (!physGameStates[name]) { // intentional truthiness
                physGameStates[name] = new namespace.Engines.PhysEngine.GameState(name);
            }
        };

        var removeGameState = function (name) {
            if (physGameStates[name]) { // intentional truthiness
                while (physGameStates[name].physCompInstances.length > 0) {
                    var physCompInstance = physGameStates[name].physCompInstances.pop();
                    physCompInstance.destroy(messengerEngine);
                }
                physGameStates[name] = null;
            }
        };

        var addPhysicsComponentInstanceToGameState = function (instance, gameState) {
            addGameState(gameState);
            physGameStates[gameState].physCompInstances.push(instance);
        };

        var getPhysicsComponentInstanceByIdAndGameState = function (instanceId, gameState) {
            var inst = physGameStates[gameState].physCompInstances.firstOrNull(function (x) {
                return x.instanceId === instanceId;
            });
            return inst;
        }

        var getPhysicsComponentInstanceById = function (instanceId) {
            var inst = physGameStates.forOwnProperties(function (key, value) {
                var instance = value.physCompInstances.firstOrNull(function (x) {
                    return x.instanceId === instanceId;
                });
                if (instance !== null) {
                    return instance;
                }
            });
            return (inst !== undefined) ? inst : null;
        };

        this.createPhysicsComponentInstance = function (entity, physCompId, gameState) {
            var physCompDefinition = physCompDefinitions[physCompId];
            var instance = new Inst.Physics(entity, physCompDefinition);
            addPhysicsComponentInstanceToGameState(instance, gameState);
        };

        var getPhysicsComponentInstanceForEntityInstance = function (callback, instanceId) {
            var instance = getPhysicsComponentInstanceById(instanceId);
            if (instance !== null) {
                callback(instance);
            }
        };

        this.setInstanceAndBoundingDataPosition = function (instanceId, position) {
            var instance = getPhysicsComponentInstanceById(instanceId);
            if (instance !== null) {
                var translation = position.subtract(instance.transformation.position.x, instance.transformation.position.y);
                instance.transformation.translateSelf(translation.x, translation.y);
                instance.physical.boundingData.translateSelf(translation.x, translation.y);
            }
        };

        this.swapInstanceGameState = function (instanceId, oldGameState, newGameState) {
            var oldPhysGameState = physGameStates[oldGameState];
            var newPhysGameState = physGameStates[newGameState];
            for (var i = 0; i < oldPhysGameState.physCompInstances.length; ++i) {
                if (oldPhysGameState.physCompInstances[i].instanceId === instanceId) {
                    var instance = oldPhysGameState.physCompInstances[i];
                    oldPhysGameState.physCompInstances.splice(i, 1);
                    newPhysGameState.physCompInstances.push(instance);
                    return;
                }
            }
        };

        this.removePhysicsComponentInstanceFromMessage = function (instanceId) {
            physGameStates.forOwnProperties(function (key, value) {
                var physCompInstances = value.physCompInstances;
                for (var i = 0; i < physCompInstances.length; ++i) {
                    if (physCompInstances[i].instanceId === instanceId) {
                        physCompInstances[i].destroy(messengerEngine);
                        physCompInstances.splice(i, 1);
                        return true;
                    }
                }
            });
        };

        var setMouseClickCollider = function (point) {
            var activeGameStates = gameStateEngine.getActivePhysGameStates();
            activeGameStates.forEach(function (gameState) {
                var physGameState = physGameStates[gameState];
                for (var i = 0; i < physGameState.physCompInstances.length; ++i) {
                    var instance = physGameState.physCompInstances[i];
                    var boundingData = instance.physical.boundingData.clone();
                    if (boundingData.collideWithPoint(point)) {
                        instance.physical.colliders.push({
                            instanceId: -1,
                            instanceDefinitionName: "MouseClick",
                            position: point.clone()
                        });
                        // do not return
                        // we want to let everyone know they're colliding
                    }
                }
            });
        };

        var setMouseHeldCollider = function (point) {
            var activeGameStates = gameStateEngine.getActivePhysGameStates();
            activeGameStates.forEach(function (gameState) {
                var physGameState = physGameStates[gameState];
                for (var i = 0; i < physGameState.physCompInstances.length; ++i) {
                    var instance = physGameState.physCompInstances[i];
                    var boundingData = instance.physical.boundingData.clone();
                    if (boundingData.collideWithPoint(point)) {
                        instance.physical.colliders.push({
                            instanceId: -1,
                            instanceDefinitionName: "MouseHeld",
                            position: point.clone()
                        });
                        // do not return
                        // we want to let everyone know they're colliding
                    }
                }
            });
        };
        
        messengerEngine.registerForMessage("setInstanceAndBoundingDataPosition", this, this.setInstanceAndBoundingDataPosition);
        messengerEngine.registerForRequest("getPhysicsComponentInstanceForEntityInstance", this, getPhysicsComponentInstanceForEntityInstance);
        messengerEngine.registerForNotice("setMouseClickCollider", this, setMouseClickCollider);
        messengerEngine.registerForNotice("setMouseHeldCollider", this, setMouseHeldCollider);
    };

    ////////
    // BhvEngine GameState
    namespace.Engines.PhysEngine.GameState = function (name) {
        this.name = name;
        this.physCompInstances = [];
    };
        
    var Phys = namespace.Engines.PhysEngine;
    Phys.Collision = Phys.Collision || {};

    if(!Phys.Collision.Axes) { // intentional truthiness
        Phys.Collision.Axes = {};
        Phys.Collision.Axes.X = new namespace.Math.Vector2D(1, 0, true);
        Phys.Collision.Axes.Y = new namespace.Math.Vector2D(0, 1, true);
        Phys.Collision.Axes.ProjectionData = function (min, max) {
            this.min = (min !== undefined) ? min : Number.MAX_VALUE;
            this.max = (max !== undefined) ? max : -Number.MAX_VALUE;
        };

        Phys.Collision.Axes.ProjectionData.prototype.update = function (value) {
            if (value < this.min) {
                this.min = value;
            }
            if (value > this.max) {
                this.max = value;
            }
        };

        Phys.Collision.Axes.ProjectionData.prototype.projectPointAndUpdate = function (normalizedAxis, normalizedMagnitude, point) {
            var scalarProjection = normalizedAxis.dot(point) / normalizedMagnitude;
            this.update(scalarProjection);
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
            if (intervalDistance <= calculation.minIntervalDistance) {
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

        Phys.Collision.Data = function (calculation) {
            this.displacementAxis = calculation.displacementAxis.clone();
            this.displacementVector = (calculation.willIntersect) ? calculation.displacementAxis.scale(calculation.minIntervalDistance) : new namespace.Math.Vector2D(0, 0);
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

        Phys.Collision.BoundingCircle.prototype.translateSelf = function(translateX, translateY) {
            this.origin.translateSelf(translateX, translateY);
        };

        Phys.Collision.BoundingCircle.prototype.rotateSelf = function () {
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

            return new Phys.Collision.Data(calculation);
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

            return new Phys.Collision.Data(calculation);
        };

        /*
            Returns false if no collision will happen, and the necessary displacement vector if a collision has happened (or will happen if the velocity is added);
            the necessary displacement vector can be 0, 0.
        */
        Phys.Collision.BoundingCircle.prototype.collideWithBoundingOBB = function (obb, relativeVelocity) {
            var r = this.radius + obb.halfDiag;
            r *= r;
            if (obb.origin.distance2(this.origin) > r) {
                return false;
            }

            var calculation = new Phys.Collision.Calculation();

            for (var axis = 0; axis < obb.axes.length; ++axis) {
                var yesOnThisAxis = Phys.Collision.SAT(this, obb, obb.axes[axis], relativeVelocity, calculation);
                if (!yesOnThisAxis) {
                    return false;
                }
            }

            var voronoiVertex;
            var voronoiDistance = Number.MAX_VALUE;
            for (var i = 0; i < obb.vertices.length; ++i) {
                var tempVoronoiDistance = this.origin.distance2(obb.vertices[i]);
                if (tempVoronoiDistance < voronoiDistance) {
                    voronoiVertex = obb.vertices[i];
                    voronoiDistance = tempVoronoiDistance;
                }
            }

            var finalAxis = this.origin.subtract(voronoiVertex.x, voronoiVertex.y).normalize();
            yesOnThisAxis = Phys.Collision.SAT(this, obb, finalAxis, relativeVelocity, calculation);
            if (!yesOnThisAxis) {
                return false;
            }

            return new Phys.Collision.Data(calculation);
        };

        /*
            Simply returns true or false, not a displacement vector.
        */
        Phys.Collision.BoundingCircle.prototype.collideWithPoint = function (point) {
            var r2 = this.radius * this.radius;
            return this.origin.distance2(point) <= r2;
        };
        
        /*
            The provided axis should already be normalized.
        */
        Phys.Collision.BoundingCircle.prototype.projectOntoAxis = function (normalizedAxis) {
            var translated = normalizedAxis.translate(this.origin.x, this.origin.y);
            var scaledUp = normalizedAxis.dot(translated.translate(normalizedAxis.x * this.radius, normalizedAxis.y * this.radius));
            var scaledDown = normalizedAxis.dot(translated.translate(normalizedAxis.x * -this.radius, normalizedAxis.y * -this.radius));

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

        Phys.Collision.BoundingAABB.prototype.translateSelf = function (translateX, translateY) {
            this.minVals.translateSelf(translateX, translateY);
            this.maxVals.translateSelf(translateX, translateY);
            this.origin.translateSelf(translateX, translateY);
        };

        Phys.Collision.BoundingAABB.prototype.rotateSelf = function () {
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
            var voronoiVertex = new namespace.Math.Vector2D((this.origin.x > circle.origin.x) ? this.minVals.x : this.maxVals.x, (this.origin.y > circle.origin.y) ? this.minVals.y : this.maxVals.y, false);
            var finalAxis = circle.origin.subtract(voronoiVertex.x, voronoiVertex.y).normalize();
            yesOnThisAxis = Phys.Collision.SAT(this, circle, finalAxis, relativeVelocity, calculation);
            if (!yesOnThisAxis) {
                return false;
            }

            return new Phys.Collision.Data(calculation);
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

            return new Phys.Collision.Data(calculation);
        };

        /*
            Returns false if no collision will happen, and the necessary displacement vector if a collision has happened (or will happen if the velocity is added);
            the necessary displacement vector can be 0, 0.
        */
        Phys.Collision.BoundingAABB.prototype.collideWithBoundingOBB = function (obb, relativeVelocity) {
            var r = this.halfVals.diag + obb.halfDiag;
            r *= r;
            if (obb.origin.distance2(this.origin) > r) {
                return false;
            }

            var calculation = new Phys.Collision.Calculation();

            var yesOnThisAxis = Phys.Collision.SAT(this, obb, Phys.Collision.Axes.X, relativeVelocity, calculation);
            if (!yesOnThisAxis) {
                return false;
            }

            yesOnThisAxis = Phys.Collision.SAT(this, obb, Phys.Collision.Axes.Y, relativeVelocity, calculation);
            if (!yesOnThisAxis) {
                return false;
            }

            for (var axis = 0; axis < obb.axes.length; ++axis) {
                var yesOnThisAxis = Phys.Collision.SAT(this, obb, obb.axes[axis], relativeVelocity, calculation);
                if (!yesOnThisAxis) {
                    return false;
                }
            }

            return new Phys.Collision.Data(calculation);
        };

        /*
            Simply returns true or false, not a displacement vector.
        */
        Phys.Collision.BoundingAABB.prototype.collideWithPoint = function (point) {
            if (point.x > this.maxVals.x) {
                return false;
            }
            if (point.x < this.minVals.x) {
                return false;
            }
            if (point.y > this.maxVals.y) {
                return false;
            }
            if (point.y < this.minVals.y) {
                return false;
            }
            return true;
        };

        /*
            The provided axis should already be normalized.
        */
        Phys.Collision.BoundingAABB.prototype.projectOntoAxis = function (normalizedAxis) {
            var normalizedMagnitude = normalizedAxis.magnitude();

            var data = new Phys.Collision.Axes.ProjectionData();
            data.projectPointAndUpdate(normalizedAxis, normalizedMagnitude, this.minVals, data);
            data.projectPointAndUpdate(normalizedAxis, normalizedMagnitude, {
                x: this.minVals.x,
                y: this.maxVals.y
            });
            data.projectPointAndUpdate(normalizedAxis, normalizedMagnitude, {
                x: this.maxVals.x,
                y: this.minVals.y
            });
            data.projectPointAndUpdate(normalizedAxis, normalizedMagnitude, this.maxVals);

            return data;
        };
    }

    if (!Phys.Collision.BoundingOBB) { // intentional truthiness
        Phys.Collision.BoundingOBB = function (origin, vals, rotation) {
            this.origin = new namespace.Math.Vector2D(origin.x, origin.y);

            this.rotation = 0;
            this.axes = new Array(2);
            this.vertices = new Array(4);

            var halfVals = vals.halfVals;
            if (halfVals) { // intentional truthiness
                this.vertices[0] = new namespace.Math.Vector2D(this.origin.x - halfVals.width, this.origin.y - halfVals.height);
                this.vertices[1] = new namespace.Math.Vector2D(this.origin.x + halfVals.width, this.origin.y - halfVals.height);
                this.vertices[2] = new namespace.Math.Vector2D(this.origin.x - halfVals.width, this.origin.y + halfVals.height);
                this.vertices[3] = new namespace.Math.Vector2D(this.origin.x + halfVals.width, this.origin.y + halfVals.height);

                this.axes[0] = Phys.Collision.Axes.X.clone();
                this.axes[1] = Phys.Collision.Axes.Y.clone();

                if (rotation) { // intentional truthiness
                    this.rotateSelf(rotation);
                }
            } else {
                var rotatedVals = vals.rotatedVals;
                if (rotatedVals) { // intentional truthiness
                    for (var i = 0; i < rotatedVals.vertices.length; ++i) {
                        this.vertices[i] = rotatedVals.vertices[i].clone();
                    }

                    for (var i = 0; i < rotatedVals.axes.length; ++i) {
                        this.axes[i] = rotatedVals.axes[i].clone();
                    }
                } else {
                    throw "BoundingOBB created without providing valid values.";
                }
            }

            this.rotation = rotation;
            this.halfDiag = this.vertices[3].distance(this.vertices[0]) / 2;
        };

        Phys.Collision.BoundingOBB.prototype.clone = function () {
            return new Phys.Collision.BoundingOBB(this.origin, {
                rotatedVals: {
                    vertices: this.vertices,
                    axes: this.axes
                }
            }, this.rotation);
        };

        Phys.Collision.BoundingOBB.prototype.translateSelf = function (translateX, translateY) {
            this.origin.translateSelf(translateX, translateY);

            for (var i = 0; i < this.vertices.length; ++i) {
                this.vertices[i].translateSelf(translateX, translateY);
            }

            // we don't need to translate our axes
            //this.axes[0].translateSelf(translateX, translateY);
            //this.axes[1].translateSelf(translateX, translateY);
        };

        Phys.Collision.BoundingOBB.prototype.rotateSelf = function (rotation) {
            this.rotation = (this.rotation + rotation) % 360;

            for (var i = 0; i < this.vertices.length; ++i) {
                this.vertices[i].rotateSelf(this.origin.x, this.origin.y, rotation);
            }
            
            for (var i = 0; i < this.axes.length; ++i) {
                this.axes[i].rotateSelf(0, 0, rotation);
            }
        };

        /*
            Returns false if no collision will happen, and the necessary displacement vector if a collision has happened (or will happen if the velocity is added);
            the necessary displacement vector can be 0, 0.
        */
        Phys.Collision.BoundingOBB.prototype.collideWithBoundingCircle = function (circle, relativeVelocity) {
            var r = this.halfDiag + circle.radius;
            r *= r;
            if (circle.origin.distance2(this.origin) > r) {
                return false;
            }

            var calculation = new Phys.Collision.Calculation();

            for (var axis = 0; axis < this.axes.length; ++axis) {
                var yesOnThisAxis = Phys.Collision.SAT(this, circle, this.axes[axis], relativeVelocity, calculation);
                if (!yesOnThisAxis) {
                    return false;
                }
            }

            var voronoiVertex;
            var voronoiDistance = Number.MAX_VALUE;
            for (var i = 0; i < this.vertices.length; ++i) {
                var tempVoronoiDistance = circle.origin.distance2(this.vertices[i]);
                if (tempVoronoiDistance < voronoiDistance) {
                    voronoiVertex = this.vertices[i];
                    voronoiDistance = tempVoronoiDistance;
                }
            }

            var finalAxis = circle.origin.subtract(voronoiVertex.x, voronoiVertex.y).normalize();
            yesOnThisAxis = Phys.Collision.SAT(this, circle, finalAxis, relativeVelocity, calculation);
            if (!yesOnThisAxis) {
                return false;
            }

            return new Phys.Collision.Data(calculation);
        };

        /*
            Returns false if no collision will happen, and the necessary displacement vector if a collision has happened (or will happen if the velocity is added);
            the necessary displacement vector can be 0, 0.
        */
        Phys.Collision.BoundingOBB.prototype.collideWithBoundingAABB = function (aabb, relativeVelocity) {
            var r = this.halfDiag + aabb.halfVals.diag;
            r *= r;
            if (aabb.origin.distance2(this.origin) > r) {
                return false;
            }

            var calculation = new Phys.Collision.Calculation();

            for (var axis = 0; axis < this.axes.length; ++axis) {
                var yesOnThisAxis = Phys.Collision.SAT(this, aabb, this.axes[axis], relativeVelocity, calculation);
                if (!yesOnThisAxis) {
                    return false;
                }
            }

            var yesOnThisAxis = Phys.Collision.SAT(this, aabb, Phys.Collision.Axes.X, relativeVelocity, calculation);
            if (!yesOnThisAxis) {
                return false;
            }

            yesOnThisAxis = Phys.Collision.SAT(this, aabb, Phys.Collision.Axes.Y, relativeVelocity, calculation);
            if (!yesOnThisAxis) {
                return false;
            }

            return new Phys.Collision.Data(calculation);
        };

        /*
            Returns false if no collision will happen, and the necessary displacement vector if a collision has happened (or will happen if the velocity is added);
            the necessary displacement vector can be 0, 0.
        */
        Phys.Collision.BoundingOBB.prototype.collideWithBoundingOBB = function (obb, relativeVelocity) {
            var r = this.halfDiag + obb.halfDiag;
            r *= r;
            if (obb.origin.distance2(this.origin) > r) {
                return false;
            }

            var calculation = new Phys.Collision.Calculation();

            for (var axis = 0; axis < this.axes.length; ++axis) {
                var yesOnThisAxis = Phys.Collision.SAT(this, obb, this.axes[axis], relativeVelocity, calculation);
                if (!yesOnThisAxis) {
                    return false;
                }
            }

            for (var axis = 0; axis < obb.axes.length; ++axis) {
                var yesOnThisAxis = Phys.Collision.SAT(this, obb, obb.axes[axis], relativeVelocity, calculation);
                if (!yesOnThisAxis) {
                    return false;
                }
            }

            return new Phys.Collision.Data(calculation);
        };

        /*
            Simply returns true or false, not a displacement vector.
        */
        Phys.Collision.BoundingOBB.prototype.collideWithPoint = function (point) {
            var rotatedPoint = point.rotate(this.origin.x, this.origin.y, this.rotation);

            if (rotatedPoint.x > this.vertices[3].x) {
                return false;
            }
            if (rotatedPoint.x < this.vertices[0].x) {
                return false;
            }
            if (rotatedPoint.y > this.vertices[3].y) {
                return false;
            }
            if (rotatedPoint.y < this.vertices[0].y) {
                return false;
            }
            return true;
        };

        /*
            The provided axis should already be normalized.
        */
        Phys.Collision.BoundingOBB.prototype.projectOntoAxis = function (normalizedAxis) {
            var normalizedMagnitude = normalizedAxis.magnitude();

            var data = new Phys.Collision.Axes.ProjectionData();
            for (var i = 0; i < this.vertices.length; ++i) {
                data.projectPointAndUpdate(normalizedAxis, normalizedMagnitude, this.vertices[i]);
            }

            return data;
        };
    }
}(window.TTTD = window.TTTD || {}));