export class TypedWorker<In, Out>{
  private _nativeWorker: Worker

  constructor(
    private readonly workerFunction: (input: In) => Out,
    public onMessage = (output: Out) => { }) {
    const postMessage = `postMessage((${workerFunction}).call(this, e.data))`
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
  public postMessage(workerMessage: In, transfer?: (ArrayBuffer | MessagePort | ImageBitmap)[]): void {
    this._nativeWorker.postMessage(workerMessage, transfer)
  }

  public terminate(): void {
    this._nativeWorker.terminate();
  }
}

