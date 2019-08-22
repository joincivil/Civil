import { DMZ } from "../dmz/DMZ";
import { SDKMessageTypes } from "../SDKMessage";

export class Lockbox {
  private dmz: DMZ;
  constructor(dmz: DMZ) {
    this.dmz = dmz;
  }

  public async confirmDeviceActivationRequest(): Promise<void> {
    return this.dmz.send({
      type: SDKMessageTypes.LOCKBOX_CONFIRM_DEVICE_ACTIVATION_REQUEST,
      data: {
        userID: "dan",
        keyName: "civil",
        message: "please gimme the loot",
        userAgent: navigator.userAgent,
      },
    });
  }
  public async createKey(keyName: string): Promise<void> {
    return this.dmz.send({
      type: SDKMessageTypes.LOCKBOX_CREATE_KEY,
      data: {
        keyName,
      },
    });
  }

  public async getKey(keyName: string): Promise<void> {
    return this.dmz.send({
      type: SDKMessageTypes.LOCKBOX_GET_KEY,
      data: {
        keyName,
      },
    });
  }

  public async sendDeviceActivationRequest(): Promise<void> {
    return this.dmz.send({
      type: SDKMessageTypes.LOCKBOX_SEND_DEVICE_ACTIVATION_REQUEST,
      data: {
        userID: "dan",
        keyName: "civil",
        message: "please gimme the loot",
        userAgent: navigator.userAgent,
      },
    });
  }
}
