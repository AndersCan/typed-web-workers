export interface ITypedWorker<Input, Output> {
  terminate: () => void
  onMessage: (output: Output) => void
  postMessage: (workerMessage: Input, transfer?: Transferable[]) => void
}

/**
 * Props that will be passed to your worker function
 */
export interface WorkerFunctionProps<Input, Output, State = any> {
  input: Input
  callback: (result: Output, transfer?: Transferable[]) => void
  getState: () => State | undefined
  setState: (newState: State) => void
}

/**
 * Do not use this directly. Prefer importing `createWorker`
 */
export class TypedWorker<Input, Output, State = any>
  implements ITypedWorker<Input, Output> {
  private _nativeWorker: Worker

  constructor(
    workerFunction: (props: WorkerFunctionProps<Input, Output, State>) => void,
    public onMessage = (_: Output) => {},
    importScriptsUris: string[] = [],
    onError = (error: ErrorEvent) => {}
  ) {
    const initialState = `var __state__ = undefined`
    const setState = `function setState(newState){__state__ = newState;}`
    const getState = `function getState(){return __state__;}`
    const importScriptsString = getImportScriptString(importScriptsUris)
    const postMessage = `(${workerFunction}).call(this, {input: e.data, callback: postMessage, getState: getState, setState: setState})`

    const workerFile = `
    ${importScriptsString};
    ${initialState};
    ${setState};
    ${getState};
    self.onmessage=function(e){${postMessage}};
    `
    const blob = new Blob([workerFile], { type: 'application/javascript' })

    this._nativeWorker = new Worker(URL.createObjectURL(blob))

    const handleOnMessage = (messageEvent: MessageEvent) => {
      this.onMessage(messageEvent.data)
    }
    this._nativeWorker.onmessage = handleOnMessage

    this._nativeWorker.onerror = onError
  }
  /**
   * Post message to worker for processing
   * @param workerMessage message to send to worker
   */
  public postMessage(workerMessage: Input, transfer?: Transferable[]): void {
    if (transfer) {
      this._nativeWorker.postMessage(workerMessage, transfer)
    } else {
      this._nativeWorker.postMessage(workerMessage)
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
function getImportScriptString(importScriptsUris: string[]): string {
  const hasImportScripts = importScriptsUris.length !== 0

  if (!hasImportScripts) {
    return ''
  }

  const joinedImportScripts = importScriptsUris.map(v => `'${v}'`).join(',')
  const importScriptsString = `importScripts(${joinedImportScripts})`

  return importScriptsString
}
