declare module "web3-providers-http";

// https://github.com/ethereum-ts/bn.js-typings/blob/master/index.d.ts
declare module "bn.js" {
  import { Buffer } from "buffer";

  type Endianness = "le" | "be";

  export class BN {
    constructor(
      number: number | string | number[] | ReadonlyArray<number> | Buffer,
      base?: number,
      endian?: Endianness,
    );
    clone(): BN;
    toString(base?: number, length?: number): string;
    toNumber(): number;
    toJSON(): string;
    toArray(endian?: Endianness, length?: number): number[];
    toBuffer(endian?: Endianness, length?: number): Buffer;
    bitLength(): number;
    zeroBits(): number;
    byteLength(): number;
    isNeg(): boolean;
    isEven(): boolean;
    isOdd(): boolean;
    isZero(): boolean;
    cmp(b: any): number;
    lt(b: any): boolean;
    lte(b: any): boolean;
    gt(b: any): boolean;
    gte(b: any): boolean;
    eq(b: any): boolean;
    isBN(b: any): boolean;

    neg(): BN;
    abs(): BN;
    add(b: BN | number): BN;
    sub(b: BN | number): BN;
    mul(b: BN | number): BN;
    sqr(): BN;
    pow(b: BN | number): BN;
    div(b: BN | number): BN;
    mod(b: BN): BN;
    divRound(b: BN): BN;

    or(b: BN): BN;
    and(b: BN): BN;
    xor(b: BN): BN;
    setn(b: number): BN;
    shln(b: number): BN;
    shrn(b: number): BN;
    testn(b: number): boolean;
    maskn(b: number): BN;
    bincn(b: number): BN;
    notn(w: number): BN;

    gcd(b: BN): BN;
    egcd(b: BN): { a: BN; b: BN; gcd: BN };
    invm(b: BN): BN;
  }
}
