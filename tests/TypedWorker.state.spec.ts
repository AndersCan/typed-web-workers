import { createWorker } from '../src/index'

import * as fc from 'fast-check'

describe('TypedWorker with state', function() {
  describe('basic state', () => {
    it('returns the correct type', async function() {
      let input = [1, 2, 3]
      const output = await PromiseWorker(
        input
      )
      expect(output).toEqual(input)
    })

    it('returns the correct obj type', async function() {
      let input = { a: [1, 2, 3] }
      const output = await PromiseWorker(
        input
      )
      expect(output).toEqual(input)
    })

    it('returns the correct obj type', async function() {
      fc.assert(
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
        { numRuns: 1000 }
      )
    })
  })
})

const results = []
const internalWorker = createWorker({
  workerFunction: (
    input,
    cb,
    getState,
    setState
  ) => {
    setState(input)
    cb(getState())
  },
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
