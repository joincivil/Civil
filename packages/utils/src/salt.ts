import { words } from "../src/bip39.english";
import { BigNumber } from "bignumber.js";

export { words };

// Adapted from: https://github.com/aseemk/bases.js/blob/master/bases.js#L8

export function toAlphabet(srcNum: BigNumber, alphabet: string[]): string[] {
  const base = alphabet.length;
  const digits = [];
  let num: BigNumber = srcNum;

  do {
    digits.push(num.mod(base));
    num = num.dividedBy(base).round(0, BigNumber.ROUND_FLOOR);
  } while (num.greaterThan(0));

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

    const n = new BigNumber(base).pow(pos).mul(idx);
    num = num.plus(n);
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

export function randomSalt(wordCount: number): BigNumber {
  if (!wordCount) {
    throw new Error("wordCount must be at least 1.");
  }

  let salt = new BigNumber(0);
  const base = new BigNumber(words.length);

  const min = base.pow(wordCount - 1);
  const max = base.pow(wordCount);

  const spread = max.minus(min);

  const rand = BigNumber.random()
    .mul(spread)
    .plus(min)
    .round(0, BigNumber.ROUND_FLOOR);

  salt = salt.plus(rand);

  return salt;
}
