export type Transfer = (ArrayBuffer | MessagePort | ImageBitmap)[]

export interface ITypedWorker<In, Out> {
  terminate: () => void
  onMessage: (output: Out) => void
  postMessage: (workerMessage: In, transfer?: Transfer) => void
}

export function createWorker<In, Out>(
  workerFunction: (
    input: In,
    cb: (_: Out, transfer?: Transfer) => void
  ) => void,
  onMessage = (output: Out) => {}
): ITypedWorker<In, Out> {
  return new TypedWorker(workerFunction, onMessage)
}

class TypedWorker<In, Out> implements ITypedWorker<In, Out> {
  private _nativeWorker: Worker

  constructor(
    private readonly workerFunction: (
      input: In,
      cb: (_: Out, transfer?: Transfer) => void
    ) => void,
    public onMessage = (output: Out) => {}
  ) {
    const postMessage = `(${workerFunction}).call(this, e.data, postMessage)`
    const workerFile = `self.onmessage=function(e){${postMessage}}`
    const blob = new Blob([workerFile], { type: 'application/javascript' })

    this._nativeWorker = new Worker(URL.createObjectURL(blob))

    this._nativeWorker.onmessage = (messageEvent: MessageEvent) => {
      this.onMessage(messageEvent.data)
    }
  }
  /**
   * Post message to worker for processing
   * @param workerMessage message to send to worker
   */
  public postMessage(workerMessage: In, transfer?: Transfer): void {
    this._nativeWorker.postMessage(workerMessage, transfer)
  }

  public terminate(): void {
    this._nativeWorker.terminate()
  }
}
