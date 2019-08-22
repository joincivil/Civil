import { Persistence } from "./Persistence";
import { EncryptedData } from "../crypto/crypto";
import { Key } from "../keys/Key";
export class LockboxService {
  private data: Persistence;

  constructor(data: Persistence) {
    this.data = data;
  }

  public async store(key: Key, objectID: string, object: any): Promise<any> {
    const jsonString = JSON.stringify(object);
    return this.storeJson(key, objectID, jsonString);
  }

  public async storeJson(key: Key, objectID: string, jsonString: string): Promise<any> {
    const publicKey = key.getPublicKey();
    const signature = await key.sign(objectID);
    const ciphertext = await key.encrypt(jsonString);
    return this.data.store(publicKey, signature, objectID, ciphertext);
  }

  public async retrieve(key: Key, objectID: string): Promise<any> {
    const plaintext = await this.retrieveString(key, objectID);
    return JSON.parse(plaintext);
  }

  public async retrieveString(key: Key, objectID: string): Promise<any> {
    const publicKey = key.getPublicKey();
    const signature = await key.sign(objectID);
    const ciphertext: EncryptedData = await this.data.retrieve(publicKey, signature, objectID);
    return key.decrypt(ciphertext);
  }

  public async delete(key: Key, objectID: string): Promise<string> {
    const publicKey = key.getPublicKey();
    const signature = await key.sign(objectID);
    return this.data.delete(publicKey, signature, objectID);
  }

  public async selfDestruct(key: Key): Promise<string> {
    const publicKey = key.getPublicKey();
    const signature = await key.sign("self-destruct");
    return this.data.selfDestruct(publicKey, signature);
  }
}
