import { CivilWebsocket } from "./CivilWebsocket";
import { SendTypes } from "./SendTypes";
import { ReceiveTypes } from "./ReceiveTypes";
import { SecurePrivateMessageTypes, SecureMessage } from "./SecureTypes";
import {
  generateECDHKey,
  derivePartnerKey,
  publicKeyFromString,
  encrypt,
  decrypt,
  publicKeyToString,
} from "../crypto/crypto";
import { Key } from "../keys/Key";

export interface PartnerRequest {
  deviceID: string;
  publicKeyString: string;
  message: string;
  userAgent: string;
}

export enum PrivateMessageTypes {
  CONFIRM_PARTNER = "CONFIRM_PARTNER",
  SECURE_MESSAGE = "SECURE_MESSAGE",
}

export class PrivateChannel {
  public static async NewPrivateChannel(
    websocket: CivilWebsocket,
    channelName: string,
    deviceKey: Key,
  ): Promise<PrivateChannel> {
    const secretKey = await generateECDHKey();

    return new PrivateChannel(websocket, channelName, deviceKey, secretKey);
  }

  private websocket: CivilWebsocket;
  private channelName: string;
  private deviceKey: Key;
  private secretKey: CryptoKeyPair;
  private sharedKey?: CryptoKey;
  private partnerDeviceID?: string;
  private ready: boolean = false;

  constructor(websocket: CivilWebsocket, channelName: string, deviceKey: Key, secretKey: CryptoKeyPair) {
    this.websocket = websocket;
    this.channelName = channelName;
    this.deviceKey = deviceKey;
    this.secretKey = secretKey;
    this.ready = false;
  }

  public async waitForPartner(): Promise<PartnerRequest> {
    const response = await this.websocket.waitForEvent(ReceiveTypes.REQUEST_TO_JOIN_CHANNEL, 100);

    return {
      deviceID: response.data.deviceID,
      publicKeyString: response.data.publicKeyString,
      message: response.data.message,
      userAgent: response.data.userAgent,
    };
  }

  public async waitForEvent(
    type: PrivateMessageTypes,
    timeoutSeconds?: number,
    filter?: (e: any) => Promise<boolean>,
  ): Promise<any> {
    const eventFilter = filter ? filter : () => Promise.resolve(true);
    return this.websocket.waitForEvent(
      ReceiveTypes.PRIVATE_CHANNEL_MESSAGE,
      timeoutSeconds || 120,
      async e => (e.data as any).channelName === this.channelName && e.data.type === type && eventFilter(e.data),
    );
  }

  public async waitForSecureMessage(type: SecurePrivateMessageTypes, timeoutSeconds?: number): Promise<any> {
    const filter = async (e: any) => {
      const enc = e.data;
      const decrypted = await this.decryptMessage(enc.iv, enc.ciphertext);
      return decrypted.type === type;
    };
    const event = await this.waitForEvent(PrivateMessageTypes.SECURE_MESSAGE, timeoutSeconds || 120, filter);

    const encrypted = event.data.data;
    return this.decryptMessage(encrypted.iv, encrypted.ciphertext);
  }

  public async receiveEvent(data: any): Promise<any> {
    // console.log("receiveEvent", this.deviceID, data);
  }

  public async confirmPartner(partnerDeviceID: string, parterPublicKeyString: string): Promise<any> {
    this.partnerDeviceID = partnerDeviceID;
    await this.setSharedKey(parterPublicKeyString);
    const publicKeyString = await this.getPublicKey();
    await this.send(PrivateMessageTypes.CONFIRM_PARTNER, {
      deviceID: this.deviceKey.getPublicKey(),
      publicKeyString,
    });
    return true;
  }

  public async waitForConfirmation(): Promise<any> {
    const event = await this.waitForEvent(PrivateMessageTypes.CONFIRM_PARTNER);
    await this.setSharedKey(event.data.data.publicKeyString);
  }

  public async sendSecureMessage(message: SecureMessage): Promise<any> {
    if (!this.ready) {
      throw new Error("secure channel not yet established");
    }
    const jsonString = JSON.stringify(message);
    const encrypted = await encrypt(jsonString, this.sharedKey!);
    return this.send(PrivateMessageTypes.SECURE_MESSAGE, encrypted);
  }

  public async getPublicKey(): Promise<string> {
    return publicKeyToString(this.secretKey);
  }

  private async decryptMessage(iv: string, ciphertext: string): Promise<SecureMessage> {
    const jsonString = await decrypt({ iv, ciphertext }, this.sharedKey!);
    return JSON.parse(jsonString);
  }

  private async setSharedKey(parterPublicKeyString: string): Promise<void> {
    const partnerPublicKey = await publicKeyFromString(parterPublicKeyString, true);
    this.sharedKey = await derivePartnerKey(this.secretKey.privateKey, partnerPublicKey);
    this.ready = true;
  }

  private async send(type: PrivateMessageTypes, data: any): Promise<any> {
    if (!this.partnerDeviceID) {
      throw new Error("partner has not joined yet");
    }
    await this.websocket.send({
      type: SendTypes.PRIVATE_CHANNEL_MESSAGE,
      data: {
        channelName: this.channelName,
        toDeviceID: this.partnerDeviceID,
        type,
        data,
      },
    });
  }
}
