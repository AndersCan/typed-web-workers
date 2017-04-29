# typed-web-workers

# Info
Wrapper for creating web workers with type safety using TypeScript.

The constructor for the class `TypedWorker` takes as input the function that the web worker will execute and, optionally, a function that will run when the web worker completes processing the given message.

`TypedWorker` is generic, so you decide yourself what the type of `input` and `output` should be.

# Example code
## Ping Pong
```javascript
const pingPongWorker = new TypedWorker(
  (input: "PING") => "PONG",
  (output) => console.log(`Responded to 'PING' with ${output}`) // optional
)
pingPongWorker.postMessage("PING")
pingPongWorker.postMessage("pong") // Error - wrong type
```
## Return the sum of two numbers
```javascript
interface Sum {
  a: number
  b: number
}

const worker = new TypedWorker(
  (input: Sum) : number => input.a + input.b,
  (output) => console.log("Worked responded with: " + result) // optional
)
// output/onMessage can also be changed after calling the constructor
worker.onMessage = (result: number) => console.log("New message: " + result)
worker.onMessage = (result: string) => console.log("this will not work") // ERROR - Wrong type for Output

worker.postMessage({ a : 5, b : 5 })
worker.postMessage({ a: [1, 2, 3] }) // ERROR - Wrong type for Input
```
