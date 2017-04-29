export class TypedWorker<In, Out>{
  private _worker: Worker

  constructor(
    private readonly workerFunction: (input: In) => Out,
    public onMessage = (output: Out) => {
      return;
    }) {
    const postMessage = `postMessage((${workerFunction}).call(this, e.data))`
    const workerFile = `self.onmessage=function(e){${postMessage}}`;
    const blob = new Blob([workerFile], { type: 'application/javascript' });
    this._worker = new Worker(URL.createObjectURL(blob));

    this._worker.onmessage = (e: MessageEvent) => {
      this.onMessage(e.data)
    }

  }
  /**
   * Post message to worker for processing
   * @param workerMessage message to send to worker
   */
  public postMessage(workerMessage: In): void {
    this._worker.postMessage(workerMessage)
  }

  public terminate(): void {
    this._worker.terminate();
  }
}

