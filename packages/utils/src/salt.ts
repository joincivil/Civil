import { words } from "./bip39.english";
import { BigNumber } from "@joincivil/typescript-types";

import { randomHex } from "web3-utils";

export { words };

// Adapted from: https://github.com/aseemk/bases.js/blob/master/bases.js#L8

export function toAlphabet(srcNum: BigNumber, alphabet: string[]): string[] {
  const base = alphabet.length;
  const digits = [];
  let num: BigNumber = srcNum;

  do {
    const baseBN = new BigNumber(base);
    digits.push(num.mod(baseBN));
    num = num.div(baseBN);
  } while (num.gt(new BigNumber(0)));

  const chars = [];
  while (digits.length) {
    const idx = digits.pop();
    // @ts-ignore: idx will always be a number.
    chars.push(alphabet[idx]);
  }
  return chars.reverse();
}

// Adapted from: https://github.com/aseemk/bases.js/blob/master/bases.js#L26

export function fromAlphabet(srcWords: string[], alphabet: string[]): BigNumber {
  const base = alphabet.length;
  let num = new BigNumber(0);

  for (let pos = 0; pos < srcWords.length; pos++) {
    const word = srcWords[pos];
    const idx = alphabet.indexOf(word);

    if (idx === -1) {
      throw new Error("Invalid word: " + word);
    }

    const n = new BigNumber(base).pow(new BigNumber(pos)).mul(new BigNumber(idx));
    num = num.add(n);
  }

  return num;
}

export function wordsToSalt(wrds: string | string[]): BigNumber {
  const str = typeof wrds === "string" ? wrds : wrds.join(" ");
  const w = str.split(" ").filter(s => s.trim().length);
  return fromAlphabet(w, words);
}

export function saltToWords(salt: string | BigNumber): string[] {
  const bn = typeof salt === "string" ? new BigNumber(salt) : salt;
  return toAlphabet(bn, words);
}

export function randomSalt(wordCountInt: number): BigNumber {
  if (!wordCountInt) {
    throw new Error("wordCount must be at least 1.");
  }
  const wordCount = new BigNumber(wordCountInt);

  const base = new BigNumber(words.length);

  const min = base.pow(wordCount.sub(1));
  const max = base.pow(wordCount);
  const spread = max.sub(min);

  const rand = new BigNumber(randomHex(64));
  const seed = rand.mod(spread).add(min);

  return seed;
}
