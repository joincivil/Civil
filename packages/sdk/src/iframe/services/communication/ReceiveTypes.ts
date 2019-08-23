export enum ReceiveTypes {
  OPEN_SECURE_CHANNEL_RESPONSE = "OPEN_SECURE_CHANNEL_RESPONSE",
  REQUEST_TO_JOIN_CHANNEL = "REQUEST_TO_JOIN_CHANNEL",
  PRIVATE_CHANNEL_MESSAGE = "PRIVATE_CHANNEL_MESSAGE",
}

export interface ReceiveEvent {
  type: ReceiveTypes;
  data: ReceiveEventData;
}

type ReceiveEventData = any;
