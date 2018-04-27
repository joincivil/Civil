import { ContentHeader, Uri } from "../types";
import { ContentProvider } from "./contentprovider";
// tslint:disable-next-line
import * as IPFS from "ipfs-api";
const ipfs = new IPFS({ host: "ipfs.infura.io", port: 5001, protocol: "https" });

export class IPFSProvider implements ContentProvider {
  public scheme(): string {
    return "ipfs";
  }

  public async get(what: Uri | ContentHeader): Promise<string> {
    let uri = "";
    if (typeof what !== "string") {
      uri = what.uri;
    } else {
      uri = what;
    }
    uri = uri.replace("ipfs://", "/ipfs/");
    return new Promise<string>((resolve, reject) => {
      ipfs.get(uri, (err: any, files: any) => {
        let content: string = "";
        files.forEach((file: any) => {
          content += file.content.toString("utf8");
        });
        console.log(err, content);
        resolve(content);
      });
    });
  }

  public async put(content: string): Promise<ContentHeader> {
    return new Promise<ContentHeader>((resolve, reject) => {
      ipfs.add(Buffer.from(content), (err: any, ipfsHash: any) => {
        resolve({ uri: this.scheme() + "://" + ipfsHash[0].path, contentHash: ipfsHash[0].path });
      });
    });
  }
}
