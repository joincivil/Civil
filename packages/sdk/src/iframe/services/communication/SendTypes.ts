export interface SendEvent {
  type: SendTypes;
  data: SendEventData;
}

export type SendEventData = OpenSecureChannelEvent | PrivateChannelMessageType | CloseSecureChannelEvent;

export enum SendTypes {
  OPEN_SECURE_CHANNEL = "OPEN_SECURE_CHANNEL",
  CLOSE_SECURE_CHANNEL = "CLOSE_SECURE_CHANNEL",
  PRIVATE_CHANNEL_MESSAGE = "PRIVATE_CHANNEL_MESSAGE",
  CONFIRM_PARTNER = "CONFIRM_PARTNER",
}

export interface PrivateChannelMessageType {
  channelName: string;
  toDeviceID: string;
  type: string;
  data: any;
}

export interface OpenSecureChannelEvent {
  channelName: string;
  deviceID: string;
  publicKeyString: string;
  message: string;
  userAgent: string;
}

export interface CloseSecureChannelEvent {
  channelName: string;
  deviceID: string;
}

export interface PrivateChannelMessage {
  data: any;
}
