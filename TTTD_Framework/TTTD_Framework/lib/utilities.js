

String.prototype.isNullOrWhitespace = function () {
    return this === null || this.match(/^\s*$/) !== null;
};

String.prototype.isAlphanumeric = function () {
    return this !== null && this.match(/^[a-zA-Z0-9]+$/i) !== null;
}

Object.prototype.forOwnProperties = function (predicate) {
    for (var key in this) {
        if (this.hasOwnProperty(key)) {
            var returned = predicate(key, this[key]);
            if (returned !== undefined) {
                return returned;
            }
        }
    }
};


/****************/
/* Linq-esque behavior */
/****************/
if (!Array.prototype.indexOf) { // intentional truthiness
    Array.prototype.indexOf = function (value) {
        for (var index = 0; 0 < this.length; ++index) {
            if (this[i] === value) {
                return index;
            }
        }
        return -1;
    };
}

Array.prototype.max = function (predicate) {
    var val = null;
    if (this.length) { // intentional truthiness
        val = predicate(this[0]);
        for (var i = 1; i < this.length; ++i) {
            if (predicate(this[i]) > val) {
                val = predicate(this[i]);
            }
        }
    }
    return val;
};

Array.prototype.min = function (predicate) {
    var val = null;
    if (this.length) { // intentional truthiness
        val = predicate(this[0]);
        for (var i = 1; i < this.length; ++i) {
            if (predicate(this[i]) < val) {
                val = predicate(this[i]);
            }
        }
    }
    return val;
};

Array.prototype.addRange = function (range) {
    for (var i = 0, len = range.length; i < len; ++i) {
        this.push(range[i]);
    }
    return this;
};

Array.prototype.any = function (predicate) {
    var contains = false;
    for (var i = 0, len = this.length; i < len; ++i) {
        if (predicate(this[i])) {
            contains = true;
            break;
        }
    }
    return contains;
};

Array.prototype.contains = function (value) {
    return this.any(function (x) {
        return x === value;
    });
};

Array.prototype.firstOrNull = function (predicate) {
    var firstObject = null;
    for (var i = 0, len = this.length; i < len; ++i) {
        if (predicate(this[i])) {
            firstObject = this[i];
            break;
        }
    }
    return firstObject;
};

Array.prototype.select = function (predicate) {
    var selectArray = [];
    for (var i = 0, len = this.length; i < len; ++i) {
        selectArray.push(predicate(this[i]));
    }
    return selectArray;
};

Array.prototype.where = function (predicate) {
    var whereArray = [];
    for (var i = 0, len = this.length; i < len; ++i) {
        if (predicate(this[i])) {
            whereArray.push(this[i]);
        }
    }
    return whereArray;
};

Array.prototype.distinct = function (predicate) {
    var distinctArray = [];
    for (var i = 0, len = this.length; i < len; ++i) {
        if (!distinctArray.contains(this[i])) {
            distinctArray.push(this[i]);
        }
    }
    return distinctArray;
};

Array.prototype.aggregate = function (predicate) {
    var aggregateValue = null;
    if (this.length > 0) {
        var i = 0;
        aggregateValue = this[i];
        for (var len = this.length; i < len; ++i) {
            aggregateValue = predicate(aggregateValue, this[i]);
        }
    }
    return aggregateValue;
};

Array.prototype.first = function () {
    return (this.length) /* intentional truthiness */ ? this[0] : null;
};

Array.prototype.last = function () {
    return (this.length) /* intentional truthiness */ ? this[this.length - 1] : null;
};