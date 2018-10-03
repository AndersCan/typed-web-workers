export declare type Transfer = Array<ArrayBuffer | MessagePort | ImageBitmap>;
export interface ITypedWorker<In, Out> {
    terminate: () => void;
    postMessage: (workerMessage: In, transfer?: Transfer) => void;
}
export declare type WorkerFunction<In, Out> = (input: In, cb: (_: Out, transfer?: Transfer) => void) => void;
export interface ICreateWorkerProps<In, Out> {
    workerFunction: WorkerFunction<In, Out>;
    onMessage?: (output: Out) => void;
    onError?: (error: ErrorEvent) => void;
    importScripts?: string[];
}
export declare function createWorker<In, Out>({ workerFunction, onMessage, importScripts, onError }: ICreateWorkerProps<In, Out>): ITypedWorker<In, Out>;
