"use strict";
exports.__esModule = true;
function createWorker(_a) {
    var workerFunction = _a.workerFunction, onMessage = _a.onMessage, importScripts = _a.importScripts, onError = _a.onError;
    return new TypedWorker(workerFunction, onMessage, importScripts, onError);
}
exports.createWorker = createWorker;
var TypedWorker = /** @class */ (function () {
    function TypedWorker(workerFunction, onMessage, importScriptsUris, onError) {
        if (onMessage === void 0) { onMessage = function (output) { }; }
        if (importScriptsUris === void 0) { importScriptsUris = []; }
        if (onError === void 0) { onError = function (error) { }; }
        var joinedImportScripts = importScriptsUris
            .map(function (v) { return "'" + v + "'"; })
            .join(',');
        var importScriptsString = "importScripts(" + joinedImportScripts + ")";
        var postMessage = "(" + workerFunction + ").call(this, e.data, postMessage)";
        var workerFile = "\n    " + importScriptsString + ";\n    self.onmessage=function(e){" + postMessage + "};\n    ";
        var blob = new Blob([workerFile], { type: 'application/javascript' });
        this._nativeWorker = new Worker(URL.createObjectURL(blob));
        var handleOnMessage = function (messageEvent) {
            onMessage(messageEvent.data);
        };
        this._nativeWorker.onmessage = handleOnMessage;
        this._nativeWorker.onerror = onError;
    }
    /**
     * Post message to worker for processing
     * @param workerMessage message to send to worker
     */
    TypedWorker.prototype.postMessage = function (workerMessage, transfer) {
        this._nativeWorker.postMessage(workerMessage, transfer);
    };
    TypedWorker.prototype.terminate = function () {
        this._nativeWorker.terminate();
    };
    return TypedWorker;
}());
