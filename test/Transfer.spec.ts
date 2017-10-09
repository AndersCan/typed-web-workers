import { TypedWorker, createWorker } from '../src/index'

describe("TypedWorker - transfer", function () {

  describe("can transfer ownership", () => {
    let workerContextBytelength: number;
    let uiContextByteLength: number;
    beforeEach(function (done) {
      const myUInt8Array = new Uint8Array(1024 * 1024 * 8); // 8MB
      for (let i = 0; i < myUInt8Array.length; ++i) {
        myUInt8Array[i] = i;
      }
      const transferWorker = new TypedWorker(
        (input: ArrayBuffer) => input.byteLength,
        (output) => {
          workerContextBytelength = output
          done();
        }
      )
      transferWorker.postMessage(myUInt8Array.buffer, [myUInt8Array.buffer]);
      uiContextByteLength = myUInt8Array.byteLength;
    });

    it("UI context byteLength should be zero", function () {
      expect(uiContextByteLength).toEqual(0)
    });

    it("Worker context byteLength should be greater than zero", function () {
      expect(workerContextBytelength).toBeGreaterThan(0)
    });
  })
});

describe("createWorker - transfer", function () {

  describe("can transfer ownership", () => {
    let workerContextBytelength: number;
    let uiContextByteLength: number;
    beforeEach(function (done) {
      const myUInt8Array = new Uint8Array(1024 * 1024 * 8); // 8MB
      for (let i = 0; i < myUInt8Array.length; ++i) {
        myUInt8Array[i] = i;
      }
      const transferWorker = createWorker<ArrayBuffer, number>(
        (input, cb) => cb(input.byteLength),
        (output) => {
          workerContextBytelength = output
          done();
        }
      )
      transferWorker.postMessage(myUInt8Array.buffer, [myUInt8Array.buffer]);
      uiContextByteLength = myUInt8Array.byteLength;
    });

    it("UI context byteLength should be zero", function () {
      expect(uiContextByteLength).toEqual(0)
    });

    it("Worker context byteLength should be greater than zero", function () {
      expect(workerContextBytelength).toBeGreaterThan(0)
    });
  })
});