export function fetchItem(key: string): any {
  try {
    const item = localStorage.getItem(key);

    if (item === null) {
      return undefined;
    }

    return JSON.parse(item);
  } catch (err) {
    return undefined;
  }
}

export function setItem(key: string, value: any): void {
  localStorage.setItem(key, JSON.stringify(value));
}
