export function fetchItem(key: string): any {
  try {
    const item = localStorage.getItem(key);

    if (item === null) {
      return undefined;
    }

    return JSON.parse(item);
  } catch (err) {
    console.error("Error calling or parsing result from localStorage.getItem", err);
    return undefined;
  }
}

export function setItem(key: string, value: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error("Error calling localStorage.setItem", err);
  }
}

export function removeItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error("Error calling localStorage.removeItem", err);
  }
}
