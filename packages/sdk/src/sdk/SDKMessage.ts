import { LockboxMessage } from "./lockbox/LockboxMessage";
import { RegistryMessage } from "./registry/RegistryMessage";
export type SDKMessage = LockboxMessage | RegistryMessage;

export enum SDKMessageTypes {
  LOCKBOX_CONFIRM_DEVICE_ACTIVATION_REQUEST = "LOCKBOX_CONFIRM_DEVICE_ACTIVATION_REQUEST",
  LOCKBOX_SEND_DEVICE_ACTIVATION_REQUEST = "LOCKBOX_SEND_DEVICE_ACTIVATION_REQUEST",
  LOCKBOX_CREATE_KEY = "LOCKBOX_CREATE_KEY",
  LOCKBOX_GET_KEY = "LOCKBOX_GET_KEY",
  REGISTRY_GET_STATUS = "REGISTRY_GET_STATUS",
}
