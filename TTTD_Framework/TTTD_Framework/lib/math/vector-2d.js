(function (namespace, undefined) {
    "use strict";

    if (!Math.Vector2D) { // intentional truthiness
        Math.Vector2D = function (x, y) {
            this.x = new Number(x);
            this.y = new Number(y);
        };

        Math.Vector2D.prototype.toXYObject = function (x, y) {
            return {
                x: (x) ? new Number(this.x + x) : new Number(this.x),
                y: (y) ? new Number(this.y + y) : new Number(this.y)
            };
        };

        Math.Vector2D.prototype.toPerpendicular = function () {
            return new Vector2D(-this.y, this.x);
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

        Math.Vector2D.prototype.magnitude = function () {
            return Math.sqrt(this.dot(this));
        };

        Math.Vector2D.prototype.normalize = function () {
            var mag = this.magnitude();
            if (mag !== 0) {
                this.x = this.x.setAndNotify(this.x / mag);
                this.y = this.y.setAndNotify(this.y / mag);
            }
        };

        Math.Vector2D.prototype.translateSelf = function (other) {
            this.x = this.x.setAndNotify(this.x + other.x);
            this.y = this.y.setAndNotify(this.y + other.y);
            return this;
        };

        Math.Vector2D.prototype.translate = function (other) {
            return new Vector2D(this.x + other.x, this.y + other.y);
        };
    }
}(window.TTTD = window.TTTD || {}));