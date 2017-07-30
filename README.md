# typed-web-workers
Library that help you get quickly up and running with web workers in either TypeScript or JavaScript projects.

# Installation
`npm i typed-web-workers -S` or `yarn add typed-web-workers`

# Motivation
When working with web workers, you normally do not know much about what types of paramaters it accepts. This is because all input that it receives is strings. Working with stringified objects makes coding less intuative and we lose compilation errors. We want TypeScript to catch as many errors as possible during compilation. We also want to have code completion so we can be more effective. To solve these issues, we have created a `TypedWorker`.

# How does it work?
Simply put, a TypedWorker is a wrapper for using a normal web worker. It is by using this wrapper that we can make our web workers typesafe. Lets look at a small example to help illustrate this.

## Sum of two numbers
```javascript
// Let us define our input type 'Values' (this can be anything)
interface Values {
  x: number
  y: number
}
// Lets define our 'work function' (what it should do)
function workFn(input: Values): number {
  return input.x + input.y
}
// Now, we need a function to handle the data that the worker returns
// Lets just create a easy logger
function logFn(result: number) {
  console.log(result)
}

// Lets put this all together and create our TypedWebWorker
const typedWorker = new TypedWorker(workFn, logFn)

// Thats it! The Worker is now ready to process messages of type 'Values'
// and log the results
typedWorker.postMessage({ x: 5, y: 5 }) // logs: "10"

// You will get a compilation error if you try sending the wrong types
typedWorker.postMessage({ x: 5, y: 5, z: 5}) // this line will not compile

```
You now have a type safe web worker that can sum numbers!

We could also write this example much shorter and still have the same type safety.
```javascript
const typedWorker = new TypedWorker(
  (input: { x: number, y: number }) => input.x + input.y,
  (result) => console.log(result)
)
```
Also, if we do not want to log the result, we can just ommit the second function as it is optional.

In case you were unsure, you can use this in a JavaScript project just as easily, just ommit the TS types.
```javascript
const typedWorker = new TypedWorker(
  (input) => input.x + input.y,
  (result) => console.log(result)
)
typedWorker.postMessage({ x: 5, y: 5 }) // logs: "10"

```

Last thing, `TypedWorker` is generic, so *you* decide what the types of the `input` and `output` should be.