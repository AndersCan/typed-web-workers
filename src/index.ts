export class TypedWorker<In, Out>{
  _worker: Worker
  onMessage = (result: Out) => {
    return;
  }

  constructor(workerFunction: (input: In) => Out) {
    const workerFile =
      `self.onmessage = function(e) { \
        postMessage( \
          (${workerFunction}).call(this, e.data) \
        )  \
      } \
      `;
    const blob = new Blob([workerFile], { type: 'application/javascript' });
    this._worker = new Worker(URL.createObjectURL(blob));

    this._worker.onmessage = (e: MessageEvent) => {
      this.onMessage(e.data)
    }

  }

  postMessage(toWorkerMessage: In) {
    this._worker.postMessage(toWorkerMessage)
  }
}

