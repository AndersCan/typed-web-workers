import { CallBackWorker } from '../src/index'


describe("Callback Worker", () => {
  describe("simple cb with number", () => {
    let cbNumberWorker: CallBackWorker<number, number>;
    let result = 0;
    beforeEach(done => {
      cbNumberWorker = new CallBackWorker(
        (input: number, cb) => {
          cb(input);
        },
        (output: number) => {
          result = output;
          done();
        }
      )
      cbNumberWorker.postMessage(1);
    });


    it("cb with correct result", function () {
      expect(result).toEqual(1);
    });
  })

  describe("simple cb with object", () => {
    let promiseObjectWorker: CallBackWorker<{ a: number }, { b: number }>;
    let result = {}
    beforeEach(done => {
      promiseObjectWorker = new CallBackWorker(
        (input: { a: number }, cb) => {
          cb({ b: input.a });
        },
        (output: { b: number }) => {
          result = output;
          done();
        }
      )
      promiseObjectWorker.postMessage({ a: 10 });
    });

    it("simple object return", function () {
      expect(result).toEqual({ b: 10 })
    });
  });

  describe("multiple cb", () => {
    let multiReponse: CallBackWorker<number, number>;
    let result: number[] = [];
    beforeEach(done => {
      result = [];
      multiReponse = new CallBackWorker(
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
  describe("async cbs", () => {
    let asyncWorker: CallBackWorker<number, number>;
    let result: number[] = [];
    beforeEach(done => {
      result = [];
      asyncWorker = new CallBackWorker(
        (input: number, cb) => {
          setTimeout(
            () => cb(input),
            100 - (input * 10)
          )
        },
        (output: number) => {
          result.push(output);
          if (output === 1) {
            done()
          }
        }
      )
      asyncWorker.postMessage(1);
      asyncWorker.postMessage(2);
      asyncWorker.postMessage(3);
    });


    it("correct length", function () {
      expect(result.length).toEqual(3);
    });

    it("order is correct", function () {
      expect(result).toEqual([3, 2, 1]);
    });
  })
})