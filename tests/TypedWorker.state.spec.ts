import {
  createWorker,
  WorkerProps
} from '../src/index'

import * as fc from 'fast-check'

describe('TypedWorker with state', function() {
  describe('basic state', () => {
    it('can save [1, 2, 3]', async function() {
      let input = [1, 2, 3]
      const output = await PromiseWorker(
        input
      )
      expect(output).toEqual(input)
    })

    it('can save { a: [1, 2, 3] }', async function() {
      let input = { a: [1, 2, 3] }
      const output = await PromiseWorker(
        input
      )
      expect(output).toEqual(input)
    })

    it(
      'can save anything',
      async function() {
        return fc.assert(
          fc.asyncProperty(
            fc.anything(),
            async (anything: any) => {
              let input = anything
              const output = await PromiseWorker(
                input
              )
              expect(input).toEqual(
                output
              )
            }
          ),
          { numRuns: 10000 }
        )
      },
      10 * 1000 // 10s
    )
  })

  it('getState and setState have correct types', async function(done) {
    const state = createWorker<
      number,
      number,
      number[]
    >({
      workerFunction: ({
        input,
        cb,
        setState,
        getState
      }) => {
        setState([input])
        cb(getState()[0])
      },
      onMessage: output => {
        expect(typeof output).toEqual(
          'number'
        )
        done()
      }
    })
    state.postMessage(1)
  })
})

const fn = function fn({
  setState,
  getState,
  input,
  cb
}: WorkerProps<any, any, any>) {
  setState(input)
  cb(getState())
}

const results = []
const internalWorker = createWorker({
  workerFunction: fn,
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
  return new Promise(
    res => (results[id] = res)
  )
}
