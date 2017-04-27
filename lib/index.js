"use strict";
exports.__esModule = true;
var TypedWorker = (function () {
    function TypedWorker(workerFunction) {
        var _this = this;
        this.onMessage = function (result) {
            return;
        };
        var workerFile = "self.onmessage=function(e){postMessage((" + workerFunction + ").call(this, e.data))}";
        var blob = new Blob([workerFile], { type: 'application/javascript' });
        this._worker = new Worker(URL.createObjectURL(blob));
        this._worker.onmessage = function (e) {
            _this.onMessage(e.data);
        };
    }
    TypedWorker.prototype.postMessage = function (toWorkerMessage) {
        this._worker.postMessage(toWorkerMessage);
    };
    return TypedWorker;
}());
exports.TypedWorker = TypedWorker;
