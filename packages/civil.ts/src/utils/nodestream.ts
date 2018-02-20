/* tslint:disable all */ // Let's come back here when we're working on this
import { Block, BlockAndLogStreamer } from "ethereumjs-blockstream";
import { FilterOptions } from "ethereumjs-blockstream/output/source/models/filters";
import { Log } from "ethereumjs-blockstream/output/source/models/log";

import { CivilTransactionReceipt, TxHash } from "../types";
import { AbiDecoder } from "./abidecoder";
import { Web3Wrapper } from "./web3wrapper";

type CivilBlock = Block;
type CivilLog = Log;

/**
 * This class is provides streams/callbacks for multiple stuff from Ethereum
 * Specifically, transaction receipts, waiting for them, watch/filter functionallitt
 * etc.
 */
export class NodeStream {
  //private stream: BlockAndLogStreamer<CivilBlock, CivilLog>;

  constructor() {
    // this.stream = BlockAndLogStreamer.createCallbackStyle(this.getBlockByHash.bind(this), this.getLogs.bind(this));
  }

  /**
   * Due to Ethereum's small block time, chain reorganization happens quite often,
   * blocks (and so do your transactions), and transactions are put back into mempool
   */
  public async awaitConfirmations(blockHash: string, noOfConfirmations: number) {
    throw new Error("Not implemented yet");
  }
/*
  private async getLatestBlock(): Promise<CivilBlock> {
  }

  private async getBlockByHash(hash: string): Promise<CivilBlock|null> {

  }

  private async getLogs(filterOptions: FilterOptions): Promise<CivilLog[]> {

  }
  */
}
/* tslint:enable all */
