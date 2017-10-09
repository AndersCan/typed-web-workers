import { createWorker, IWorker } from '../src/index'


describe("Callback Worker", () => {
  describe("simple cb with number", () => {
    let cbNumberWorker: IWorker<number, number>;

    let result = 0;
    beforeEach(done => {
      cbNumberWorker = createWorker(
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
    let objectWorker: IWorker<{ a: number }, { b: number }>;
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

  describe("multiple cb", () => {
    let multiReponse: IWorker<number, number>;
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
  describe("async cbs", () => {
    let asyncWorker: IWorker<number, number>;
    let result: number[] = [];
    beforeEach(done => {
      result = [];
      asyncWorker = createWorker(
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
  describe("Termination", () => {
    let msgCounter = 0;
    let numberWorker: IWorker<number, number>;
    beforeEach(done => {
      numberWorker = createWorker(
        (input: number, cb) => {
          cb(input);
        },
        (output) => {
          numberWorker.terminate()
          msgCounter = output;
          done()
        }
      )
      numberWorker.postMessage(1);
      numberWorker.postMessage(2);
    });

    it("stops handling messages", function () {
      expect(msgCounter).toEqual(1)
    });
  })
})