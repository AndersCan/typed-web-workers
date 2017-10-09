export class CallBackWorker<In, Out>{
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
  public postMessage(workerMessage: In) {
    this._nativeWorker.postMessage(workerMessage)
  }

  public async terminate() {
    this._nativeWorker.terminate();
  }

}

