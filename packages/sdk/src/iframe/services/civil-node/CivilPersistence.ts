import { Persistence } from "./Persistence";
import { EncryptedData } from "../crypto/crypto";

export class CivilPersistence implements Persistence {
  private url: string;
  public constructor(url: string) {
    this.url = url;
  }
  public async store(publicKey: string, signature: string, objectID: string, data: EncryptedData): Promise<any> {
    const request = {
      publicKey,
      signature,
      objectID,
      data,
    };

    return fetch(`${this.url}/lockbox/store`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });
  }
  public async retrieve(publicKey: string, signature: string, objectID: string): Promise<EncryptedData> {
    const result = await fetch(`${this.url}/lockbox/retrieve`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        publicKey,
        signature,
        objectID,
      }),
    });

    if (result.status === 404) {
      throw new Error("key not found");
    }

    const json = await result.json();
    return (json as any) as EncryptedData;
  }
  public async delete(publicKey: string, signature: string, objectID: string): Promise<any> {
    // delete this.database[publicKey][objectID];
  }

  public async selfDestruct(publicKey: string, signature: string): Promise<any> {
    // delete this.database[publicKey];
  }
}
