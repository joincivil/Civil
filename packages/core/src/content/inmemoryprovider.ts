import { ContentHeader, MapObject, Uri } from "../types";
import { Web3Wrapper } from "../utils/web3wrapper";
import { ContentProvider } from "./contentprovider";

export class InMemoryProvider implements ContentProvider {
  private data: MapObject<string> = {};
  private web3Wrapper: Web3Wrapper;

  constructor(web3Wrapper: Web3Wrapper) {
    this.web3Wrapper = web3Wrapper;
  }

  public scheme(): string {
    return "memory";
  }

  public async get(what: Uri | ContentHeader): Promise<string> {
    let uri = "";
    if (typeof what !== "string") {
      uri = what.uri;
    } else {
      uri = what;
    }
    if (this.data.uri === undefined) {
      throw new Error("No such URI (" + uri + ") found in InMemoryProvider");
    }
    return this.data.uri;
  }

  public async put(content: string): Promise<Uri> {
    const hash = this.web3Wrapper.web3.sha3(content);
    const uri = this.scheme() + "://" + hash;
    this.data.uri = content;
    return uri;
  }
}
