/**
 * @deprecated TypeScript now contains Transferable
 */
export type Transfer = Transferable[]

export interface ITypedWorker<In, Out> {
  terminate: () => void
  onMessage: (output: Out) => void
  postMessage: (
    workerMessage: In,
    transfer?: Transferable[]
  ) => void
}

export type WorkerFunction<
  In,
  Out,
  State = any
> = (
  input: In,
  cb: (
    _: Out,
    transfer?: Transferable[]
  ) => void,
  getState?: () => State,
  setState?: (newState: State) => State
) => void

export interface ICreateWorkerProps<
  In,
  Out,
  State = any
> {
  workerFunction: WorkerFunction<
    In,
    Out,
    State
  >
  onMessage?: (output: Out) => void
  onError?: (error: ErrorEvent) => void
  importScripts?: string[]
}

export function createWorker<In, Out>(
  props: ICreateWorkerProps<In, Out>
): ITypedWorker<In, Out> {
  return new TypedWorker(
    props.workerFunction,
    props.onMessage,
    props.importScripts,
    props.onError
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
    public onMessage = (_: Out) => {},
    importScriptsUris: string[] = [],
    onError = (error: ErrorEvent) => {}
  ) {
    const initialState = `var __state__ = undefined`
    const setState = `function setState(newState){__state__ = newState;}`
    const getState = `function getState(){return __state__;}`
    const importScriptsString = getImportScriptString(
      importScriptsUris
    )
    const postMessage = `(${workerFunction}).call(this, e.data, postMessage, getState, setState)`

    const workerFile = `
    ${importScriptsString};
    ${initialState};
    ${setState};
    ${getState};
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
      this.onMessage(messageEvent.data)
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
    transfer?: Transferable[]
  ): void {
    if (transfer) {
      this._nativeWorker.postMessage(
        workerMessage,
        transfer
      )
    } else {
      this._nativeWorker.postMessage(
        workerMessage
      )
    }
  }

  public terminate(): void {
    this._nativeWorker.terminate()
  }
}

/**
 * Creates a `importScripts[...]` string
 * @param importScriptsUris array of URI of scripts to import
 */
function getImportScriptString(
  importScriptsUris: string[]
): string {
  const hasImportScripts =
    importScriptsUris.length !== 0

  if (!hasImportScripts) {
    return ''
  }

  const joinedImportScripts = importScriptsUris
    .map(v => `'${v}'`)
    .join(',')
  const importScriptsString = `importScripts(${joinedImportScripts})`

  return importScriptsString
}
