import Cookies from "js-cookie";
import { Key } from "./Key";

export const DEVICE_KEYNAME = "device";
export const DEVICE_ID_COOKIE_NAME = `key|${DEVICE_KEYNAME}`;

export async function getOrCreateDeviceKey(): Promise<Key> {
  let json = Cookies.get(`key|device`);
  if (json) {
    return Key.fromJson(json);
  }

  const deviceKey = await Key.generate();
  json = await deviceKey.toJson();
  Cookies.set(`key|device`, json);
  return deviceKey;
}

export function deleteDeviceCookie(): void {
  Cookies.remove(`key|device`);
}
