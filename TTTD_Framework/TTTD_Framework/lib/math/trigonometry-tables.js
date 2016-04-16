(function (namespace, undefined) {
    "use strict";

    namespace.Math = namespace.Math || {};
    namespace.Math.sinTable = new Array(360);
    namespace.Math.cosTable = new Array(360);

    var oneDegreeInRadians = 0.0174533;
    for (var i = 0; i < 360; ++i) {
        var thetaInRadians = i * oneDegreeInRadians;
        namespace.Math.sinTable[i] = Math.sin(thetaInRadians);
        namespace.Math.cosTable[i] = Math.cos(thetaInRadians);
    }

    namespace.Math.sin = function (value) {
        return namespace.Math.sinTable[value];
    };

    namespace.Math.cos = function (value) {
        return namespace.Math.cosTable[value];
    };

}(window.TTTD = window.TTTD || {}));