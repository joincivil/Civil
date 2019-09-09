import { KeyManager } from "./keys/KeyManager";
import * as responses from "./MessageHandlerTypes";
import { PartnerRequest } from "./communication/PrivateChannel";
import { SDKMessage, SDKMessageTypes } from "../../sdk/SDKMessage";

export interface MessageHandlerDependencies {
  keyManager: KeyManager;
}

export abstract class MessageHandler {
  private ready: boolean = false;
  private waitingMessages: SDKMessage[] = [];
  private depenencies?: MessageHandlerDependencies;

  public async initialize(initializer: () => Promise<MessageHandlerDependencies>): Promise<void> {
    const deps = await initializer();
    this.depenencies = deps;
    await Promise.all(this.waitingMessages.map(m => this.receive(m)));
    this.waitingMessages = [];
    this.ready = true;
  }

  public abstract reply(type: SDKMessageTypes, data: any): void;

  public async receive(message: SDKMessage): Promise<void> {
    if (!this.ready) {
      this.waitingMessages.push(message);
      return;
    }
    let response;
    switch (message.type) {
      case SDKMessageTypes.REGISTRY_GET_STATUS:
        response = this.handleGetStatus();
        break;
      case SDKMessageTypes.LOCKBOX_CREATE_KEY:
        response = await this.handleCreateKey(message.data.keyName);
        break;
      case SDKMessageTypes.LOCKBOX_GET_KEY:
        response = await this.handleGetKey(message.data.keyName);
        break;
      case SDKMessageTypes.LOCKBOX_SEND_DEVICE_ACTIVATION_REQUEST:
        response = await this.handleSendDeviceActivationRequest(message.data);
      case SDKMessageTypes.LOCKBOX_CONFIRM_DEVICE_ACTIVATION_REQUEST:
        response = await this.handleConfirmDeviceActivationRequest(message.data);
      default:
        console.error("unrecognized event type from parent", message.type);
    }

    this.reply(message.type, response);
  }

  private handleGetStatus(): any {
    return { alive: true };
  }

  private async handleCreateKey(keyName: string): Promise<responses.CreateOrGetAccountResponse> {
    const { keyManager } = this.depenencies!;
    const key = await keyManager.createPersistentKey(keyName);
    const response = { publicKey: key.getPublicKey() };

    return response;
  }

  private async handleGetKey(keyName: string): Promise<responses.CreateOrGetAccountResponse> {
    const { keyManager } = this.depenencies!;
    const key = await keyManager.getPersistentKey(keyName);
    const response = { publicKey: key.getPublicKey() };

    return response;
  }

  private async handleSendDeviceActivationRequest(data: any): Promise<responses.DeviceActivationResponse> {
    const { keyManager } = this.depenencies!;
    const response = await keyManager.sendDeviceActivationRequest(
      data.userID,
      data.keyName,
      data.message,
      data.userAgent,
    );
    return response;
  }

  private async handleConfirmDeviceActivationRequest(data: any): Promise<responses.DeviceActivationResponse> {
    const { keyManager } = this.depenencies!;
    const onJoinRequest = async (request: PartnerRequest) => {
      alert(JSON.stringify(request));
      return true;
    };
    const onKeyRequest = async (request: any) => {
      alert(JSON.stringify(request));
      return true;
    };
    const response = await keyManager.confirmDeviceActivationRequest(
      data.userID,
      data.keyName,
      data.message,
      data.userAgent,
      onJoinRequest,
      onKeyRequest,
    );
    return response;
  }
}

export class WindowMessageHandler extends MessageHandler {
  private parentURL: string;
  public constructor(parentURL: string) {
    super();
    this.parentURL = parentURL;
    parent.postMessage({ type: "ALIVE", data: {} }, this.parentURL);
  }
  public reply(type: SDKMessageTypes, data: any): void {
    parent.postMessage({ type: "REPLY_" + type, data }, this.parentURL);
  }
}
