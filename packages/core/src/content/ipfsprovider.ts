import { StorageHeader } from "../types";
import { ContentProvider } from "./contentprovider";
// tslint:disable-next-line
import * as IPFS from "ipfs-http-client";
import { hashContent, promisify } from "@joincivil/utils";

const ipfs = new IPFS({ host: "ipfs.infura.io", port: 5001, protocol: "https" });

const ipfsAsync = {
  get: promisify<[{ path: string; content: Buffer }]>(ipfs.get),
  add: promisify<[{ path: string; hash: string; size: number }]>(ipfs.add),
  pin: promisify<[{ hash: string }]>(ipfs.pin.add),
};

export interface IpfsStorageHeader extends StorageHeader {
  ipfsHash: string;
}

export class IPFSProvider implements ContentProvider {
  public scheme(): string {
    return "ipfs";
  }

  public async get(what: StorageHeader): Promise<string> {
    let uri = what.uri;
    uri = uri.replace("ipfs://", "/ipfs/");
    return (await ipfsAsync.get(uri)).reduce((acc, file) => acc + file.content.toString("utf8"), "");
  }

  public async put(content: string, options?: { hash: string }): Promise<IpfsStorageHeader> {
    const files = await ipfsAsync.add(Buffer.from(content), options);
    await ipfsAsync.pin(files[0].hash);
    return {
      uri: this.scheme() + "://" + files[0].path,
      ipfsHash: files[0].hash,
      contentHash: hashContent(content),
    };
  }
}
