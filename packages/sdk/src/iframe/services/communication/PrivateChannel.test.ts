import { buildMockWebsocketServer } from "../../../test-utils/MockWebsocketServer";
import { CivilWebsocket } from "./CivilWebsocket";
import { PrivateChannel } from "./PrivateChannel";
import { SecurePrivateMessageTypes, SecureMessage } from "./SecureTypes";
import { Key } from "../keys/Key";

describe("PrivateChannel", () => {
  const mockURL = "ws://localhost:8080";
  let mobileKey: Key;
  let desktopKey: Key;
  const channelName = "alice-channel";
  let mobileComms: CivilWebsocket;
  let desktopComms: CivilWebsocket;
  let mockWebsocketServer: any;
  beforeEach(async () => {
    mobileKey = await Key.generate();
    desktopKey = await Key.generate();
    mockWebsocketServer = buildMockWebsocketServer(mockURL);
    mobileComms = new CivilWebsocket(mockURL);
    desktopComms = new CivilWebsocket(mockURL);
  });

  async function openChannel(): Promise<[PrivateChannel, PrivateChannel]> {
    const mobile = mobileComms.openSecurePrivateChannel(
      channelName,
      mobileKey,
      "mobile join message",
      "mobile user Agent",
      async () => true,
    );
    const desktop = desktopComms.openSecurePrivateChannel(
      channelName,
      desktopKey,
      "mobile join message",
      "mobile user Agent",
      async () => true,
    );

    return [await mobile, await desktop];
  }

  afterEach(async () => {
    mockWebsocketServer.stop();
  });

  it("should wait for secure events", async () => {
    const [mobile, desktop] = await openChannel();

    const waitPromise = desktop.waitForSecureMessage(SecurePrivateMessageTypes.TEXT_MESSAGE);
    await mobile.sendSecureMessage({
      type: SecurePrivateMessageTypes.TEXT_MESSAGE,
      data: {
        message: "hello, world",
      },
    });

    const result = await waitPromise;

    expect(result.type).toBe(SecurePrivateMessageTypes.TEXT_MESSAGE);
    expect(result.data.message).toBe("hello, world");
  });

  it("should use private communication", async () => {
    // open secure channel for mobile device
    const mobile = await mobileComms.openSecurePrivateChannelRaw(
      channelName,
      mobileKey,
      "mobile join message",
      "mobile user Agent",
    );
    // start promise for partner to arrive
    const waitForMobilePartnerPromise = mobile.waitForPartner();

    // open secure channel on desktop
    const desktop = await desktopComms.openSecurePrivateChannelRaw(
      channelName,
      desktopKey,
      "desktop join message",
      "desktop user Agent",
    );
    const waitForDesktopPartnerPromise = desktop.waitForPartner();

    // wait for devices to acknowledge each other
    const mobilePartner = await waitForMobilePartnerPromise;
    const desktopPartner = await waitForDesktopPartnerPromise;

    await mobile.confirmPartner(mobilePartner.deviceID, mobilePartner.publicKeyString);
    await desktop.confirmPartner(desktopPartner.deviceID, desktopPartner.publicKeyString);

    const desktopWaitForConfirmation = desktop.waitForConfirmation();
    const mobileWaitForConfirmation = mobile.waitForConfirmation();

    await Promise.all([desktopWaitForConfirmation, mobileWaitForConfirmation]);

    const messageEventPromise = desktop.waitForSecureMessage(SecurePrivateMessageTypes.TEXT_MESSAGE);
    await mobile.sendSecureMessage({
      type: SecurePrivateMessageTypes.TEXT_MESSAGE,
      data: {
        message: "hello, world",
      },
    });

    const result = await messageEventPromise;
    expect(result.type).toBe(SecurePrivateMessageTypes.TEXT_MESSAGE);
    expect(result.data.message).toBe("hello, world");
  });
});
