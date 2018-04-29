import { Uri, StorageHeader } from "../types";
import { ContentProvider } from "./contentprovider";
// tslint:disable-next-line
import * as IPFS from "ipfs-api";
import { hashContent, promisify } from "@joincivil/utils";

const ipfs = new IPFS({ host: "ipfs.infura.io", port: 5001, protocol: "https" });

const ipfsAsync = {
  get: promisify<[{ path: string; content: Buffer }]>(ipfs.get),
  add: promisify<[{ path: string; hash: string; size: number }]>(ipfs.add),
};

export interface IpfsStorageHeader extends StorageHeader {
  ipfsHash: string;
}

export class IPFSProvider implements ContentProvider {
  public scheme(): string {
    return "ipfs";
  }

  public async get(what: Uri | StorageHeader): Promise<string> {
    let uri = "";
    if (typeof what !== "string") {
      uri = what.uri;
    } else {
      uri = what;
    }
    uri = uri.replace("ipfs://", "/ipfs/");
    return (await ipfsAsync.get(uri)).reduce((acc, file) => acc + file.content.toString("utf8"), "");
  }

  public async put(content: string): Promise<IpfsStorageHeader> {
    const files = await ipfsAsync.add(Buffer.from(content));
    return {
      uri: this.scheme() + "://" + files[0].path,
      ipfsHash: files[0].hash,
      contentHash: hashContent(content),
    };
  }
}
