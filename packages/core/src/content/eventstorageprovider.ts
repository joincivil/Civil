import BigNumber from "bignumber.js";

import { ContentHeader, Uri } from "../types";
import { Web3Wrapper } from "../utils/web3wrapper";
import { ContentProvider, ContentProviderOptions } from "./contentprovider";
import { EventStorageContract, EventStorage } from "../contracts/generated/wrappers/event_storage";
import { CivilErrors } from "..";
import { findEventOrThrow } from "../contracts/utils/contracts";

export class EventStorageProvider implements ContentProvider {
  private web3Wrapper: Web3Wrapper;

  constructor(options: ContentProviderOptions) {
    this.web3Wrapper = options.web3Wrapper;
  }

  public scheme(): string {
    return "eventstorage";
  }

  public async get(what: Uri | ContentHeader): Promise<string> {
    let uri = "";
    if (typeof what !== "string") {
      uri = what.uri;
    } else {
      uri = what;
    }

    const id = new BigNumber(uri.replace(/^(eventstorage:\/\/)/, ""));

    // TODO(ritave): If the id doesn't exist, this will never finish
    //               Add web3.filter.get, not only watch
    return this.eventStorage
      .StringStoredStream({ id }, { fromBlock: 0 })
      .first() // Closes the stream on first event
      .map(event => event.args.data)
      .toPromise();
  }

  public async put(content: string): Promise<ContentHeader> {
    const hash = this.web3Wrapper.web3.sha3(content);

    const txHash = await this.eventStorage.store.sendTransactionAsync(content);
    const receipt = await this.web3Wrapper.awaitReceipt(txHash);
    const id = findEventOrThrow<EventStorage.Logs.StringStored>(receipt, EventStorage.Events.StringStored);

    // Content hash is stored seperately on blockchain
    const uri = this.scheme() + "://" + id.args.id.toString();
    return { uri, hash };
  }

  private get eventStorage(): EventStorageContract {
    const instance = EventStorageContract.singletonTrusted(this.web3Wrapper);
    if (!instance) {
      throw new Error(CivilErrors.UnsupportedNetwork);
    }
    return instance;
  }
}
