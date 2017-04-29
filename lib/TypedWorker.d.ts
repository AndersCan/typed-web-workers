export declare class TypedWorker<In, Out> {
    private readonly workerFunction;
    onMessage: (output: Out) => void;
    private _worker;
    constructor(workerFunction: (input: In) => Out, onMessage?: (output: Out) => void);
    /**
     * Post message to worker for processing
     * @param workerMessage message to send to worker
     */
    postMessage(workerMessage: In): void;
    terminate(): void;
}
