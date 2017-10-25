# Upgrade guide

## v1 -> v2

Replace all:
`import { TypedWorker } from 'typed-web-workers'`
with
`import { createWorker, ITypedWorker } from 'typed-web-workers'`.

`new TypedWorker`
with
`createWorker`.

We no longer export the TypedWorker class as it could cause patch changes to be breaking changes.