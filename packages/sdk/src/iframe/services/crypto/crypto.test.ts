import { publicKeyToString, publicKeyFromString, sign, verify, generateAuthKey } from "./crypto";

describe("crypto", () => {
  it("should rehydrate a public key", async () => {
    const key = await generateAuthKey();
    const string = await publicKeyToString(key);
    const pubKey = await publicKeyFromString(string, false);

    const message = "hello world";
    const signature = await sign(message, key.privateKey);

    const verified = await verify(message, signature, pubKey);

    expect(verified).toBeTruthy();
  });
});
