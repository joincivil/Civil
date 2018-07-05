import * as chai from "chai";
import { configureChai } from "@joincivil/dev-utils";
import { toAlphabet, fromAlphabet, words, wordsToSalt, saltToWords } from "../src/salt";
import { BigNumber } from "bignumber.js";

configureChai(chai);

const expect = chai.expect;

describe("utils/salt", () => {
  it("Converts numbers back and forth", async () => {
    const testNumbers = [
      "0",
      "1",
      "2048",
      "2049",
      "84804387",
      "95738974259872498524379",
      "957389742598724985243799573897425987249852437995738974259872498524379",
      new BigNumber(2048).pow(10),
    ];

    for (const num of testNumbers) {
      const tn = typeof num === "string" ? new BigNumber(num) : num;
      const asWords = toAlphabet(tn, words);
      const asNum = fromAlphabet(asWords, words);

      expect(tn.toFixed()).equal(asNum.toFixed());
    }
  });

  it("Converts words to salt string", async () => {
    const strs = [
      ["life peasant", "2657290"],
      ["life   peasant", "2657290"],
      ["life peasant   ", "2657290"],
      ["     life peasant  ", "2657290"],
      [" abandon abandon ability", new BigNumber(2048).pow(2).toFixed()],
    ];

    for (const [ws, salt] of strs) {
      const s = wordsToSalt(ws);
      const ts = new BigNumber(salt);
      expect(s).equal(ts.toFixed());
    }
  });

  it("Converts salt to words", async () => {
    const strs = [
      ["life peasant", "2657290"],
      ["fashion", "666"],
      ["angry electric feed farm", "5715147216967"],
      ["abandon abandon ability", new BigNumber(2048).pow(2).toFixed()],
    ];

    for (const [ws, salt] of strs) {
      const tw = saltToWords(salt).join(" ");
      expect(ws).equal(tw);
    }
  });

  it("Should throw an error", async () => {
    const fn = () => wordsToSalt("crab talk");
    expect(fn).to.throw(Error, "Invalid word: crab");
  });
});
