# typed-web-workers
Simple wrapper for creating webworkers with types.


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
