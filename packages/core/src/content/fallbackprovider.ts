import * as Debug from "debug";

import { ContentProvider, ContentProviderOptions, ContentProviderCreator } from "./contentprovider";
import { StorageHeader, ContentData } from "../types";

const debug = Debug("civil:fallbackprovider");

export class FallbackProvider implements ContentProvider {
  public static build(providers: ContentProviderCreator[]): ContentProviderCreator {
    return FallbackProvider.bind(null, providers);
  }

  private providers: ContentProvider[];

  public constructor(providers: ContentProviderCreator[], options: ContentProviderOptions) {
    this.providers = providers.map(creator => new creator(options));
  }

  public scheme(): string {
    throw new Error("Method not supported.");
  }

  public async get(what: StorageHeader): Promise<ContentData> {
    for (const provider of this.providers) {
      try {
        return await provider.get(what);
      } catch (e) {
        debug(`Provider ${provider.scheme()} failed, trying next`, e);
      }
    }
    throw new Error("All providers in FallbackProvider failed to find content");
  }

  public async put(content: string | object, variables?: object | undefined): Promise<StorageHeader> {
    const headers = await Promise.all(this.providers.map(async provider => provider.put(content, variables)));
    return headers[0];
  }
}
