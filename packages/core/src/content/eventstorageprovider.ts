import BigNumber from "bignumber.js";

import { Web3Wrapper } from "../utils/web3wrapper";
import { ContentProvider, ContentProviderOptions } from "./contentprovider";
import { EventStorageContract, EventStorage } from "../contracts/generated/wrappers/event_storage";
import { CivilErrors, StorageHeader, ContentData } from "..";
import { findEventOrThrow } from "../contracts/utils/contracts";

export class EventStorageProvider implements ContentProvider {
  private web3Wrapper: Web3Wrapper;

  constructor(options: ContentProviderOptions) {
    this.web3Wrapper = options.web3Wrapper;
  }

  public scheme(): string {
    return "eventstorage";
  }

  public async get(what: StorageHeader): Promise<ContentData {
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
    const receipt = await this.web3Wrapper.awaitReceipt(txHash);
    const event = findEventOrThrow<EventStorage.Logs.StringStored>(receipt, EventStorage.Events.StringStored);

    const uri = this.scheme() + "://" + event.args.dataHash;
    return { uri, contentHash: event.args.dataHash };
  }

  private get eventStorage(): EventStorageContract {
    const instance = EventStorageContract.singletonTrusted(this.web3Wrapper);
    if (!instance) {
      throw new Error(CivilErrors.UnsupportedNetwork);
    }
    return instance;
  }
}
