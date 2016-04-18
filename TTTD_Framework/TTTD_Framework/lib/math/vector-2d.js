(function (namespace, undefined) {
    "use strict";

    namespace.Math = namespace.Math || {};
    namespace.Math.Vector2D = function (x, y, normalized) {
        this.x = x;
        this.y = y;
        // normalized can be true, false, or null (unknown)
        this.normalized = (normalized !== undefined && normalized !== null) ? normalized : this.checkNormalized();
    };

    namespace.Math.Vector2D.prototype.equalsVector = function (vector) {
        return this.x === vector.x && this.y === vector.y;
    };

    namespace.Math.Vector2D.prototype.valueOf = function () {
        return this;
    };

    namespace.Math.Vector2D.prototype.checkNormalized = function () {
        if (this.normalized === undefined || this.normalized === null) {
            this.normalized = (this.magnitude2() === 1);
        }
        return this.normalized;
    };

    namespace.Math.Vector2D.prototype.toXYObject = function (x, y) {
        return {
            x: (x) ? this.x + x : this.x,
            y: (y) ? this.y + y : this.y
        };
    };

    namespace.Math.Vector2D.prototype.clone = function () {
        return new namespace.Math.Vector2D(this.x, this.y, this.normalized);
    };

    namespace.Math.Vector2D.prototype.toPerpendicular = function () {
        return new namespace.Math.Vector2D(-this.y, this.x);
    };

    namespace.Math.Vector2D.prototype.distance2 = function (other) {
        var xDist = this.x - other.x;
        var yDist = this.y - other.y;
        return (xDist * xDist) + (yDist * yDist);
    };

    namespace.Math.Vector2D.prototype.distance = function (other) {
        return Math.sqrt(this.distance2(other));
    };

    namespace.Math.Vector2D.prototype.dot = function (other) {
        return (this.x * other.x) + (this.y * other.y);
    };

    namespace.Math.Vector2D.prototype.magnitude2 = function () {
        return this.dot(this);
    };

    namespace.Math.Vector2D.prototype.magnitude = function () {
        return Math.sqrt(this.dot(this));
    };

    namespace.Math.Vector2D.prototype.normalize = function () {
        if (!this.normalized) { // normalized can be false, or null (unknown)
            var mag = this.magnitude();
            if (mag !== 0) {
                this.x = this.x / mag;
                this.y = this.y / mag;
                this.normalized = true;
            }
        }
        return this;
    };

    namespace.Math.Vector2D.prototype.subtract = function (otherX, otherY) {
        return new namespace.Math.Vector2D(this.x - otherX, this.y - otherY);
    };

    namespace.Math.Vector2D.prototype.translateSelf = function (otherX, otherY) {
        this.x = this.x + otherX;
        this.y = this.y + otherY;
        this.normalized = null;
        return this;
    };

    namespace.Math.Vector2D.prototype.translate = function (otherX, otherY) {
        return new namespace.Math.Vector2D(this.x + otherX, this.y + otherY);
    };

    namespace.Math.Vector2D.prototype.rotateSelf = function (originX, originY, theta) {
        var translated = this.subtract(originX, originY);
        var rotated = new namespace.Math.Vector2D(translated.x * namespace.Math.cos(theta) - translated.y * namespace.Math.sin(theta), translated.x * namespace.Math.sin(theta) + translated.y * namespace.Math.cos(theta));
        this.x = rotated.x + originX;
        this.y = rotated.y + originY;
    };

    namespace.Math.Vector2D.prototype.rotate = function (originX, originY, theta) {
        var translated = this.subtract(originX, originY);
        var rotated = new namespace.Math.Vector2D(translated.x * namespace.Math.cos(theta) - translated.y * namespace.Math.sin(theta), translated.x * namespace.Math.sin(theta) + translated.y * namespace.Math.cos(theta));
        return rotated.translate(originX, originY);
    };

    namespace.Math.Vector2D.prototype.scaleSelf = function (scalar) {
        this.x = this.x * scalar;
        this.y = this.y * scalar;
        this.normalized = null;
        return this;
    };

    namespace.Math.Vector2D.prototype.scale = function (scalar) {
        return new namespace.Math.Vector2D(this.x * scalar, this.y * scalar);
    };

}(window.TTTD = window.TTTD || {}));