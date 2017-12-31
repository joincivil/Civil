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

export function bindNestedAll(what: any, excludes: string[] = ["constructor"], thisArg?: any, ...params: any[]) {
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
