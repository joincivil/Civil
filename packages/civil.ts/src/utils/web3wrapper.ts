import * as Debug from "debug";
import * as Web3 from "web3";

import { artifacts } from "../contracts/generated/artifacts";
import { Artifact, CivilTransactionReceipt, EthAddress, TxHash } from "../types";
import { delay, promisify } from "../utils/language";
import { AbiDecoder } from "./abidecoder";
import { CivilErrors } from "./errors";
import { NodeStream } from "./nodestream";

const POLL_MILLISECONDS = 1000;

const debug = Debug("civil:web3wrapper");

export class Web3Wrapper {
  public web3: Web3;

  private abiDecoder: AbiDecoder;
  private nodeStream: NodeStream;

  constructor(provider: Web3.Provider) {
    this.setProvider(provider);
    this.abiDecoder = new AbiDecoder(
      Object
        .values<Artifact>(artifacts)
        .map((a) => a.abi));
    this.nodeStream = new NodeStream();
  }

  public setProvider(provider: Web3.Provider): void {
    this.web3 = new Web3(provider);
    // There's an error in web3 typings
    // defaultAccount can be set to undefined
    /* tslint:disable no-non-null-assertion */
    this.web3.eth.defaultAccount = this.account!;
    /* tslint:enable no-non-null-assertion */
  }

  public get account(): EthAddress | undefined {
    if (this.web3.eth.defaultAccount !== undefined) {
      return this.web3.eth.defaultAccount;
    }
    if (this.web3.eth.accounts.length > 0) {
      return this.web3.eth.accounts[0];
    }
    return undefined;
  }

  public async awaitReceipt(txHash: TxHash, blockConfirmations?: number /* = 12 */): Promise<CivilTransactionReceipt> {
    while (true) {
      const receipt = await this.getReceipt(txHash);
      if (!receipt) {
        await delay(POLL_MILLISECONDS);
        continue;
      }

      this.checkForEvmException(receipt);

      if (blockConfirmations) {
        try {
          await this.nodeStream.awaitConfirmations(receipt.blockHash, blockConfirmations);
        } catch (e) {
          debug("Failed to get block confirmations, tx got back into mempool", e);
          continue;
        }
      }
      return receipt;
    }
  }

  public async getReceipt(txHash: TxHash): Promise<CivilTransactionReceipt|null> {
    // web3-typescript-typings have wrong type, the call can return null if still in mempool
    // Fix: https://github.com/0xProject/0x.js/pull/338
    /* tslint:disable no-unbound-method */
    const getTransactionReceipt =
      promisify<Web3.TransactionReceipt|null>(this.web3.eth.getTransactionReceipt, this.web3.eth);
    /* tslint:enable no-unbound-method */

    const receipt = await getTransactionReceipt(txHash);
    if (receipt) {
      return this.receiptToCivilReceipt(receipt);
    }
    return null;
  }

  private receiptToCivilReceipt(receipt: Web3.TransactionReceipt): CivilTransactionReceipt {
    receipt.logs = receipt.logs.map((log) => this.abiDecoder.tryToDecodeLogOrNoop(log));
    return receipt as CivilTransactionReceipt;
  }

  private checkForEvmException(receipt: CivilTransactionReceipt): void {
    if (receipt.status === 0 || receipt.status === "0x0" || receipt.status === "0x00") {
      throw new Error(CivilErrors.EvmException);
    }

    // tslint:disable-next-line
    // https://ethereum.stackexchange.com/questions/28077/how-do-i-detect-a-failed-transaction-after-the-byzantium-fork-as-the-revert-opco/28078#28078
    // Pre-Bizantium, let's just throw, Civil didn't exist before Bizantium
    if (receipt.status === null) {
      debug("Warning: Pre-Bizantium block, not supported");
      throw new Error(CivilErrors.EvmException);
    }
  }
}
