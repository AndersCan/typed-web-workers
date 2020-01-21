import {
  WorkerProps,
  TypedWorker
} from './typed-worker'
import { ITypedWorker } from '.'

/**
 * @deprecated TypeScript now contains Transferable
 */
export type Transfer = Transferable[]

export interface ICreateWorkerProps<
  In,
  Out,
  State = any
> {
  workerFunction: (
    props: WorkerProps<In, Out, State>
  ) => void
  onMessage?: (output: Out) => void
  onError?: (error: ErrorEvent) => void
  importScripts?: string[]
}

export function createWorker<
  In,
  Out,
  State = any
>(
  props: ICreateWorkerProps<
    In,
    Out,
    State
  >
): ITypedWorker<In, Out> {
  return new TypedWorker(
    props.workerFunction,
    props.onMessage,
    props.importScripts,
    props.onError
  )
}
