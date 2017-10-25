export interface ITypedWorker<In, Out> {
    terminate: () => void;
    onMessage: (output: Out) => void;
    postMessage: (workerMessage: In, transfer?: (ArrayBuffer | MessagePort | ImageBitmap)[]) => void;
}
export declare function createWorker<In, Out>(workerFunction: (input: In, cb: (_: Out) => void) => void, onMessage?: (output: Out) => void): ITypedWorker<In, Out>;
