import { createWorker, WorkerFunctionProps } from '../src/index'

import * as fc from 'fast-check'

describe('TypedWorker with state', function() {
  describe('basic state', () => {
    it('can save [1, 2, 3]', async function() {
      let input = [1, 2, 3]
      const output = await PromiseWorker(input)
      expect(output).toEqual(input)
    })

    it('can save { a: [1, 2, 3] }', async function() {
      let input = { a: [1, 2, 3] }
      const output = await PromiseWorker(input)
      expect(output).toEqual(input)
    })

    it(
      'can save anything',
      async function() {
        return fc.assert(
          fc.asyncProperty(fc.anything(), async (anything: any) => {
            let input = anything
            const output = await PromiseWorker(input)
            expect(input).toEqual(output)
          }),
          { numRuns: 10000 }
        )
      },
      10 * 1000 // 10s
    )
  })

  it('getState and setState have correct types', async function(done) {
    const state = createWorker<number, number, number[]>({
      workerFunction: ({ input, callback, setState, getState }) => {
        setState([input])
        callback(getState()[0])
      },
      onMessage: output => {
        expect(typeof output).toEqual('number')
        done()
      }
    })
    state.postMessage(1)
  })
})

function workerFunction({
  setState,
  getState,
  input,
  callback
}: WorkerFunctionProps<any, any, any>) {
  setState(input)
  callback(getState())
}

const results = []
const internalWorker = createWorker({
  workerFunction,
  onMessage: props => {
    results[props.id](props.input)
  }
})
const PromiseWorker = (input: any) => {
  const id = results.length
  internalWorker.postMessage({
    id,
    input
  })
  return new Promise(res => (results[id] = res))
}
