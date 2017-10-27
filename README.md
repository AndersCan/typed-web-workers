# typed-web-workers
[![Build Status](https://travis-ci.org/AndersCan/typed-web-workers.svg?branch=master)](https://travis-ci.org/AndersCan/typed-web-workers)[![codecov](https://codecov.io/gh/AndersCan/typed-web-workers/branch/master/graph/badge.svg)](https://codecov.io/gh/AndersCan/typed-web-workers)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

Library that help you get quickly up and running with web workers in either TypeScript or JavaScript projects.

# Installation
`npm i typed-web-workers -S`

or

`yarn add typed-web-workers`

# Motivation
We want TypeScript to catch as many errors as possible during compilation. We also want to have code completion so we can be more effective. To solve these issues when working with native web workers, we have created a `TypedWorker`.

# How does it work?
Simply put, a TypedWorker is a wrapper for using a normal web worker. The benefit of using this wrapper is that it gives us typed inputs and outputs. Lets look at a small example to help illustrate this.

## Import
We first need to import a `createWorker` into our file. (Optionally you can also include the worker interface `ITypedWorker`)

`import { createWorker, ITypedWorker } from 'typed-web-workers'`

Side-note: Some people dislike prefixing TS interfaces with an `I`. I Have opted to use it as it makes it explicit that this is an interface and not a class.

## Sum of two numbers
```javascript
// Let us first define the `input` type for our Worker.
// In our simple example we are going to create a 'Values' interface.
interface Values {
  x: number
  y: number
}
// Now we need to define the function that the worker will perform when it
// receives a message of type `Values`.
// We would expect it to look something like this
function workFn(input: Values): number {
  return input.x + input.y
}

// However, as there are many use cases for when we would like to return
// multiple results from a single input or return results asynchronous.
// We have to modify our `workFn`.
// We will, basically, replace `return` with a function call.
function workFn(input: Values, callback: (_: number) => void)): void {
  callback(input.x + input.y)
}


// Now that our worker has calculated the sum of x and y, we should to do
// something with. Lets create a function that just logs the result.
// We could also call this function the `outputFn` or `handleResultFn`
function logFn(result: number) {
  console.log(`We received this response from the worker: ${result}`)
}

// Lets put this all together and create our TypedWebWorker.
const typedWorker: ITypedWorker<number, number> = createWorker(workFn, logFn)

// Thats it! The Worker is now ready to process messages of type 'Values'
// and log the results to the console.
typedWorker.postMessage({ x: 5, y: 5 }) // logs: "10"
typedWorker.postMessage({ x: 0, y: 0 }) // logs: "0"

// You will get a compilation error if you try sending something other than a
// `Values` object.
typedWorker.postMessage({ x: 5, y: 5, z: 5}) // this line will not compile
typedWorker.postMessage("{ x: 5, y: 5}") // this line will not compile

```
You now have a type safe web worker that can sum numbers!

We could also write this example *much* shorter and still have the exact same type safety.
```javascript
const typedWorker = createWorker(
  (input: { x: number, y: number }, cb: (_: number) => void) => cb(input.x + input.y),
  (result) => console.log(result)
)
```
If we are explicit with the type of `typedWorker`, we can have much shorter function signatures.
```javascript
const typedWorker: ITypedWorker<{ x: number, y: number }, number> = createWorker(
  (input, cb) => cb(input.x + input.y),
  (result) => console.log(result)
)
```

Also, if we do not want to log the result, we can just ommit the second function as it is optional.

In case you were unsure, you can use this in a JavaScript project just as easily, just ommit the TS types.
```javascript
const typedWorker = createWorker(
  (input, cb) => cb(input.x + input.y),
  (result) => console.log(result)
)
typedWorker.postMessage({ x: 5, y: 5 }) // logs: "10"

```
### Things to note
The `workFn` that we give our worker can only use the data provided from the `input` variable.
It does not have access to any state other that the `input`.
```javascript
const results = []
function workFn(input: Values, cb): number {
  results.push(input.x + input.y) // this would not work
}
```
The reason why this would not work is because the two variables are not in the same context.
```javascript
const results = [] // main context
function workFn(input: Values): number {
  results.push(input.x + input.y) // Worker context
}
```
If you wish to add the results to an array, do it in the `Output` function.
```javascript
const results = []
const typedWorker = createWorker(
  (input: { x: number, y: number }, cb) => cb(input.x + input.y),
  (result) => results.push(results)
)
```
