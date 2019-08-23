import { Key } from "./Key";
import * as KeyUtils from "./KeyUtils";
import { LockboxService } from "../civil-node/LockboxService";
import { SecurePrivateMessageTypes, ActivateDeviceRequest } from "../communication/SecureTypes";
import { RealtimeCommunication } from "../communication/RealtimeCommunication";
import { PartnerRequest } from "../communication/PrivateChannel";

export class KeyManager {
  public static async initialize(lockbox: LockboxService, comms: RealtimeCommunication): Promise<KeyManager> {
    const deviceKey = await KeyUtils.getOrCreateDeviceKey();
    return new KeyManager(lockbox, comms, deviceKey);
  }

  private lockbox: LockboxService;
  private comms: RealtimeCommunication;
  private deviceKey: Key;
  private loadedKeys: { [keyName: string]: Key } = {};
  public constructor(lockbox: LockboxService, comms: RealtimeCommunication, deviceKey: Key) {
    this.lockbox = lockbox;
    this.comms = comms;
    this.deviceKey = deviceKey;
  }

  public async createPersistentKey(keyName: string): Promise<Key> {
    // generate a new persistence key
    const key = await Key.generate();
    const objectID = `key|${keyName}`;
    const jsonString = await key.toJson();

    await this.lockbox.storeJson(this.deviceKey, objectID, jsonString);
    this.loadedKeys[keyName] = key;

    return key;
  }

  public async getPersistentKey(keyName: string): Promise<Key> {
    if (this.loadedKeys[keyName]) {
      return this.loadedKeys[keyName];
    }
    const objectID = `key|${keyName}`;
    const keyJson = await this.lockbox.retrieveString(this.deviceKey, objectID);
    return Key.fromJson(keyJson);
  }

  public async sendDeviceActivationRequest(
    userID: string,
    keyName: string,
    message: string,
    userAgent: string,
  ): Promise<any> {
    const channel = await this.comms.openSecurePrivateChannel(
      userID,
      this.deviceKey,
      message,
      userAgent,
      async () => true,
    );

    console.log("sending ACTIVATE_DEVICE_REQUEST");
    await channel.sendSecureMessage({
      type: SecurePrivateMessageTypes.ACTIVATE_DEVICE_REQUEST,
      data: { keyName },
    });

    console.log("waiting for ACTIVATE_DEVICE_RESPONSE");
    const response = await channel.waitForSecureMessage(SecurePrivateMessageTypes.ACTIVATE_DEVICE_RESPONSE);
    const { keyJson } = response.data;
    const storageKey = `key|${keyName}`;
    await this.lockbox.store(this.deviceKey, storageKey, keyJson);
    this.loadedKeys[keyName] = await Key.fromJson(keyJson);

    return this.loadedKeys[keyName];
  }

  public async confirmDeviceActivationRequest(
    userID: string,
    keyName: string,
    message: string,
    userAgent: string,
    onJoinRequest: (request: PartnerRequest) => Promise<boolean>,
    onKeyRequest: (request: ActivateDeviceRequest) => Promise<boolean>,
  ): Promise<any> {
    const channel = await this.comms.openSecurePrivateChannel(
      userID,
      this.deviceKey,
      message,
      userAgent,
      onJoinRequest,
    );

    const event: ActivateDeviceRequest = await channel.waitForSecureMessage(
      SecurePrivateMessageTypes.ACTIVATE_DEVICE_REQUEST,
    );
    try {
      const approve = await onKeyRequest(event);
      if (approve) {
        const key = await this.getPersistentKey(keyName);

        await channel.sendSecureMessage({
          type: SecurePrivateMessageTypes.ACTIVATE_DEVICE_RESPONSE,
          data: {
            keyName,
            keyJson: await key.toJson(),
          },
        });
      } else {
        await channel.sendSecureMessage({
          type: SecurePrivateMessageTypes.ACTIVATE_DEVICE_DENIED,
          data: {
            reason: "owner denied request",
          },
        });
      }
    } catch (err) {
      console.log("error", err);
      await channel.sendSecureMessage({
        type: SecurePrivateMessageTypes.ACTIVATE_DEVICE_DENIED,
        data: {
          reason: "key does not exist on device",
        },
      });
    }
  }

  public async selfDestruct(): Promise<boolean> {
    KeyUtils.deleteDeviceCookie();
    await this.lockbox.selfDestruct(this.deviceKey);

    return true;
  }
}
