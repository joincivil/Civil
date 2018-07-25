import { Observable } from "rxjs";

const EMPTY = Symbol();

/**
 * An asynchronous version of the filter operator.
 * This version waits until the filter finishes and concatenates
 * the input stream in order it was received to output
 */
export function concatFilter<T>(
  this: Observable<T>,
  filter: (value: T, index: number) => PromiseLike<boolean> | boolean,
): Observable<T> {
  return this.concatMap(async (v, i) => {
    if (await filter(v, i)) {
      return v;
    }
    return EMPTY;
  }).filter(x => x !== EMPTY) as Observable<T>;
}

/**
 * An asynchronous version of the filter operator.
 * This version waits until the filter finishes and outputs
 * the input values in first-filter-returns-first-served basis
 */
export function flatFilter<T>(
  this: Observable<T>,
  filter: (value: T, index: number) => PromiseLike<boolean> | boolean,
): Observable<T> {
  return this.flatMap(async (v, i) => {
    if (await filter(v, i)) {
      return v;
    }
    return EMPTY;
  }).filter(x => x !== EMPTY) as Observable<T>;
}

export function definedOrThrow<T>(this: Observable<T | undefined>): Observable<T> {
  return this.map(value => {
    // tslint:disable-next-line:triple-equals
    if (value == undefined) {
      throw new Error("Expected not-null value in the stream");
    }
    return value;
  });
}

Observable.prototype.concatFilter = concatFilter;
Observable.prototype.flatFilter = flatFilter;
Observable.prototype.definedOrThrow = definedOrThrow;

declare module "rxjs/Observable" {
  // tslint:disable:no-shadowed-variable
  interface Observable<T> {
    concatFilter: typeof concatFilter;
    flatFilter: typeof flatFilter;
    definedOrThrow: typeof definedOrThrow;
  }
  // tslint:enable:no-shadowed-variable
}
