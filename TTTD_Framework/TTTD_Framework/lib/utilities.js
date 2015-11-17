

String.prototype.isNullOrWhitespace = function () {
    return this === null || this.match(/^\s*$/) !== null;
};

String.prototype.isAlphanumeric = function () {
    return this !== null && this.match(/^[a-zA-Z0-9]+$/i) !== null;
}


/****************/
/* Linq-esque behavior */
/****************/
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

/****************/
/* Notify on Changed */
/****************/
String.prototype.notifyMe = function (callback) {
    if (this._notifyMe === undefined || this._notifyMe === null) {
        this._notifyMe = [];
    }

    this._notifyMe.push(callback);
};

String.prototype.notifyAll = function () {
    if (this._notifyMe /* intentional truthiness */ && this._notifyMe.length > 0) {
        var that = this.valueOf();
        this._notifyMe.forEach(function (x) {
            x(that);
        });
    }
};

String.prototype.setAndNotify = function (value) {
    if (this.valueOf() === value.valueOf()) {
        return this;
    }
    var newValue = new String(value);
    newValue._notifyMe = this._notifyMe;
    this._notifyMe = null;
    newValue.notifyAll();
    return newValue;
};

Number.prototype.notifyMe = function (callback) {
    if (this._notifyMe === undefined || this._notifyMe === null) {
        this._notifyMe = [];
    }

    this._notifyMe.push(callback);
};

Number.prototype.notifyAll = function () {
    if (this._notifyMe /* intentional truthiness */ && this._notifyMe.length > 0) {
        var that = this.valueOf();
        this._notifyMe.forEach(function (x) {
            x(that);
        });
    }
};

Number.prototype.setAndNotify = function (value) {
    if (this.valueOf() === value.valueOf()) {
        return this;
    }
    var newValue = new Number(value);
    newValue._notifyMe = this._notifyMe;
    this._notifyMe = null;
    newValue.notifyAll();
    return newValue;
};

Boolean.prototype.notifyMe = function (callback) {
    if (this._notifyMe === undefined || this._notifyMe === null) {
        this._notifyMe = [];
    }

    this._notifyMe.push(callback);
};

Boolean.prototype.notifyAll = function () {
    if (this._notifyMe /* intentional truthiness */ && this._notifyMe.length > 0) {
        var that = this.valueOf();
        this._notifyMe.forEach(function (x) {
            x(that);
        });
    }
};

Boolean.prototype.setAndNotify = function (value) {
    if (this.valueOf() === value.valueOf()) {
        return this;
    }
    var newValue = new Boolean(value);
    newValue._notifyMe = this._notifyMe;
    this._notifyMe = null;
    newValue.notifyAll();
    return newValue;
};

Object.prototype.notifyMe = function (callback) {
    if (this._notifyMe === undefined || this._notifyMe === null) {
        this._notifyMe = [];
    }

    this._notifyMe.push(callback);
};

Object.prototype.notifyAll = function () {
    if (this._notifyMe /* intentional truthiness */ && this._notifyMe.length > 0) {
        var that = this.valueOf();
        this._notifyMe.forEach(function (x) {
            x(that);
        });
    }
};

Object.prototype.setAndNotify = function (value) {
    if (this.valueOf() === value.valueOf()) {
        return this;
    }
    var newValue = value;
    newValue._notifyMe = this._notifyMe;
    this._notifyMe = null;
    newValue.notifyAll();
    return newValue;
};

Date.prototype.notifyMe = function (callback) {
    if (this._notifyMe === undefined || this._notifyMe === null) {
        this._notifyMe = [];
    }

    this._notifyMe.push(callback);
};

Date.prototype.notifyAll = function () {
    if (this._notifyMe /* intentional truthiness */ && this._notifyMe.length > 0) {
        var that = this.valueOf();
        this._notifyMe.forEach(function (x) {
            x(that);
        });
    }
};

Date.prototype.setAndNotify = function (value) {
    if (this.valueOf() === value.valueOf()) {
        return this;
    }
    var newValue = new Date(value);
    newValue._notifyMe = this._notifyMe;
    this._notifyMe = null;
    newValue.notifyAll();
    return newValue;
};

Array.prototype.notifyMe = function (callback) {
    if (this._notifyMe === undefined || this._notifyMe === null) {
        this._notifyMe = [];
    }

    this._notifyMe.push(callback);
};

Array.prototype.notifyAll = function () {
    if (this._notifyMe /* intentional truthiness */ && this._notifyMe.length > 0) {
        var that = this.valueOf();
        this._notifyMe.forEach(function (x) {
            x(that);
        });
    }
};

Array.prototype.setAndNotify = function (value) {
    if (this.valueOf() === value.valueOf()) {
        return this;
    }
    var newValue = value;
    newValue._notifyMe = this._notifyMe;
    this._notifyMe = null;
    newValue.notifyAll();
    return newValue;
};

Function.prototype.notifyMe = function (callback) {
    if (this._notifyMe === undefined || this._notifyMe === null) {
        this._notifyMe = [];
    }

    this._notifyMe.push(callback);
};

Function.prototype.notifyAll = function () {
    if (this._notifyMe /* intentional truthiness */ && this._notifyMe.length > 0) {
        var that = this.valueOf();
        this._notifyMe.forEach(function (x) {
            x(that);
        });
    }
};

Function.prototype.setAndNotify = function (value) {
    if (this.valueOf() === value.valueOf()) {
        return this;
    }
    var newValue = value;
    newValue._notifyMe = this._notifyMe;
    this._notifyMe = null;
    newValue.notifyAll();
    return newValue;
};