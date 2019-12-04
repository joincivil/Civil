import { EthApi } from "@joincivil/ethapi";
import { ContentData, StorageHeader } from "@joincivil/typescript-types";

export interface ContentProvider {
  scheme(): string;
  get(what: StorageHeader): Promise<ContentData>;
  put(content: ContentData, variables?: object): Promise<StorageHeader>;
}

export interface ContentProviderOptions {
  ethApi: EthApi;
}

export type ContentProviderCreator = new (options: ContentProviderOptions) => ContentProvider;
