import * as ethers from "ethers";

export class PersistentKey {
  public static createRandom(): PersistentKey {
    const wallet = ethers.Wallet.createRandom();
    return PersistentKey.restore(wallet.privateKey);
  }
  public static restore(privateKey: string): PersistentKey {
    return new PersistentKey(privateKey);
  }

  private wallet: ethers.Wallet;

  public constructor(privateKey: string) {
    this.wallet = new ethers.Wallet(privateKey);
  }

  public getEthAddress(): string {
    return this.wallet.address;
  }

  public getPrivateKey(): string {
    return this.wallet.privateKey;
  }
}
