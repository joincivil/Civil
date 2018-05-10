import BigNumber from "bignumber.js";

import { ContentProvider, ContentProviderOptions } from "./contentprovider";
import { EventStorageContract, EventStorage } from "../contracts/generated/wrappers/event_storage";
import { findEventOrThrow } from "../contracts/utils/contracts";
import { EthApi, StorageHeader, ContentData } from "../types";
import { CivilErrors } from "../utils/errors";

export class EventStorageProvider implements ContentProvider {
  private ethApi: EthApi;

  constructor(options: ContentProviderOptions) {
    this.ethApi = options.ethApi;
  }

  public scheme(): string {
    return "eventstorage";
  }

  public async get(what: StorageHeader): Promise<ContentData> {
    // TODO(ritave): If the hash doesn't exist, this will never finish
    //               Add web3.filter.get to abi-gen, not only watch
    return this.eventStorage
      .StringStoredStream({ dataHash: what.contentHash }, { fromBlock: 0 })
      .first() // Closes the stream on first event
      .map(event => event.args.data)
      .toPromise();
  }

  public async put(content: string): Promise<StorageHeader> {
    const txHash = await this.eventStorage.store.sendTransactionAsync(content);
    const receipt = await this.ethApi.awaitReceipt(txHash);
    const event = findEventOrThrow<EventStorage.Logs.StringStored>(receipt, EventStorage.Events.StringStored);

    const uri = this.scheme() + "://" + event.args.dataHash;
    return { uri, contentHash: event.args.dataHash };
  }

  private get eventStorage(): EventStorageContract {
    const instance = EventStorageContract.singletonTrusted(this.ethApi);
    if (!instance) {
      throw new Error(CivilErrors.UnsupportedNetwork);
    }
    return instance;
  }
}
