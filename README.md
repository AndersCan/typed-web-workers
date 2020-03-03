# typed-web-workers
[![npm version](https://img.shields.io/npm/v/typed-web-workers.svg?style=flat)](https://www.npmjs.com/package/typed-web-workers)[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=AndersCan/typed-web-workers)](https://dependabot.com)[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

Library that help you get quickly up and running with web workers in **TypeScript** or **JavaScript** projects.

> ❗️❗️❗️ The `workerFunction` is executed in an **isolated context**. It can not rely on its surrounding context. Use `importScripts` if you need something added to the worker context

# Installation
`npm install typed-web-workers`

# tl;dr
```javascript
import { createWorker } from 'typed-web-workers'

const worker = createWorker({
  workerFunction: ({input, callback}) => callback(input * 2),
  onMessage: result => console.log(`Worker returned: ${result}`),
  onError: error => console.log(`unhandled exception in Worker`)
})
worker.postMessage(1) // Worker returned: 2
worker.postMessage(2) // Worker returned: 4

```
Only `workerFunction` is required by `createWorker`.

## Fiddles
[ESM example](https://jsfiddle.net/anderscan/80y7xLwe/), [IIFE example](https://jsfiddle.net/anderscan/uw51genv/)

## Motivation for Web Workers
- avoid blocking the main thread with long running tasks

When the main thread is blocked, the UI will be unresponsive to user events.

> **Note** Using a web worker does not make a function run [faster](https://youtu.be/7Rrv9qFMWNM?t=1503). 

## Motivation for Typed Web Workers
- a fully typesafe web worker
- quickly created
- all of the benefits of a _native_ web worker


# Usage

## Worker with local state

```javascript
/**
 * Function that will be executed on the Worker
 * */
function workerFunction({
  input,
  callback,
  getState,
  setState
}: WorkerFunctionProps<number, number, number>) {
  const previousValue = getState() || 0
  callback(previousValue + input)
  setState(input)
}

 createWorker({
  workerFunction,
  onMessage: data => console.log(data)
})
```

## Worker with `moment.js` 

```javascript
const momentWorker = createWorker({
  workerFunction: ({input,callback}) => callback(moment(input).format('YYYY')),
  onMessage: data => console.log(data)
  importScripts: [
    'https://unpkg.com/moment@2.22.2/min/moment.min.js'
  ]
})
```

### importScripts
 Use `importScripts` to import external files into your Worker [(mdn docs)](https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/importScripts).

The provided URIs in `importScripts` must link to a JavaScript file that can be loaded by the Worker at runtime. The scripts must be CommonJs/umd as Workers do not support ES modules.

If something goes wrong during the import an exception will be thrown and `onError` will be called. If this happens, you can assume the worker is no longer responsive.

### Using local files
> How you solve this depends on how you build and deploy your project.

You will most likely need to create a new entrypoint bundle that you can import with `importScripts`. For example `importScripts["www.example.com/public/my-script.js"]`.

# Worker Scope
The `workerFunction` that we give our worker can **only** use the data provided from the `input` variable, from its state and from `importScripts`. It does not have access to variables or functions outside its scope.

```javascript
const results = []
function workerFunction({input, callback}) {
  results.push(input.x + input.y) // this would not work
}
```
It will compile, but would not work because the two variables are not in the same context/thread.

```javascript
const results = [] // main context
function workerFunction({input, callback}) {
  results.push(input.x + input.y) // worker context
}
```

# How does this work?
In short, `createWorker`:
1. Converts your `workerFunction` to a string
2. Creates a new _native_ Worker using this string (by using Blob)
3. returns a instance of a `TypedWorker` that acts as a wrapper to the _native_ worker.

Check the source code of `TypedWorker.ts` if you want more information.
