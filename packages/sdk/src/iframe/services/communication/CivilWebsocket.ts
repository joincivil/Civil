import { PrivateChannel, PartnerRequest } from "./PrivateChannel";
import { SendTypes, SendEvent } from "./SendTypes";
import { RealtimeCommunication } from "./RealtimeCommunication";
import { ReceiveEvent } from "./ReceiveTypes";
import { Key } from "../keys/Key";

export class CivilWebsocket implements RealtimeCommunication {
  private url: string;
  private connection?: WebSocket;
  private subscribers: Array<(event: ReceiveEvent) => void> = [];

  private privateChannels: { [key: string]: PrivateChannel } = {};

  public constructor(url: string) {
    this.url = url;
  }
  public async openSecurePrivateChannelRaw(
    channelName: string,
    key: Key,
    message: string,
    userAgent: string,
  ): Promise<PrivateChannel> {
    if (!this.connection) {
      await this.initialize();
    }
    const chan = await PrivateChannel.NewPrivateChannel(this, channelName, key);
    const publicKeyString = await chan.getPublicKey();
    this.privateChannels[channelName] = chan;

    const fn = (event: any) => {
      if (event.type === SendTypes.PRIVATE_CHANNEL_MESSAGE) {
        chan.receiveEvent(event).catch(err => {
          console.log("error receiving event", err);
        });
      }
    };

    // TODO(dankins): this is a memory leak - make sure this get cleaned up when the channel is closed
    this.subscribers.push(fn);

    this.send({
      type: SendTypes.OPEN_SECURE_CHANNEL,
      data: {
        channelName,
        deviceID: key.getPublicKey(),
        publicKeyString,
        message,
        userAgent,
      },
    }).catch(err => {
      console.log("error sending event", err);
    });

    return this.privateChannels[channelName];
  }

  public async openSecurePrivateChannel(
    channelName: string,
    key: Key,
    message: string,
    userAgent: string,
    onJoinRequest: (request: PartnerRequest) => Promise<boolean>,
  ): Promise<PrivateChannel> {
    const channel = await this.openSecurePrivateChannelRaw(channelName, key, message, userAgent);

    // this will wait until the other party arrives
    const request = await channel.waitForPartner();
    const confirmationPromise = channel.waitForConfirmation();

    const shouldConfirm = await onJoinRequest(request);

    if (shouldConfirm) {
      await channel.confirmPartner(request.deviceID, request.publicKeyString);
    } else {
      throw new Error("rejected partner");
    }

    // wait for channel confirmation before
    await confirmationPromise;

    return channel;
  }

  public async waitForEvent(
    eventType: string,
    timeout: number,
    filter?: (event: ReceiveEvent) => Promise<boolean>,
  ): Promise<ReceiveEvent> {
    return new Promise((resolve, reject) => {
      const ts = setTimeout(() => reject(`wait for ${eventType} timed out after ${timeout} seconds`), timeout * 1000);
      const fn = (event: any) => {
        if (event.type === eventType) {
          if (filter) {
            if (filter(event)) {
              resolve(event);
            }
          }
          clearTimeout(ts);
          const subIdx = this.subscribers.indexOf(fn);
          this.subscribers.splice(subIdx, 1);
          resolve(event);
        }
      };
      this.subscribers.push(fn);
    });
  }

  public async send(event: SendEvent): Promise<any> {
    if (!this.connection) {
      await this.initialize();
    }
    this.connection!.send(JSON.stringify(event));
  }

  public async closeSecureChannel(channelName: string, deviceID: string): Promise<any> {
    return this.send({
      type: SendTypes.CLOSE_SECURE_CHANNEL,
      data: { channelName, deviceID },
    });
  }

  private async initialize(): Promise<void> {
    return new Promise(resolve => {
      this.connection = new WebSocket(this.url);

      this.connection.onmessage = event => {
        const data = JSON.parse(event.data);
        this.subscribers.map(sub => sub(data));
      };
      this.connection.onopen = (value: any) => resolve();
    });
  }
}
