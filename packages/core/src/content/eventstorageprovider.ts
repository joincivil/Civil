import { EthApi } from "@joincivil/ethapi";
import { CivilErrors } from "@joincivil/utils";
import { EventStorage, EventStorageContract } from "../contracts/generated/wrappers/event_storage";
import { findEventOrThrow } from "../contracts/utils/contracts";
import { ContentData, StorageHeader } from "../types";
import { ContentProvider, ContentProviderOptions } from "./contentprovider";

export class EventStorageProvider implements ContentProvider {
  private ethApi: EthApi;
  private instance?: EventStorageContract;

  constructor(options: ContentProviderOptions) {
    this.ethApi = options.ethApi;
  }

  public scheme(): string {
    return "eventstorage";
  }

  public async get(what: StorageHeader): Promise<ContentData> {
    // TODO(ritave): If the hash doesn't exist, this will never finish
    //               Add web3.filter.get to abi-gen, not only watch
    return (await this.eventStorage())
      .StringStoredStream({ dataHash: what.contentHash }, { fromBlock: 0 })
      .first() // Closes the stream on first event
      .map(event => event.args.data)
      .toPromise();
  }

  public async put(content: string): Promise<StorageHeader> {
    const txHash = await (await this.eventStorage()).store.sendTransactionAsync(content);
    const receipt = await this.ethApi.awaitReceipt(txHash);
    const event = findEventOrThrow<EventStorage.Logs.StringStored>(receipt, EventStorage.Events.StringStored);

    const uri = this.scheme() + "://" + event.args.dataHash;
    return { uri, contentHash: event.args.dataHash };
  }

  private async eventStorage(): Promise<EventStorageContract> {
    if (!this.instance) {
      this.instance = await EventStorageContract.singletonTrusted(this.ethApi);
      if (!this.instance) {
        throw new Error(CivilErrors.UnsupportedNetwork);
      }
    }
    return this.instance;
  }
}
