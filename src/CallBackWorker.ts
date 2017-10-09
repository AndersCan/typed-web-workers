export interface ITypedWorker<In, Out> {
  terminate: () => void
  onMessage: (output: Out) => void
  postMessage: (workerMessage: In, transfer?: (ArrayBuffer | MessagePort | ImageBitmap)[]) => void
}

export function createWorker<In, Out>(
  workerFunction: (input: In, cb: (_: Out) => void) => void,
  onMessage = (output: Out) => { }
): ITypedWorker<In, Out> {
  return new CallBackWorker(workerFunction, onMessage)
}

class CallBackWorker<In, Out> implements ITypedWorker<In, Out> {
  private _nativeWorker: Worker

  constructor(
    private readonly workerFunction: (input: In, cb: (_: Out) => void) => void,
    public onMessage = (output: Out) => { }
  ) {
    const postMessage = `(${workerFunction}).call(this, e.data, postMessage)`
    const workerFile = `self.onmessage=function(e){${postMessage}}`;
    const blob = new Blob([workerFile], { type: 'application/javascript' });

    this._nativeWorker = new Worker(URL.createObjectURL(blob));

    this._nativeWorker.onmessage = (messageEvent: MessageEvent) => {
      this.onMessage(messageEvent.data)
    }

  }
  /**
   * Post message to worker for processing
   * @param workerMessage message to send to worker
   */
  public postMessage(workerMessage: In, transfer?: (ArrayBuffer | MessagePort | ImageBitmap)[]) {
    this._nativeWorker.postMessage(workerMessage, transfer)
  }

  public terminate() {
    this._nativeWorker.terminate();
  }

}

