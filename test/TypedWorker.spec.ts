import { TypedWorker } from '../src/index'

const range = n => Array.from({ length: n }, (value, key) => key)

describe("TypedWorker", function () {

  describe("basic message passing", () => {
    let result;

    beforeEach(function (done) {
      const numberWorker = new TypedWorker(
        (input: number) => 1000,
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

  describe("multi-messages", () => {
    describe("small message count", () => {

      let msgCountDown = 10
      let result = 0;
      const numberRangeSmall = range(10)

      beforeEach(function (done) {
        const numberWorker = new TypedWorker(
          (input: number) => input,
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
        const numberWorker = new TypedWorker(
          (input: number) => input,
          (output) => {
            result += output
            msgCountDown--
            if (msgCountDown === 0) {
              done();
            }
          }
        )
        numberRangeLarge.forEach(n => numberWorker.postMessage(n))
      });

      it("returns correct result after adding numberRangeLarge", function () {
        const expected = numberRangeLarge.reduce((c, p) => c + p)
        expect(result).toEqual(expected)
      });
    })
  })

  describe("handles large input", () => {
    let result;
    beforeEach(function (done) {
      const numberWorker = new TypedWorker(
        (input: number[]) => input,
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
    let numberWorker: TypedWorker<number, number>;
    numberWorker = new TypedWorker(
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
});