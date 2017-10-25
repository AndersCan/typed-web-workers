"use strict";
exports.__esModule = true;
function createWorker(workerFunction, onMessage) {
    if (onMessage === void 0) { onMessage = function (output) { }; }
    return new TypedWorker(workerFunction, onMessage);
}
exports.createWorker = createWorker;
var TypedWorker = /** @class */ (function () {
    function TypedWorker(workerFunction, onMessage) {
        if (onMessage === void 0) { onMessage = function (output) { }; }
        var _this = this;
        this.workerFunction = workerFunction;
        this.onMessage = onMessage;
        var postMessage = "(" + workerFunction + ").call(this, e.data, postMessage)";
        var workerFile = "self.onmessage=function(e){" + postMessage + "}";
        var blob = new Blob([workerFile], { type: 'application/javascript' });
        this._nativeWorker = new Worker(URL.createObjectURL(blob));
        this._nativeWorker.onmessage = function (messageEvent) {
            _this.onMessage(messageEvent.data);
        };
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
