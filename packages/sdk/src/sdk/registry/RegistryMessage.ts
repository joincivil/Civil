import { SDKMessageTypes } from "../SDKMessage";

export type RegistryMessage = RegistryGetStatus;

export interface RegistryGetStatus {
  type: SDKMessageTypes.REGISTRY_GET_STATUS;
  data: {};
}
