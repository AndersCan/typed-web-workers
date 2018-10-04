# typed-web-workers
[![Build Status](https://travis-ci.org/AndersCan/typed-web-workers.svg?branch=master)](https://travis-ci.org/AndersCan/typed-web-workers)[![codecov](https://codecov.io/gh/AndersCan/typed-web-workers/branch/master/graph/badge.svg)](https://codecov.io/gh/AndersCan/typed-web-workers)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

Library that help you get quickly up and running with web workers in either **TypeScript** or **JavaScript** projects.

> ❗️❗️❗️ The `workerFunction` is executed in an **isolated context**. In can not rely on its surrounding context. Use `importScripts` if you need something added to the worker context

# Installation
`npm i typed-web-workers -S`

or

`yarn add typed-web-workers`

# tl;dr

```javascript
import { createWorker } from 'typed-web-workers'

const worker = createWorker({
  workerFunction: (input, callback) => callback(input * 2)),
  onMessage: result => console.log(`Worker returned: ${result}`),
  onError: error => console.log(`unhandled exception in Worker`)
  importScripts: ['www.unpkg.com/moment@2.22.2/min/moment.min.js']
})
worker.postMessage(1)
worker.postMessage(2)
// log: Worker returned: 2
// log: Worker returned: 4
```
Only `workerFunction` is required by `createWorker`

## Motivation for Web Workers
- avoid blocking the main thread with long running tasks

When the main thread is blocked, the UI will be unresponsive to user events.

> **Note** Using a web worker does not make a function run _faster_.

## Motivation for Typed Web Workers
- a fully typesafe web worker
- quickly created
- all of the benefits of a _native_ web worker


# How does it work?
In short, `createWorker`:
1. Converts your `workerFunction` to a string
2. Creates a new _native_ Worker using this string (by using Blob)
3. returns a instance of a `TypedWorker` that acts as a wrapper to the _native_ worker.

Check the source code of `TypedWorker.ts` if you want more information.

# Usage
We first need to import `createWorker` into our file. (Optionally you can also include the worker interface `ITypedWorker`)

`import { createWorker } from 'typed-web-workers'`

Side-note: Some people dislike prefixing TS interfaces with an `I`. I Have opted to use it as it makes it explicit that this is an interface and not a class.

## Define the input
```javascript
interface MyInput {
  x: number
  y: number
}
```
## Define the workerFunction
```javascript
const workerFunction = (input: MyInput, callback: (_: number) => void)) => {
  callback(input.x + input.y)
}
```
## Define what should happen when we receive a message
```javascript
const onMessage = (result: number)=> {
  console.log(`We received this response from the worker: ${result}`)
}

// Lets put this all together and create our TypedWebWorker.
const typedWorker: ITypedWorker<MyInput, number> = createWorker({
  workerFunction,
  onMessage
})

// Thats it! The Worker is now ready to process messages of type 'Values'
// and log the results to the console.
typedWorker.postMessage({ x: 5, y: 5 }) // logs: "10"
typedWorker.postMessage({ x: 0, y: 0 }) // logs: "0"

// You will get a compilation error if you try sending something other than a
// `MyInput` object.
typedWorker.postMessage({ x: 5, y: 5, z: 5}) // this line will not compile
typedWorker.postMessage("{ x: 5, y: 5}") // this line will not compile

```

We could also write this example *much* shorter and still have the exact same type safety.

```javascript
const typedWorker: ITypedWorker<MyInput, number> = createWorker({
  workerFunction: (input, cb) => cb(input.x + input.y),
  onMessage: (result) => console.log(result)
})
```

Also, if we do not want to log the result, we can just ommit `onMessage` as it is optional

# Worker Scope
The `workerFunction` that we give our worker can **only** use the data provided from the `input` variable.
It does not have access to any state, variables or functions (except those from `importScripts`).

```javascript
const results = []
function workerFunction(input: Values, cb) {
  results.push(input.x + input.y) // this would not work
}
```
The reason why this would not work is because the two variables are not in the same context/thread.

```javascript
const results = [] // main context
function workFn(input: Values): number {
  results.push(input.x + input.y) // Worker context
}
```

If you wish to add the results to an array, do it in the `onMessage` function.
```javascript
const results = []
const typedWorker = createWorker(
  (input: MyInput, cb) => cb(input.x + input.y),
  (result) => results.push(results)
)
```

## import external scripts with `importScripts`
 Use `importScripts` with great care and **avoid** it if you can. (mdn docs)[https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/importScripts].

### Example
If you want to use `moment` in your worker:

```javascript
declare const moment: Moment // declare it here so we can use it in the workerFunction
const momentWorker = createWorker({
  workerFunction: (input,cb) => moment(input).format('YYYY'),
  importScripts: [
    'https://unpkg.com/moment@2.22.2/min/moment.min.js'
  ]
})
```
The provided URIs in `importScripts` must link to a JavaScript file that can be loaded by the Worker at runtime. The scripts must be CommonJs/umd as Workers do not support ES modules.

If something goes wrong during the import an exception will be thrown and `onError` will be called. If this happens, you can assume the worker is no longer responsive.

### Using local files
> How you solve this depends on how you build and deploy your project
> It is most likely a hassle to setup
> I would try to avoid it if possible

You must edit your build config if you wish to import local files. You will need to publish your script to a URL that your Worker can access. For example "www.mypage.com/public/my-script.js".

In WebPack you will have to create a new EntryPoint that compiles your script into a CommonJs/UMD file.