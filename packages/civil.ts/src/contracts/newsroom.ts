import { Observable } from "rxjs";
import "rxjs/add/operator/map";
import * as Web3 from "web3";

import { artifacts } from "../artifacts";
import { ContentProvider } from "../content/providers/contentprovider";
import { InMemoryProvider } from "../content/providers/inmemoryprovider";
import { ContentHeader, EthAddress, NewsroomContent } from "../types";
import { idFromEvent } from "../utils/contractutils";
import { Web3Wrapper } from "../utils/web3wrapper";
import { BaseContract } from "./basecontract";

export class Newsroom extends BaseContract<any> {
  private contentProvider: ContentProvider;

  constructor(web3Wrapper: Web3Wrapper, address: EthAddress) {
    super(web3Wrapper, artifacts.Newsroom, address);
    this.contentProvider = new InMemoryProvider(web3Wrapper);
  }

  /* tslint:disable member-ordering */
  public owner = this.cachedPropOrBlockchain<EthAddress>("owner");
  /* tslint:enable member-ordering */

  public proposedContent(fromBlock: number = 0): Observable<ContentHeader> {
    return this.instance
      .ContentProposedStream({}, { fromBlock })
      .map((e: Web3.DecodedLogEntryEvent<any>) => e.args.id as number)
      .concatFilter(this.instance.isProposed)
      .concatMap(this.idToContentHeader);
  }

  public approvedContent(fromBlock: number = 0): Observable<ContentHeader> {
    return this.instance
      .ContentApprovedStream({}, { fromBlock })
      .map((e: Web3.DecodedLogEntryEvent<any>) => e.args.id as number)
      .concatMap(this.idToContentHeader);
  }

  public async propose(content: string): Promise<number> {
    const uri = await this.contentProvider.put(content);
    const tx = await this.instance.proposeContent(uri);
    return idFromEvent(tx).toNumber();
  }

  private async isProposed(id: number|string) {
    return await this.instance.isProposed(id);
  }

  private async idToContentHeader(id: number): Promise<ContentHeader> {
    const data = await Promise.all([
      this.instance.author(id),
      this.instance.timestamp(id),
      this.instance.uri(id),
    ]);
    return {
      id,
      author: data[0],
      timestamp: data[1],
      uri: data[2],
    };
  }
}
