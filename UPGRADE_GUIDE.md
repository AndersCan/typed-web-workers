# Upgrade guide

## v1 -> v2

We no longer export the TypedWorker class as it allowes end-users to extends the class with their own methods.
This could cause patch changes to be breaking changes for these users.

### Replace all:

`import { TypedWorker } from 'typed-web-workers'`
with
`import { createWorker, ITypedWorker } from 'typed-web-workers'`.

`new TypedWorker`
with
`createWorker`.

Your web-workers `workFn` should return values using a the provided `cb` method:
`(input) => input` should be changed to `(input, cb) => cb(input)`

Highly recommended to explicitly type your workers:
`const numberToStringWorker: ITypedWorker<number, string> = ...`
