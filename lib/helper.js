"use strict";
exports.__esModule = true;
/**
 *
 * @param param0
 */
function surroundWithTry(_a) {
    var fun = _a.fun, c = _a.c;
    return "try{" + fun + "}catch(e){(" + c + ").call(this, e, postMessage)}";
}
exports.surroundWithTry = surroundWithTry;
