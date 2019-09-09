import { DMZ } from "../dmz/DMZ";
import { SDKMessageTypes } from "../SDKMessage";

export class Registry {
  private dmz: DMZ;
  constructor(dmz: DMZ) {
    this.dmz = dmz;
  }

  public async getRegistryStatus(): Promise<any> {
    await this.dmz.send({ type: SDKMessageTypes.REGISTRY_GET_STATUS, data: {} });

    return "ok";
  }
}
