export enum SecurePrivateMessageTypes {
  TEXT_MESSAGE = "TEXT_MESSAGE",
  ACTIVATE_DEVICE_REQUEST = "ACTIVATE_DEVICE_REQUEST",
  ACTIVATE_DEVICE_RESPONSE = "ACTIVATE_DEVICE_RESPONSE",
  ACTIVATE_DEVICE_DENIED = "ACTIVATE_DEVICE_DENIED",
}

export type SecureMessageData = ActivateDeviceRequest | TextMessage | ActivateDeviceResponse | ActivateDeviceDenied;

export interface SecureMessage {
  type: SecurePrivateMessageTypes;
  data: SecureMessageData;
}

export interface ActivateDeviceRequest {
  keyName: string;
}

export interface ActivateDeviceResponse {
  keyName: string;
  keyJson: string;
}
export interface ActivateDeviceDenied {
  reason: string;
}

export interface TextMessage {
  message: string;
}
