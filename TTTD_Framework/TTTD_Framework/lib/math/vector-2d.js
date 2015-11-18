(function (namespace, undefined) {
    "use strict";

    if (!Math.Vector2D) { // intentional truthiness
        Math.Vector2D = function (x, y, normalized) {
            this.x = new Number(x);
            this.y = new Number(y);
            // normalized can be true, false, or null (unknown)
            this.normalized = (normalized !== undefined) ? normalized : this.checkNormalized();
        };

        Math.Vector2D.prototype.valueOf = function () {
            return this;
        };

        Math.Vector2D.prototype.checkNormalized = function() {
            this.normalized = (this.magnitude2() === 1);
            return this.normalized;
        };

        Math.Vector2D.prototype.toXYObject = function (x, y) {
            return {
                x: (x) ? new Number(this.x + x) : new Number(this.x),
                y: (y) ? new Number(this.y + y) : new Number(this.y)
            };
        };

        Math.Vector2D.prototype.clone = function () {
            return new Math.Vector2D(this.x, this.y, this.normalized);
        };

        Math.Vector2D.prototype.toPerpendicular = function () {
            return new Math.Vector2D(-this.y, this.x);
        };

        Math.Vector2D.prototype.distance2 = function (other) {
            var xDist = this.x - other.x;
            var yDist = this.y - other.y;
            return (xDist * xDist) + (yDist * yDist);
        };

        Math.Vector2D.prototype.distance = function (other) {
            return Math.sqrt(this.distance2(other));
        };

        Math.Vector2D.prototype.dot = function (other) {
            return (this.x * other.x) + (this.y * other.y);
        };

        Math.Vector2D.prototype.magnitude2 = function () {
            return this.dot(this);
        };

        Math.Vector2D.prototype.magnitude = function () {
            return Math.sqrt(this.dot(this));
        };

        Math.Vector2D.prototype.normalize = function () {
            if (!this.normalized) { // normalized can be false, or null (unknown)
                var mag = this.magnitude();
                if (mag !== 0) {
                    this.x = this.x / mag;
                    this.y = this.y / mag;
                    this.normalized = true;
                    this.notifyAll();
                }
            }
        };

        Math.Vector2D.prototype.translateSelf = function (otherX, otherY) {
            this.x = this.x + otherX;
            this.y = this.y + otherY;
            this.normalized = null;
            this.notifyAll();
            return this;
        };

        Math.Vector2D.prototype.translate = function (otherX, otherY) {
            return new Math.Vector2D(this.x + otherX, this.y + otherT);
        };

        Math.Vector2D.prototype.scaleSelf = function (scalar) {
            this.x = this.x * scalar;
            this.y = this.y * scalar;
            this.normalized = null;
            this.notifyAll();
            return this;
        };

        Math.Vector2D.prototype.scale = function (scalar) {
            return new Math.Vector2D(this.x * scalar, this.y * scalar);
        };
    }
}(window.TTTD = window.TTTD || {}));