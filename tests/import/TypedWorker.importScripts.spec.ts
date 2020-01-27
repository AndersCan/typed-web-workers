import {
  createWorker,
  ICreateWorkerProps
} from '../../src/index'

declare const moment: any
describe('importScript', function() {
  describe('can import script', () => {
    let result: string

    const workerMomentProps: ICreateWorkerProps<
      number,
      string
    > = {
      workerFunction: ({
        input,
        callback
      }) => {
        callback(moment(input).format('YYYY'))
      },
      importScripts: [
        'https://unpkg.com/moment@2.22.2/min/moment.min.js'
      ]
    }

    beforeEach(function(done) {
      try {
        result = ''
        const momentWorker = createWorker(
          {
            ...workerMomentProps,
            onMessage: res => {
              result = res
              done()
            }
          }
        )
        momentWorker.postMessage(0)
      } catch (e) {
        console.log(e)
      }
    })

    it('returns the correct type', function() {
      expect(result).toEqual(
        jasmine.any(String)
      )
    })

    it('returns the correct value', function() {
      expect(result).toEqual('1970')
    })
  })

  describe('calls onError when given bad import', () => {
    let result: string
    const badImportURI =
      'https://unpkg.com/something.that.gives.error.js'
    const invalidImportProps: ICreateWorkerProps<
      string,
      string
    > = {
      workerFunction: ({
        input,
        callback
      }) => {
        callback(input)
      },
      importScripts: [badImportURI]
    }

    const errorMessage = 'error called'

    beforeEach(done => {
      result = ''
      const badImportWorker = createWorker(
        {
          ...invalidImportProps,
          onMessage: res => {
            throw 'should not be called'
          },
          onError: err => {
            err.preventDefault()
            result = errorMessage
            done()
          }
        }
      )

      badImportWorker.postMessage(
        'fails'
      )
    })

    it('calls onError', function() {
      expect(result).toBe(errorMessage)
    })
  })

  describe('can import script in worker function', () => {
    let result: string

    const workerMomentProps: ICreateWorkerProps<
      number,
      string
    > = {
      workerFunction: ({
        input,
        callback
      }) => {
        if (
          self['moment'] === undefined
        ) {
          importScripts(
            'https://unpkg.com/moment@2.22.2/min/moment.min.js'
          )
        }
        callback(moment(input).format('YYYY'))
      }
    }

    beforeEach(function(done) {
      result = ''
      const momentWorker = createWorker(
        {
          ...workerMomentProps,
          onMessage: res => {
            result = res
            done()
          }
        }
      )
      momentWorker.postMessage(0)
    })

    it('returns the correct type', function() {
      expect(result).toEqual(
        jasmine.any(String)
      )
    })

    it('returns the correct value', function() {
      expect(result).toEqual('1970')
    })
  })
})
