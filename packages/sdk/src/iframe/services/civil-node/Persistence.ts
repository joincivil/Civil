export interface Persistence {
  retrieve(publicKey: string, signature: string, objectID: string): Promise<any>;
  store(publicKey: string, signature: string, objectID: string, data: any): Promise<any>;
  delete(publicKey: string, signature: string, objectID: string): Promise<any>;
  // deletes all data for user;
  selfDestruct(publicKey: string, signature: string): Promise<any>;
}

export class InMemoryPersistence implements Persistence {
  private database: { [publicKey: string]: { [key: string]: any } } = {};
  public async store(publicKey: string, signature: string, objectID: string, data: any): Promise<any> {
    if (!this.database[publicKey]) {
      this.database[publicKey] = {};
    }

    this.database[publicKey][objectID] = data;
  }
  public async retrieve(publicKey: string, signature: string, objectID: string): Promise<any> {
    return this.database[publicKey][objectID];
  }
  public async delete(publicKey: string, signature: string, objectID: string): Promise<any> {
    delete this.database[publicKey][objectID];
  }

  public async selfDestruct(publicKey: string, signature: string): Promise<any> {
    delete this.database[publicKey];
  }
}
