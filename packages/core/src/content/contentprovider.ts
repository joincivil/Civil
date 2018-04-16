import { ContentHeader, Uri } from "../types";
import { Web3Wrapper } from "../utils/web3wrapper";

export interface ContentProvider {
  scheme(): string;
  get(what: Uri | ContentHeader): Promise<string>;
  put(content: string, variables?: object): Promise<ContentHeader>;
}

export interface ContentProviderOptions {
  web3Wrapper: Web3Wrapper;
}

export interface ContentProviderCreator {
  new(options: ContentProviderOptions): ContentProvider;
}
