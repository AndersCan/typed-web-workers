# Upgrade guide

## v2 -> v3
`createWorker`: now takes named parameters of type `ICreateWorkerProps`.
`workerFunction`: added `getState` and `setState` parmas.
`workerFunction`: now takes named parameters: `{input, callback, getState, setState}`

```javascript
createWorker({
  workerFunction: ({input, callback, getState, setState}) => {...},
  onMessage: output => {...},
  onError: error => {...},
  importScripts: ['https://www.url.to/your/script.js']
})
```
Only `workerFunction` is required in `ICreateWorkerProps`.
`onError` - called when an unhandled exception is thrown
`importScripts` - imports commonjs/umd scripts.

## v1 -> v2

We no longer export the TypedWorker class as it allows end-users to extends the class with their own methods.
This could cause patch changes to be breaking changes for these users.

### Replace all:

`import { TypedWorker } from 'typed-web-workers'`
with
`import { createWorker, ITypedWorker } from 'typed-web-workers'`.

`new TypedWorker`
with
`createWorker`.

Your web-workers `workFn` should return values using the provided `cb` method:
`(input) => input` should be changed to `(input, cb) => cb(input)`

Highly recommended to explicitly type your workers:
`const numberToStringWorker: ITypedWorker<number, string> = ...`
