import { SDKMessageTypes } from "../SDKMessage";

export type LockboxMessage =
  | LockboxCreateKey
  | LockboxGetKey
  | ConfirmDeviceActivationRequest
  | SendDeviceActivationRequest;

export interface LockboxCreateKey {
  type: SDKMessageTypes.LOCKBOX_CREATE_KEY;
  data: {
    keyName: string;
  };
}

export interface LockboxGetKey {
  type: SDKMessageTypes.LOCKBOX_GET_KEY;
  data: {
    keyName: string;
  };
}

export interface ConfirmDeviceActivationRequest {
  type: SDKMessageTypes.LOCKBOX_CONFIRM_DEVICE_ACTIVATION_REQUEST;
  data: {
    userID: string;
    keyName: string;
    message: string;
    userAgent: string;
  };
}

export interface SendDeviceActivationRequest {
  type: SDKMessageTypes.LOCKBOX_SEND_DEVICE_ACTIVATION_REQUEST;
  data: {};
}
