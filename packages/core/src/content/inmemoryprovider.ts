import { ContentHeader, MapObject, Uri } from "../types";
import { Web3Wrapper } from "../utils/web3wrapper";
import { ContentProvider, ContentProviderOptions } from "./contentprovider";

export class InMemoryProvider implements ContentProvider {
  private data: MapObject<string> = {};
  private web3Wrapper: Web3Wrapper;

  constructor(options: ContentProviderOptions) {
    this.web3Wrapper = options.web3Wrapper;
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

  public async put(content: string): Promise<ContentHeader> {
    const contentHash = this.web3Wrapper.sha3String(content);
    const uri = this.scheme() + "://" + contentHash;
    this.data.uri = content;
    return { uri, contentHash };
  }
}
