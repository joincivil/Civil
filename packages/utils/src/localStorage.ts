export enum CIVIL_LOCAL_STORAGE_EVENTS {
  "SET_ITEM" = "CivilLocalStorageSetItemEvent",
  "UPDATE_ITEM" = "CivilLocalStorageUpdateItemEvent",
}

function createAndDispatchLocalStorageEvent(eventType: string, detail?: any): void {
  const civilLocalStorageEvent = new CustomEvent(eventType, { detail });
  window.dispatchEvent(civilLocalStorageEvent);
}

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
    createAndDispatchLocalStorageEvent(CIVIL_LOCAL_STORAGE_EVENTS.SET_ITEM, { key, value });
  } catch (err) {
    console.error("Error calling localStorage.setItem", err);
  }
}

export function removeItem(key: string): void {
  try {
    localStorage.removeItem(key);
    createAndDispatchLocalStorageEvent(CIVIL_LOCAL_STORAGE_EVENTS.SET_ITEM, { key });
  } catch (err) {
    console.error("Error calling localStorage.removeItem", err);
  }
}

let isBroadcasting = false;
export function startLocalStorageUpdateBroadcast(): void {
  if (window && !isBroadcasting) {
    isBroadcasting = true;
    window.addEventListener("storage", ev => {
      if (ev.storageArea === localStorage) {
        const { key } = ev;
        if (key) {
          try {
            const value = fetchItem(key);
            createAndDispatchLocalStorageEvent(CIVIL_LOCAL_STORAGE_EVENTS.UPDATE_ITEM, { key, value });
          } catch (err) {
            console.error(err);
          }
        }
      }
    });
  }
}
