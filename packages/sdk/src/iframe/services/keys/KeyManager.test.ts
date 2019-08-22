import Cookies from "js-cookie";
import { randomString } from "../../../test-utils/helpers";

import { KeyManager } from "./KeyManager";
import { InMemoryPersistence, Persistence } from "../civil-node/Persistence";
import { LockboxService } from "../civil-node/LockboxService";
import { RealtimeCommunication } from "../communication/RealtimeCommunication";
import { PrivateChannel } from "../communication/PrivateChannel";
import { SecurePrivateMessageTypes } from "../communication/SecureTypes";
import { Key } from "./Key";
import { DEVICE_ID_COOKIE_NAME } from "./KeyUtils";

jest.mock("../communication/PrivateChannel");

describe("KeyManager", () => {
  let persistence: Persistence;
  let lockbox: LockboxService;
  let keyManager: KeyManager;
  let keyName: string;
  let RealtimeCommunicationMock: any;
  let deviceKey: Key;
  let userID: string;
  let sendSecureMessageMock: jest.Mock;
  let waitForSecureMessageMock: jest.Mock;
  beforeEach(async () => {
    keyName = randomString();
    persistence = new InMemoryPersistence();
    deviceKey = await Key.generate();
    userID = randomString();
    sendSecureMessageMock = jest.fn();
    waitForSecureMessageMock = jest.fn();

    // @ts-ignore
    PrivateChannel.mockImplementation(() => {
      return {
        sendSecureMessage: sendSecureMessageMock,
        waitForSecureMessage: waitForSecureMessageMock,
      };
    });

    RealtimeCommunicationMock = jest.fn<RealtimeCommunication, any[]>(() => ({
      // @ts-ignore
      openSecurePrivateChannel: jest.fn().mockReturnValue(new PrivateChannel()),
      closeSecureChannel: jest.fn(),
      waitForEvent: jest.fn(),
      send: jest.fn(),
    }));
    lockbox = new LockboxService(persistence);
    expect(Cookies.get(DEVICE_ID_COOKIE_NAME)).not.toBeDefined();
    keyManager = await new KeyManager(lockbox, new RealtimeCommunicationMock(), deviceKey);
  });

  afterEach(() => {
    Cookies.remove(DEVICE_ID_COOKIE_NAME);
  });

  it("should save the device key into `key|device`", async () => {
    expect(Cookies.get(DEVICE_ID_COOKIE_NAME)).not.toBeDefined();
    await KeyManager.initialize(lockbox, new RealtimeCommunicationMock());
    expect(Cookies.get(DEVICE_ID_COOKIE_NAME)).toBeDefined();
  });

  it("should delete burner key", async () => {
    const k1Name = randomString();
    await keyManager.createPersistentKey(k1Name);

    keyManager.selfDestruct();
    expect(Cookies.get(DEVICE_ID_COOKIE_NAME)).not.toBeDefined();
  });

  it("should list available persistent keys on the device", async () => {});
  it("should create a new persistent key", async () => {
    const text = randomString();
    const key = await keyManager.createPersistentKey(keyName);
    const encrypted = await key.encrypt(text);
    const plaintext = await key.decrypt(encrypted);
    expect(plaintext).toEqual(text);
  });

  it("should request a persistent key from another device", async () => {
    const k1 = await Key.generate();
    const k1Json = await k1.toJson();
    const randomKeyName = randomString();
    waitForSecureMessageMock.mockReturnValue({
      type: SecurePrivateMessageTypes.ACTIVATE_DEVICE_RESPONSE,
      data: { keyName: randomKeyName, keyJson: k1Json },
    });
    const result = await keyManager.sendDeviceActivationRequest(
      userID,
      randomKeyName,
      "test message",
      "test user agent",
    );

    expect(result).toEqual(k1);

    const loaded = await keyManager.getPersistentKey(randomKeyName);
    expect(loaded).toStrictEqual(result);
  });
  it("should approve a persistent key request", async () => {
    const randomKeyName = randomString();
    const k1 = await keyManager.createPersistentKey(randomKeyName);
    const k1Json = await k1.toJson();

    waitForSecureMessageMock.mockReturnValue({
      type: SecurePrivateMessageTypes.ACTIVATE_DEVICE_REQUEST,
      data: { keyName: randomKeyName },
    });

    const onKeyRequest = jest.fn().mockReturnValue(true);

    await keyManager.confirmDeviceActivationRequest(
      userID,
      randomKeyName,
      "test",
      "test user agent",
      jest.fn(),
      onKeyRequest,
    );

    expect(onKeyRequest).toHaveBeenCalledWith({
      data: { keyName: randomKeyName },
      type: SecurePrivateMessageTypes.ACTIVATE_DEVICE_REQUEST,
    });

    await expect(sendSecureMessageMock).toHaveBeenCalledWith({
      data: {
        keyJson: k1Json,
        keyName: randomKeyName,
      },
      type: SecurePrivateMessageTypes.ACTIVATE_DEVICE_RESPONSE,
    });
  });
  it("should reject a persistent key request", async () => {
    const randomKeyName = randomString();
    const k1 = await keyManager.createPersistentKey(randomKeyName);
    const k1Json = await k1.toJson();

    waitForSecureMessageMock.mockReturnValue({
      type: SecurePrivateMessageTypes.ACTIVATE_DEVICE_REQUEST,
      data: { keyName: randomKeyName },
    });

    const onKeyRequest = jest.fn().mockReturnValue(false);

    await keyManager.confirmDeviceActivationRequest(
      userID,
      randomKeyName,
      "test",
      "test user agent",
      jest.fn(),
      onKeyRequest,
    );

    expect(onKeyRequest).toHaveBeenCalledWith({
      data: { keyName: randomKeyName },
      type: SecurePrivateMessageTypes.ACTIVATE_DEVICE_REQUEST,
    });

    await expect(sendSecureMessageMock).toHaveBeenCalledWith({
      data: {
        reason: "owner denied request",
      },
      type: SecurePrivateMessageTypes.ACTIVATE_DEVICE_DENIED,
    });
  });

  it("should retrieve a persistent key from the lockbox", async () => {
    const k1 = await keyManager.createPersistentKey(keyName);
    const spy = jest.spyOn(lockbox, "retrieveString");
    const newKeyManager = await new KeyManager(lockbox, new RealtimeCommunicationMock(), deviceKey);

    const k1RetrieveA = await keyManager.getPersistentKey(keyName);
    expect(spy).not.toHaveBeenCalled();
    const k1RetrieveB = await newKeyManager.getPersistentKey(keyName);
    expect(k1).toEqual(k1RetrieveA);
    expect(k1).toEqual(k1RetrieveB);
    expect(spy).toHaveBeenCalledWith(deviceKey, `key|${keyName}`);
  });
});
