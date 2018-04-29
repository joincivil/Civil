import { EthContentHeader, Uri, StorageHeader, ContentData } from "../types";
import { Web3Wrapper } from "../utils/web3wrapper";

export interface ContentProvider {
  scheme(): string;
  get(what: Uri | StorageHeader): Promise<ContentData>;
  put(content: ContentData, variables?: object): Promise<StorageHeader>;
}

export interface ContentProviderOptions {
  web3Wrapper: Web3Wrapper;
}

export interface ContentProviderCreator {
  new (options: ContentProviderOptions): ContentProvider;
}
