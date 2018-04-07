import * as chai from "chai";
import { configureChai } from "@joincivil/dev-utils";

import { promisify } from "../src/language";

configureChai(chai);

const expect = chai.expect;

describe("utils/language", () => {
  describe("promisify", () => {
    it("wraps function", async () => {
      const OK = Symbol();
      const wrapped = (callback: (err: any, r: symbol) => void) => callback(null, OK);

      const tested = promisify<symbol>(wrapped);

      expect(await tested()).to.be.equal(OK);
    });

    it("passes parameters", async () => {
      const params = [
        "test parameter, please ignore",
        42,
      ];
      const wrapped =
        (s: string, n: number, callback: (err: any, r: [string, number]) => void) => callback(null, [s, n]);

      const tested = promisify<[string, number]>(wrapped);

      expect(await tested(...params)).to.be.deep.equal(params);
    });

    it("catches throws", async () => {
      const myError = new Error("Why hello there");
      const wrapped = () => { throw myError; };

      const tested = promisify(wrapped);

      await expect(tested()).to.eventually.be.rejectedWith(myError);
    });

    it("catches callback errors", async () => {
      const myError = new Error("Why hello there");
      const wrapped = (callback: (err: any) => void) => callback(myError);

      const tested = promisify(wrapped);

      await expect(tested()).to.eventually.be.rejectedWith(myError);
    });

    it("is asynchronous", (done) => {
      const data = "test data, please ignore";
      let caughtCallback: (err: any, data: string) => void = () => { done(new Error("Function not caught")); };
      const wrapped = (callback: (s: string) => void) => { caughtCallback = callback; };

      const tested = promisify<string>(wrapped);

      tested()
        .then((value) => {
          expect(value).to.be.equal(data);
          done();
        })
        .catch(done);

      caughtCallback(null, data);
    });
  });
});
