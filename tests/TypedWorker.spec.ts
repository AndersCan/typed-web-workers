import {
  createWorker,
  ITypedWorker
} from '../src/index'

const range = (n: number) =>
  Array.from(
    { length: n },
    (value, key) => key
  )

describe('TypedWorker', function() {
  describe('basic message passing', () => {
    let result: number

    beforeEach(function(done) {
      const numberWorker: ITypedWorker<
        number,
        number
      > = createWorker({
        workerFunction: ({
          input,
          callback
        }) => callback(1000),
        onMessage: output => {
          result = output
          done()
        }
      })
      numberWorker.postMessage(1)
    })

    it('returns the correct type', function() {
      expect(result).toEqual(
        jasmine.any(Number)
      )
    })

    it('returns the correct value', function() {
      expect(result).toEqual(1000)
    })
  })

  describe('simple callback with object', () => {
    let objectWorker: ITypedWorker<
      { a: number },
      { b: number }
    >
    let result = {}
    beforeEach(done => {
      objectWorker = createWorker({
        workerFunction: ({
          input: { a },
          callback
        }) => {
          callback({ b: a })
        },
        onMessage: (output: {
          b: number
        }) => {
          result = output
          done()
        }
      })
      objectWorker.postMessage({
        a: 10
      })
    })

    it('simple object return', function() {
      expect(result).toEqual({ b: 10 })
    })
  })

  describe('multi-messages', () => {
    describe('small message count', () => {
      let msgCountDown = 10
      let result = 0
      const numberRangeSmall = range(10)

      beforeEach(function(done) {
        const numberWorker: ITypedWorker<
          number,
          number
        > = createWorker({
          workerFunction: ({
            input,
            callback
          }) => callback(input),
          onMessage: output => {
            result += output
            msgCountDown--
            if (msgCountDown === 0) {
              done()
            }
          }
        })
        numberRangeSmall.forEach(n =>
          numberWorker.postMessage(n)
        )
      })

      it('returns correct result after adding numberRangeSmall', function() {
        const expected = numberRangeSmall.reduce(
          (c, p) => c + p
        )
        expect(result).toEqual(expected)
      })
    })

    describe('large message count', () => {
      const numberRangeLarge = range(
        10000
      )
      let result = 0
      let msgCountDown =
        numberRangeLarge.length

      beforeEach(function(done) {
        const numberWorker: ITypedWorker<
          number,
          number
        > = createWorker({
          workerFunction: ({
            input,
            callback
          }) => callback(input),
          onMessage: output => {
            result += output
            msgCountDown--
            if (msgCountDown === 0) {
              done()
            }
          }
        })
        numberRangeLarge.forEach(n =>
          numberWorker.postMessage(n)
        )
      }, 5000)

      it('returns correct result after adding numberRangeLarge', function() {
        const expected = numberRangeLarge.reduce(
          (c, p) => c + p
        )
        expect(result).toEqual(expected)
      })
    })
    describe('correct order', () => {
      let multiReponse: ITypedWorker<
        number,
        number
      >
      let result: number[] = []
      beforeEach(done => {
        result = []
        multiReponse = createWorker({
          workerFunction: ({
            input,
            callback
          }) => {
            callback(input)
          },
          onMessage: (
            output: number
          ) => {
            result.push(output)
            if (output === 3) {
              done()
            }
          }
        })
        multiReponse.postMessage(1)
        multiReponse.postMessage(2)
        multiReponse.postMessage(3)
      })

      it('correct length', function() {
        expect(result.length).toEqual(3)
      })

      it('order is correct', function() {
        expect(result).toEqual([
          1,
          2,
          3
        ])
      })
    })
  })

  describe('handles large input', () => {
    let result
    beforeEach(function(done) {
      const numberWorker: ITypedWorker<
        number[],
        number[]
      > = createWorker({
        workerFunction: ({
          input,
          callback
        }) => callback(input),
        onMessage: output => {
          result = output.reduce(
            (c, p) => c + p
          )
          done()
        }
      })
      numberWorker.postMessage(
        range(1000)
      )
    })

    it('returns the correct value', function() {
      const expected = range(
        1000
      ).reduce((c, p) => c + p)
      expect(result).toEqual(expected)
    })
  })

  describe('Termination', () => {
    let msgCounter = 0
    let numberWorker: ITypedWorker<
      number,
      number
    >
    numberWorker = createWorker({
      workerFunction: () => {
        msgCounter += 1
      }
    })

    it('stops handling messages', function() {
      numberWorker.terminate()
      numberWorker.postMessage(1)
      expect(msgCounter).toEqual(0)
    })
  })

  describe('Termination', () => {
    let msgCounter = 0
    let numberWorker: ITypedWorker<
      number,
      number
    >
    beforeEach(done => {
      numberWorker = createWorker({
        workerFunction: ({
          input,
          callback
        }) => {
          callback(input)
        },
        onMessage: output => {
          numberWorker.terminate()
          msgCounter = output
          setTimeout(done, 500)
        }
      })
      numberWorker.postMessage(1)
      numberWorker.postMessage(2)
    })

    it('stops handling messages', function() {
      expect(msgCounter).toEqual(1)
    })
  })
})
