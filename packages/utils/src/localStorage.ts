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

/*
// TODO: Broadcast updated localstorage update event to other windows
let numUpdates = 0;
window.addEventListener("storage", (ev) => {
  if (ev.storageArea === localStorage && numUpdates < 1) {
    console.log("local storage change from another document", ev);
    const { key } = ev;
    if (key) {
      const value = fetchItem(key);
      createAndDispatchLocalStorageEvent(CIVIL_LOCAL_STORAGE_EVENTS.UPDATE_ITEM, { key, value });
      numUpdates++;
    }
  }
});
 */
