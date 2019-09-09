import {
  EncryptedData,
  encrypt,
  decrypt,
  alg,
  authAlg,
  generateEncryptionKey,
  generateAuthKey,
  arrayBufferToBase64,
  base64ToArrayBuffer,
  sign,
} from "../crypto/crypto";
const crypto = window.crypto;

export class Key {
  public static async generate(): Promise<Key> {
    const encryptKey = await generateEncryptionKey();

    const authKey = await generateAuthKey();

    const authPublicKey = arrayBufferToBase64(await crypto.subtle.exportKey("spki", authKey.publicKey));

    return new Key(encryptKey, authKey.privateKey, authKey.publicKey, authPublicKey);
  }

  public static async fromJson(json: string): Promise<Key> {
    const data = JSON.parse(json);

    const encryptKey = crypto.subtle.importKey("jwk", data.encryptJwk, alg, true, ["encrypt", "decrypt"]);
    const authPrivateKey = crypto.subtle.importKey("pkcs8", base64ToArrayBuffer(data.authPrivateKey), authAlg, true, [
      "sign",
    ]);

    const authPublicKey = crypto.subtle.importKey("spki", base64ToArrayBuffer(data.authPublicKey), authAlg, true, [
      "verify",
    ]);

    return new Key(await encryptKey, await authPrivateKey, await authPublicKey, data.authPublicKey);
  }

  private encryptKey: CryptoKey;
  private authPrivateKey: CryptoKey;
  private authPublicKey: CryptoKey;
  private publicKeyString: string;

  public constructor(
    encryptKey: CryptoKey,
    authPrivateKey: CryptoKey,
    authPublicKey: CryptoKey,
    publicKeyString: string,
  ) {
    this.encryptKey = encryptKey;
    this.authPrivateKey = authPrivateKey;
    this.authPublicKey = authPublicKey;
    this.publicKeyString = publicKeyString;
  }

  public async toJson(): Promise<string> {
    const encryptJwk = await crypto.subtle.exportKey("jwk", this.encryptKey);
    const authPrivateBuffer = await crypto.subtle.exportKey("pkcs8", this.authPrivateKey);
    const authPublicKey = await crypto.subtle.exportKey("spki", this.authPublicKey);

    return JSON.stringify({
      encryptJwk,
      authPrivateKey: arrayBufferToBase64(authPrivateBuffer),
      authPublicKey: arrayBufferToBase64(authPublicKey),
    });
  }

  public getPublicKey(): string {
    return this.publicKeyString;
  }

  public async encrypt(plaintext: string): Promise<EncryptedData> {
    return encrypt(plaintext, this.encryptKey);
  }
  public async sign(message: string): Promise<string> {
    return sign(message, this.authPrivateKey);
  }

  public async decrypt(data: EncryptedData): Promise<string> {
    return decrypt(data, this.encryptKey);
  }
}
