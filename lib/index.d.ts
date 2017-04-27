export declare class TypedWorker<In, Out> {
    _worker: Worker;
    onMessage: (result: Out) => void;
    constructor(workerFunction: (input: In) => Out);
    postMessage(toWorkerMessage: In): void;
}
