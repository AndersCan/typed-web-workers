import { WorkerFunctionProps, TypedWorker, ITypedWorker } from './typed-worker'

export interface ICreateWorkerProps<Input, Output, State = any> {
  workerFunction: (props: WorkerFunctionProps<Input, Output, State>) => void
  onMessage?: (output: Output) => void
  onError?: (error: ErrorEvent) => void
  importScripts?: string[]
}

export function createWorker<Input, Output, State = any>(
  props: ICreateWorkerProps<Input, Output, State>
): ITypedWorker<Input, Output> {
  return new TypedWorker(
    props.workerFunction,
    props.onMessage,
    props.importScripts,
    props.onError
  )
}
