import { hashContent } from "@joincivil/utils";

import { EthContentHeader, MapObject, Uri, StorageHeader } from "../types";
import { ContentProvider } from "./contentprovider";

export class InMemoryProvider implements ContentProvider {
  private data: MapObject<string> = {};

  public scheme(): string {
    return "memory";
  }

  public async get(what: Uri | EthContentHeader): Promise<string> {
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

  public async put(content: string): Promise<StorageHeader> {
    const contentHash = hashContent(content);
    const uri = this.scheme() + "://" + contentHash;
    this.data.uri = content;
    return { uri, contentHash };
  }
}
