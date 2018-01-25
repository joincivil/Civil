/* tslint:disable promise-function-async */
export function promisify<T>(
  original: (...params: any[]) => void,
  thisArg?: any,
): (...callArgs: any[]) => Promise<T> {
  const promisifed = (...callArgs: any[]): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
      const callback = (err: Error|null, data?: T) => {
        if (err !== null) {
          return reject(err);
        }
        return resolve(data);
      };
      original.apply(thisArg, [...callArgs, callback]);
    });
  };
  return promisifed;
}
/* tslint:emable promise-function-async */

export function bindNestedAll(what: any, excludes: string[] = ["constructor"], thisArg?: any, ...params: any[]): void {
  const self = thisArg || what;
  for (const key of Object.getOwnPropertyNames(what)) {
    const val = what[key];
    if (!excludes.includes(key)) {
      if (typeof val === "function") {
        what[key] = val.bind(self, ...params);
      } else if (typeof val === "object") {
        bindNestedAll(val, excludes, self);
      }
    }
  }
}

export function bindAll(what: any, excludes: string[] = ["constructor"], thisArg?: any): void {
  const self = thisArg || what;
  // TODO(ritave): Functions not returned
  Object
    .getOwnPropertyNames(Object.getPrototypeOf(what))
    .filter((key) => !excludes.includes(key) && typeof what[key] === "function")
    .forEach((key) => what[key] = what[key].bind(self));
}

export async function delay<T>(milliseconds: number, value?: T): Promise<T> {
  return new Promise<T>((resolve) => setTimeout(() => resolve(value), milliseconds));
}

export function isPromiseLike<T = any>(what: any): what is PromiseLike<T> {
  return what.then !== undefined && typeof what.then === "function";
}
