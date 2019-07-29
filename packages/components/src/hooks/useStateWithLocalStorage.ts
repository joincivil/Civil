import * as React from "react";
import {
  fetchItem,
  setItem,
  removeItem,
  startLocalStorageUpdateBroadcast,
  CIVIL_LOCAL_STORAGE_EVENTS,
} from "@joincivil/utils";

const storageKeys: any = {};

window.addEventListener(
  CIVIL_LOCAL_STORAGE_EVENTS.SET_ITEM,
  ev => {
    const { key: updatedKey, value: updatedValue } = (ev as any).detail;
    const handler = storageKeys[`${updatedKey}::${CIVIL_LOCAL_STORAGE_EVENTS.SET_ITEM}`];
    if (handler) {
      handler(updatedValue);
    }
    ev.stopPropagation();
  },
  false,
);

window.addEventListener(
  CIVIL_LOCAL_STORAGE_EVENTS.UPDATE_ITEM,
  ev => {
    const { key: updatedKey, value: updatedValue } = (ev as any).detail;
    const handler = storageKeys[`${updatedKey}::${CIVIL_LOCAL_STORAGE_EVENTS.UPDATE_ITEM}`];
    if (typeof handler === "function") {
      handler(updatedValue);
    }
    ev.stopPropagation();
  },
  false,
);

startLocalStorageUpdateBroadcast();

function areValuesEqual(prevValue: any, newValue: any): boolean {
  if (typeof prevValue === "object" && typeof newValue === "object") {
    let isEqual = prevValue === newValue;

    if (!isEqual) {
      const prevValueKeys = Object.keys(prevValue);
      const newValueKeys = Object.keys(newValue);

      if (prevValueKeys.length !== newValueKeys.length) {
        isEqual = false;
      } else {
        isEqual = true;
        for (const k of prevValueKeys) {
          if (prevValue[k] !== newValue[k]) {
            isEqual = false;
            break;
          }
        }
      }

      return isEqual;
    }
  }

  return prevValue === newValue;
}

export default function useStateWithLocalStorage(key: string, defaultValue?: any): [any, React.Dispatch<any>] {
  const [value, setStateValue] = React.useState(() => {
    try {
      const item = fetchItem(key);
      return item;
    } catch (err) {
      return defaultValue;
    }
  });

  const setValue = (newValue: any, skipLocalStorageUpdate?: boolean): void => {
    setStateValue(newValue);
    if (!skipLocalStorageUpdate) {
      if (typeof value === "undefined" || value === null) {
        removeItem(key);
      } else {
        setItem(key, newValue);
      }
    }
  };

  const refreshValueFromLocalStorage = (): void => {
    try {
      const item = fetchItem(key);
      setStateValue(item);
    } catch (err) {
      throw new Error(`Error refreshing state value from localStorage, key=${key}`);
    }
  };

  storageKeys[`${key}::${CIVIL_LOCAL_STORAGE_EVENTS.SET_ITEM}`] = (updatedValue: any): void => {
    if (!areValuesEqual(value, updatedValue)) {
      setStateValue(updatedValue);
    }
  };

  storageKeys[`${key}::${CIVIL_LOCAL_STORAGE_EVENTS.UPDATE_ITEM}`] = (updatedValue: any): void => {
    refreshValueFromLocalStorage();
  };

  return [value, setValue];
}
