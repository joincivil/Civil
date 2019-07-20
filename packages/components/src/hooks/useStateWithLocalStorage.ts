import * as React from "react";
import { fetchItem, setItem, removeItem, CIVIL_LOCAL_STORAGE_EVENTS } from "@joincivil/utils";

const storageKeys: any = {};

window.addEventListener(
  CIVIL_LOCAL_STORAGE_EVENTS.SET_ITEM,
  ev => {
    const { key: updatedKey, value: updatedValue } = (ev as any).detail;
    const handler = storageKeys[`${updatedKey}::${CIVIL_LOCAL_STORAGE_EVENTS.SET_ITEM}`];
    if (handler) {
      handler(updatedValue);
    }
  },
  false,
);

// window.addEventListener(CIVIL_LOCAL_STORAGE_EVENTS.UPDATE_ITEM, (ev) => {
//   const { key: updatedKey, value: updatedValue } = (ev as any).detail;
//   const handler = storageKeys[`${updatedKey}::${CIVIL_LOCAL_STORAGE_EVENTS.UPDATE_ITEM}`];
//   if (typeof handler === "function") {
//     console.log("single event handler, do the thing");
//     handler(updatedValue);
//   }
// }, false);

export default function useStateWithLocalStorage(key: string): [any, React.Dispatch<any>] {
  const [value, setValue] = React.useState(() => {
    const item = fetchItem(key);
    return item;
  });

  React.useEffect(
    () => {
      if (typeof value === "undefined") {
        console.log("removing");
        removeItem(key);
      } else {
        setItem(key, value);
      }
    },
    [value],
  );

  /*
  const setValue = (newValue: any, skipLocalStorageUpdate?: boolean): void => {
    console.log("check vals", newValue, value, skipLocalStorageUpdate);
    setStateValue(newValue);
    if (!skipLocalStorageUpdate) {
      console.log("put state value into localstorage", key, newValue);
      if (typeof value === "undefined") {
        removeItem(key);
      } else {
        setItem(key, newValue);
      }
    } else {
      console.log("skip put state value into localstorage", key, newValue);
    }
  };
   */

  storageKeys[`${key}::${CIVIL_LOCAL_STORAGE_EVENTS.SET_ITEM}`] = (updatedValue: any): void => {
    if (updatedValue !== value) {
      console.log("setValue()", updatedValue);
      setValue(updatedValue);
    }
  };

  /*
  storageKeys[`${key}::${CIVIL_LOCAL_STORAGE_EVENTS.UPDATE_ITEM}`] = (updatedValue: any): void => {
    const newValue = fetchItem(key);
    setValue(newValue, true);
    console.log("setValue() refreshed from localStorage", newValue, true);
  };
   */

  return [value, setValue];
}
