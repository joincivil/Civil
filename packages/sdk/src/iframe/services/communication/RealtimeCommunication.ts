import { PrivateChannel, PartnerRequest } from "./PrivateChannel";
import { ReceiveEvent } from "./ReceiveTypes";
import { SendEvent } from "./SendTypes";
import { Key } from "../keys/Key";

export interface RealtimeCommunication {
  openSecurePrivateChannel(
    channelName: string,
    deviceKey: Key,
    message: string,
    userAgent: string,
    onJoinRequest: (request: PartnerRequest) => Promise<boolean>,
  ): Promise<PrivateChannel>;
  closeSecureChannel(channelName: string, deviceID: string): Promise<any>;
  waitForEvent(eventType: string, timeout: number): Promise<ReceiveEvent>;
  send(event: SendEvent): Promise<any>;
}
