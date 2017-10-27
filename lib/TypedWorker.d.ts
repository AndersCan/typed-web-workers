export declare type Transfer = (ArrayBuffer | MessagePort | ImageBitmap)[];
export interface ITypedWorker<In, Out> {
    terminate: () => void;
    onMessage: (output: Out) => void;
    postMessage: (workerMessage: In, transfer?: Transfer) => void;
}
export declare function createWorker<In, Out>(workerFunction: (input: In, cb: (_: Out, transfer?: Transfer) => void) => void, onMessage?: (output: Out) => void): ITypedWorker<In, Out>;
