export type Transfer = Array<
  | ArrayBuffer
  | MessagePort
  | ImageBitmap
>

export interface ITypedWorker<In, Out> {
  terminate: () => void
  postMessage: (
    workerMessage: In,
    transfer?: Transfer
  ) => void
}

export type WorkerFunction<In, Out> = (
  input: In,
  cb: (
    _: Out,
    transfer?: Transfer
  ) => void
) => void

export interface ICreateWorkerProps<
  In,
  Out
> {
  workerFunction: WorkerFunction<
    In,
    Out
  >
  onMessage?: (output: Out) => void
  onError?: (error: ErrorEvent) => void
  importScripts?: string[]
}

export function createWorker<In, Out>({
  workerFunction,
  onMessage,
  importScripts,
  onError
}: ICreateWorkerProps<
  In,
  Out
>): ITypedWorker<In, Out> {
  return new TypedWorker(
    workerFunction,
    onMessage,
    importScripts,
    onError
  )
}

class TypedWorker<In, Out>
  implements ITypedWorker<In, Out> {
  private _nativeWorker: Worker

  constructor(
    workerFunction: WorkerFunction<
      In,
      Out
    >,
    onMessage = (output: Out) => {},
    importScriptsUris: string[] = [],
    onError = (error: ErrorEvent) => {}
  ) {
    const joinedImportScripts = importScriptsUris
      .map(v => `'${v}'`)
      .join(',')
    const importScriptsString = `importScripts(${joinedImportScripts})`
    const postMessage = `(${workerFunction}).call(this, e.data, postMessage)`
    const workerFile = `
    ${importScriptsString};
    self.onmessage=function(e){${postMessage}};
    `
    const blob = new Blob(
      [workerFile],
      { type: 'application/javascript' }
    )

    this._nativeWorker = new Worker(
      URL.createObjectURL(blob)
    )

    const handleOnMessage = (
      messageEvent: MessageEvent
    ) => {
      onMessage(messageEvent.data)
    }
    this._nativeWorker.onmessage = handleOnMessage

    this._nativeWorker.onerror = onError
  }
  /**
   * Post message to worker for processing
   * @param workerMessage message to send to worker
   */
  public postMessage(
    workerMessage: In,
    transfer?: Transfer
  ): void {
    this._nativeWorker.postMessage(
      workerMessage,
      transfer
    )
  }

  public terminate(): void {
    this._nativeWorker.terminate()
  }
}
