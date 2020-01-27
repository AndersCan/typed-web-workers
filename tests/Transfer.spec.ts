import {
  createWorker,
  ITypedWorker
} from '../src/index'

describe('TypedWorker - transfer', function() {
  describe('can transfer ownership from UI to worker', () => {
    let workerContextBytelength: number
    let uiContextByteLength: number
    beforeEach(function(done) {
      const myUInt8Array = new Uint8Array(
        1024 * 1024 * 8
      ) // 8MB
      for (
        let i = 0;
        i < myUInt8Array.length;
        ++i
      ) {
        myUInt8Array[i] = i
      }
      const transferWorker: ITypedWorker<
        ArrayBuffer,
        number
      > = createWorker({
        workerFunction: ({
          input,
          callback
        }) => callback(input.byteLength),
        onMessage: output => {
          workerContextBytelength = output
          done()
        }
      })
      transferWorker.postMessage(
        myUInt8Array.buffer,
        [myUInt8Array.buffer]
      )
      uiContextByteLength =
        myUInt8Array.byteLength
    })

    it('UI context byteLength should be zero', function() {
      expect(
        uiContextByteLength
      ).toEqual(0)
    })

    it('Worker context byteLength should be greater than zero', function() {
      expect(
        workerContextBytelength
      ).toBeGreaterThan(0)
    })
  })

  describe('can transfer ownership from worker to ui', () => {
    let workerContextByteLength = 999
    let uiContextByteLength = 0
    beforeEach(function(done) {
      const transferWorker: ITypedWorker<
        number,
        ArrayBuffer | number
      > = createWorker({
        workerFunction: ({
          input,
          callback
        }) => {
          const myUInt8Array = new Uint8Array(
            1024 * 1024 * 8
          ) // 8MB
          for (
            let i = 0;
            i < myUInt8Array.length;
            ++i
          ) {
            myUInt8Array[i] = i
          }
          callback(myUInt8Array.buffer, [
            myUInt8Array.buffer
          ])
          callback(myUInt8Array.byteLength)
        },
        onMessage: output => {
          if (
            typeof output === 'number'
          ) {
            workerContextByteLength = output
            done()
          } else {
            uiContextByteLength =
              output.byteLength
          }
        }
      })
      transferWorker.postMessage(1)
    })

    it('UI context byteLength should be greater than zero', function() {
      expect(
        uiContextByteLength
      ).toBeGreaterThan(0)
    })

    it('Worker context byteLength should be zero', function() {
      expect(
        workerContextByteLength
      ).toBe(0)
    })
  })
})
