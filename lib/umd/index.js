(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./TypedWorker"], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var TypedWorker_1 = require("./TypedWorker");
    exports.createWorker = TypedWorker_1.createWorker;
});
