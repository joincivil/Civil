import { MessageHandler } from "./MessageHandler";
import { KeyManager } from "./keys/KeyManager";
import { InMemoryPersistence, Persistence } from "./civil-node/Persistence";
import { LockboxService } from "./civil-node/LockboxService";
import { randomString } from "../../test-utils/helpers";
import { CivilWebsocket } from "./communication/CivilWebsocket";
import { Key } from "./keys/Key";
import { SDKMessageTypes } from "../../sdk/SDKMessage";

jest.mock("./communication/CivilWebsocket");

export class SpyMessageHandler extends MessageHandler {
  public replies: IMessage[] = [];
  public reply(type: any, data: any) {
    this.replies.push({ type, data });
  }
}

describe("MessageHandler", () => {
  let handler: any;
  let data: Persistence;
  let lockbox: LockboxService;
  let deviceKey: Key;
  let userID: string;
  beforeEach(async () => {
    userID = randomString();
    data = new InMemoryPersistence();
    lockbox = new LockboxService(data);
    deviceKey = await Key.generate();

    handler = new SpyMessageHandler();
    handler.initialize(() => {
      return {
        keyManager: new KeyManager(lockbox, new CivilWebsocket("xx"), deviceKey),
      };
    });
  });

  it("should handle REGISTRY_GET_STATUS", async () => {
    const message = {
      type: SDKMessageTypes.REGISTRY_GET_STATUS,
      data: {},
    };
    await handler.receive(message);

    expect(handler.replies).toEqual([{ type: "REGISTRY_GET_STATUS", data: { alive: true } }]);
  });

  it("should handle LOCKBOX_CREATE_KEY", async () => {
    const message = {
      type: SDKMessageTypes.LOCKBOX_CREATE_KEY,
      data: {},
    };
    await handler.receive(message);

    expect(handler.replies.length).toBe(1);
    const reply = handler.replies[0];
    expect(reply.type).toBe("LOCKBOX_CREATE_KEY");
  });
});
