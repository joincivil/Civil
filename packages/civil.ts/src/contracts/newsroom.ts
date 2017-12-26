import { Observable } from "rxjs";
import "rxjs/add/operator/map";
import * as Web3 from "web3";

import { artifacts } from "../artifacts";
import { ContentHeader, EthAddress, NewsroomContent } from "../types";
import { Web3Wrapper } from "../utils/web3wrapper";
import { BaseContract } from "./basecontract";

export class Newsroom extends BaseContract<any> {
  constructor(web3Wrapper: Web3Wrapper, address: EthAddress) {
    super(web3Wrapper, artifacts.Newsroom, address);
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

  public async propose(content: NewsroomContent): Promise<number> {
    return null;
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
