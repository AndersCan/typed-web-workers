import {
  createWorker,
  ITypedWorker
} from '../index'

describe('try/catch handling', function() {
  describe('try/catch - success', () => {
    let result: string

    beforeEach(function(done) {
      const tryWorker: ITypedWorker<
        string,
        string
      > = createWorker({
        workerFunction: (input, cb) => {
          try {
            if (input === 'works')
              cb('ok')
            throw 'not ok'
          } catch (e) {
            cb(e)
          }
        },
        onMessage: output => {
          result = output
          done()
        }
      })
      tryWorker.postMessage('works')
    })

    it('returns the correct type', function() {
      expect(result).toEqual(
        jasmine.any(String)
      )
    })

    it('returns the correct value', function() {
      expect(result).toEqual('ok')
    })
  })

  describe('try/catch - failure', () => {
    let result: string

    beforeEach(function(done) {
      const tryWorker: ITypedWorker<
        string,
        string
      > = createWorker({
        workerFunction: (input, cb) => {
          try {
            if (input === 'works')
              cb('ok')
            throw 'not ok'
          } catch (e) {
            cb(e)
          }
        },
        onMessage: output => {
          result = output
          done()
        }
      })
      tryWorker.postMessage(
        'does not work'
      )
    })

    it('returns the correct type', function() {
      expect(result).toEqual(
        jasmine.any(String)
      )
    })

    it('returns the correct value', function() {
      expect(result).toEqual('not ok')
    })
  })
})
