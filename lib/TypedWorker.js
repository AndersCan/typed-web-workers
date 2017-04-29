"use strict";
exports.__esModule = true;
var TypedWorker = (function () {
    function TypedWorker(workerFunction, onMessage) {
        if (onMessage === void 0) { onMessage = function (output) {
            return;
        }; }
        var _this = this;
        this.workerFunction = workerFunction;
        this.onMessage = onMessage;
        var postMessage = "postMessage((" + workerFunction + ").call(this, e.data))";
        var workerFile = "self.onmessage=function(e){" + postMessage + "}";
        var blob = new Blob([workerFile], { type: 'application/javascript' });
        this._worker = new Worker(URL.createObjectURL(blob));
        this._worker.onmessage = function (e) {
            _this.onMessage(e.data);
        };
    }
    /**
     * Post message to worker for processing
     * @param workerMessage message to send to worker
     */
    TypedWorker.prototype.postMessage = function (workerMessage) {
        this._worker.postMessage(workerMessage);
    };
    TypedWorker.prototype.terminate = function () {
        this._worker.terminate();
    };
    return TypedWorker;
}());
exports.TypedWorker = TypedWorker;
