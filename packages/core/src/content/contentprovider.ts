import { EthApi } from "@joincivil/ethapi";
import { ContentData, StorageHeader } from "../types";

export interface ContentProvider {
  scheme(): string;
  get(what: StorageHeader): Promise<ContentData>;
  put(content: ContentData, variables?: object): Promise<StorageHeader>;
}

export interface ContentProviderOptions {
  ethApi: EthApi;
}

export interface ContentProviderCreator {
  new (options: ContentProviderOptions): ContentProvider;
}
