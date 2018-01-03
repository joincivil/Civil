import BigNumber from "bignumber.js";
import { Observable } from "rxjs";
import "rxjs/add/operator/distinctUntilChanged";
import * as Web3 from "web3";

import { artifacts } from "../artifacts";
import { ContentProvider } from "../content/providers/contentprovider";
import { InMemoryProvider } from "../content/providers/inmemoryprovider";
import { ContentHeader, EthAddress, NewsroomContent } from "../types";
import { idFromEvent } from "../utils/contractutils";
import { bindAll } from "../utils/language";
import "../utils/rxjs";
import { Web3Wrapper } from "../utils/web3wrapper";
import { NewsroomContract } from "./generated/newsroom";

export class Newsroom {
  private instance: NewsroomContract;
  private contentProvider: ContentProvider;

  constructor(web3Wrapper: Web3Wrapper, instance: NewsroomContract) {
    this.contentProvider = new InMemoryProvider(web3Wrapper);
    this.instance = instance;
    bindAll(this, ["constructor"]);
  }

  public get address() {
    return this.instance.address;
  }

  public owner() { return this.instance.owner.callAsync(); }

  public proposedContent(fromBlock: number = 0): Observable<ContentHeader> {
    return this.instance
      .ContentProposedStream({}, { fromBlock })
      .distinctUntilChanged((a, b) => {
        return a.blockNumber === b.blockNumber && a.logIndex === b.logIndex;
      }) // https://github.com/ethereum/web3.js/issues/573
      .map((e) => e.args.id)
      .concatFilter(this.instance.isProposed.callAsync)
      .concatMap(this.idToContentHeader);
  }

  public approvedContent(fromBlock: number = 0): Observable<ContentHeader> {
    return this.instance
      .ContentApprovedStream({}, { fromBlock })
      .distinctUntilChanged((a, b) => {
        return a.blockNumber === b.blockNumber && a.logIndex === b.logIndex;
      }) // https://github.com/ethereum/web3.js/issues/573
      .map((e) => e.args.id)
      .concatMap(this.idToContentHeader);
  }

  // TODO(ritave): Decode transaction receipt and return id of the proposed article
  public async propose(content: string): Promise<string> {
    const uri = await this.contentProvider.put(content);
    const txHash = await this.instance.proposeContent.sendTransactionAsync(uri);
    return txHash;
  }

  public async resolveContent(header: ContentHeader): Promise<NewsroomContent> {
    const content = await this.contentProvider.get(header.uri);
    return {
      id: header.id,
      author: header.author,
      content,
      timestamp: header.timestamp,
      uri: header.uri,
    };
  }

  private async isProposed(id: number|string|BigNumber) {
    return await this.instance.isProposed.callAsync(new BigNumber(id));
  }

  private async idToContentHeader(id: BigNumber): Promise<ContentHeader> {
    const data = await Promise.all([
      this.instance.author.callAsync(id),
      this.instance.timestamp.callAsync(id),
      this.instance.uri.callAsync(id),
    ]);
    return {
      id: id.toNumber(),
      author: data[0],
      timestamp: new Date(data[1].toNumber()),
      uri: data[2],
    };
  }
}
