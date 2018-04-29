import * as isHexPrefixedImport from "is-hex-prefixed";
import * as stripHexPrefixImport from "strip-hex-prefix";

declare module "ethjs-util" {
  export function addHexPrefix(str: string): string;
  export function padToEven(value: string): string;
  export function intToHex(i: number): string;
  export function intToBuffer(i: number): Buffer;
  export function getBinarySize(str: string): number;
  export function arrayContainsArray<T = any>(superset: T[], subset: T[], some?: true): boolean;

  export function toUtf8(hex: string): string;
  export function toAscii(hex: string): string;

  export function fromUtf8(string: string, padding?: number): string;
  export function fromAscii(hex: string, padding?: number): string;

  /**
   * getKeys([{a: 1, b: 2}, {a: 3, b: 4}], 'a') => [1, 3]
   */
  export function getKeys(params: object[], key: string, allowEmpty?: true): any[];

  export function isHexString(value: string, length: number): boolean;
  export const isHexPrefixed = isHexPrefixedImport;
  export const stripHexPrefix = stripHexPrefixImport;
}
