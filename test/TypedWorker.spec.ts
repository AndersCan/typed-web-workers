import { createWorker, ITypedWorker } from '../src/index'

const range = n => Array.from({ length: n }, (value, key) => key)

describe("TypedWorker", function () {

  describe("basic message passing", () => {
    let result: number;

    beforeEach(function (done) {
      const numberWorker: ITypedWorker<number, number> = createWorker(
        (input, cb) => cb(1000),
        (output) => {
          result = output
          done();
        }
      )
      numberWorker.postMessage(1)
    });

    it("returns the correct type", function () {
      expect(result).toEqual(jasmine.any(Number))
    });

    it("returns the correct value", function () {
      expect(result).toEqual(1000)
    });
  })

  describe("simple cb with object", () => {
    let objectWorker: ITypedWorker<{ a: number }, { b: number }>;
    let result = {}
    beforeEach(done => {
      objectWorker = createWorker(
        (input: { a: number }, cb) => {
          cb({ b: input.a });
        },
        (output: { b: number }) => {
          result = output;
          done();
        }
      )
      objectWorker.postMessage({ a: 10 });
    });

    it("simple object return", function () {
      expect(result).toEqual({ b: 10 })
    });
  });

  describe("multi-messages", () => {
    describe("small message count", () => {

      let msgCountDown = 10
      let result = 0;
      const numberRangeSmall = range(10)

      beforeEach(function (done) {
        const numberWorker: ITypedWorker<number, number> = createWorker(
          (input, cb) => cb(input),
          (output) => {
            result += output
            msgCountDown--
            if (msgCountDown === 0) {
              done();
            }
          }
        )
        numberRangeSmall.forEach(n => numberWorker.postMessage(n))
      });

      it("returns correct result after adding numberRangeSmall", function () {
        const expected = numberRangeSmall.reduce((c, p) => c + p)
        expect(result).toEqual(expected)
      });
    })

    describe("large message count", () => {
      const numberRangeLarge = range(10000)
      let result = 0;
      let msgCountDown = numberRangeLarge.length

      beforeEach(function (done) {
        const numberWorker: ITypedWorker<number, number> = createWorker(
          (input, cb) => cb(input),
          (output) => {
            result += output
            msgCountDown--
            if (msgCountDown === 0) {
              done();
            }
          }
        )
        numberRangeLarge.forEach(n => numberWorker.postMessage(n))
      }, 5000);

      it("returns correct result after adding numberRangeLarge", function () {
        const expected = numberRangeLarge.reduce((c, p) => c + p)
        expect(result).toEqual(expected)
      });
    })
    describe("correct order", () => {
      let multiReponse: ITypedWorker<number, number>;
      let result: number[] = [];
      beforeEach(done => {
        result = [];
        multiReponse = createWorker(
          (input: number, cb) => {
            cb(input);
          },
          (output: number) => {
            result.push(output);
            if (output === 3) {
              done();
            }
          }
        )
        multiReponse.postMessage(1);
        multiReponse.postMessage(2);
        multiReponse.postMessage(3);
      });


      it("correct length", function () {
        expect(result.length).toEqual(3);
      });

      it("order is correct", function () {
        expect(result).toEqual([1, 2, 3]);
      });
    })
  })

  describe("handles large input", () => {
    let result;
    beforeEach(function (done) {
      const numberWorker: ITypedWorker<number[], number[]> = createWorker(
        (input: number[], cb) => cb(input),
        (output) => {
          result = output.reduce((c, p) => c + p)
          done();
        }
      )
      numberWorker.postMessage(range(1000))
    });

    it("returns the correct value", function () {
      const expected = range(1000).reduce((c, p) => c + p)
      expect(result).toEqual(expected)
    });
  })

  describe("Termination", () => {
    let msgCounter = 0;
    let numberWorker: ITypedWorker<number, number>;
    numberWorker = createWorker(
      (input: number) => {
        msgCounter += 1
        return input;
      }
    )

    it("stops handling messages", function () {
      numberWorker.terminate();
      numberWorker.postMessage(1);
      expect(msgCounter).toEqual(0)
    });
  })

  describe("Termination", () => {
    let msgCounter = 0;
    let numberWorker: ITypedWorker<number, number>;
    beforeEach(done => {
      numberWorker = createWorker(
        (input: number, cb) => {
          cb(input);
        },
        (output) => {
          numberWorker.terminate()
          msgCounter = output;
          setTimeout(done, 500)
        }
      )
      numberWorker.postMessage(1);
      numberWorker.postMessage(2);
    });

    it("stops handling messages", function () {
      expect(msgCounter).toEqual(1)
    });
  })
});