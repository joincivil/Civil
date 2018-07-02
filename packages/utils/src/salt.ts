import { words } from "../src/bip39.english";
import { BigNumber } from "bignumber.js";

// Adapted from: https://github.com/aseemk/bases.js/blob/master/bases.js#L8

export { words };

export function toAlphabet(srcNum: BigNumber, alphabet: string[]): string[] {
  const base = alphabet.length;
  const digits = [];
  let num: BigNumber = srcNum;

  do {
    digits.push(num.mod(base));
    num = num.dividedBy(base).integerValue(BigNumber.ROUND_FLOOR);
  } while (num.isGreaterThan(0));

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

    const n = new BigNumber(base).pow(pos).multipliedBy(idx);
    num = num.plus(n);
  }

  return num;
}

export function wordsToSalt(str: string): string {
  const w = str.split(" ").filter(s => s.trim().length);
  return fromAlphabet(w, words).toFixed();
}

export function saltToWords(salt: string | BigNumber): string[] {
  const bn = typeof salt === "string" ? new BigNumber(salt) : salt;
  return toAlphabet(bn, words);
}
