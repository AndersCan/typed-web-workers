# typed-web-workers
## Currently in pre-alpha

# Info
Simple wrapper for creating web workers with type safety by using TypeScript.

The constructor for the class `TypedWorker` takes as input the function that the web worker will execute.
This method has the signature `workerFunction: (input: In) => Out`. `In` and `Out` are generic so you decide yourself their type.


# Example code
## Return the sum of two numbers
```javascript
interface Sum {
  a: number
  b: number
}

const worker = new TypedWorker(
  (input: Sum) : number => {
    return input.a + input.b
  }
)
worker.onMessage = (result: number) => console.log("Worked responded with: " + result)
worker.onMessage = (result: string) => console.log("Worked responded with: " + result) // ERROR - Wrong type for Output

worker.postMessage({ a : 5, b : 5 })
worker.postMessage({ a: [1, 2, 3] }) // ERROR - Wrong type for Input
```
