import { createWorker } from '../src/index'

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
})

const fn = function fn(
  input,
  cb,
  getState,
  setState
) {
  setState(input)
  cb(getState())
}

const results = []
const internalWorker = createWorker({
  workerFunction: fn,
  onMessage: ({ id, input }) => {
    results[id](input)
  }
})
const PromiseWorker = (input: any) => {
  internalWorker.postMessage({
    id: results.length,
    input
  })
  return new Promise(
    res =>
      (results[results.length] = res)
  )
}
