import BigNumber from "bignumber.js";
import * as Debug from "debug";
import * as Web3 from "web3";
import { delay, promisify, hashPersonalMessage } from "@joincivil/utils";
import { EthSignedMessage } from "@joincivil/typescript-types";

import { Artifact, artifacts } from "../contracts/generated/artifacts";
import { CivilTransactionReceipt, EthAddress, TxHash, TxDataAll, Hex } from "../types";
import { AbiDecoder } from "./abidecoder";
import { CivilErrors, requireAccount } from "./errors";
import { BaseContract } from "../contracts/basecontract";
import { BaseWrapper } from "../contracts/basewrapper";
import { fromRpcSig, bufferToHex, toBuffer, fromUtf8 } from "ethereumjs-util";

const POLL_MILLISECONDS = 1000;
const DEFAULT_HTTP_NODE = "http://localhost:8545";

const debug = Debug("civil:web3wrapper");

export class Web3Wrapper {
  public static detectProvider(): Web3Wrapper {
    let provider: Web3.Provider;
    // Try to use the window's injected provider
    if (typeof window !== "undefined" && (window as any).web3 !== "undefined") {
      const injectedWeb3: Web3 = (window as any).web3;
      provider = injectedWeb3.currentProvider;
      debug("Using injected web3 provider");
    } else {
      // TODO(ritave): Research using Infura
      provider = new Web3.providers.HttpProvider(DEFAULT_HTTP_NODE);
      debug("No web3 provider provided or found injected, defaulting to HttpProvider");
    }
    return new Web3Wrapper(provider);
  }

  // Initialized for sure by the helper method setProvider used in constructor
  public web3!: Web3;

  private abiDecoder: AbiDecoder;

  constructor(provider: Web3.Provider) {
    // TODO(ritave): Constructor can throw when the eg. HttpProvider can't connect to Http
    //               It shouldn't, and should just set null account
    this.currentProvider = provider;
    this.abiDecoder = new AbiDecoder(Object.values<Artifact>(artifacts).map(a => a.abi));
  }

  public get currentProvider(): Web3.Provider {
    return this.web3.currentProvider;
  }

  public set currentProvider(provider: Web3.Provider) {
    this.web3 = new Web3(provider);
    // There's an error in web3 typings
    // defaultAccount can be set to undefined
    this.web3.eth.defaultAccount = this.account!;
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

  public get networkId(): string {
    return this.web3.version.network;
  }

  public async getBlock(blockNumber: number): Promise<Web3.BlockWithoutTransactionData> {
    // tslint:disable-next-line:no-unbound-method
    const getBlockAsync = promisify<Web3.BlockWithoutTransactionData>(this.web3.eth.getBlock, this.web3.eth);
    return getBlockAsync(blockNumber);
  }

  public async getCode(contract: EthAddress | BaseContract | BaseWrapper<any>): Promise<string> {
    let address: EthAddress;
    if (typeof contract === "string") {
      address = contract;
    } else {
      address = contract.address;
    }
    // tslint:disable-next-line:no-unbound-method
    const getCodeAsync = promisify<string>(this.web3.eth.getCode, this.web3.eth);
    return getCodeAsync(address);
  }

  public async rpc(method: string, ...params: any[]): Promise<Web3.JSONRPCResponsePayload> {
    return new Promise<Web3.JSONRPCResponsePayload>((resolve, reject) => {
      this.currentProvider.sendAsync(
        {
          id: new Date().getSeconds(),
          jsonrpc: "2.0",
          method,
          params,
        },
        (err, result) => {
          if (err) {
            return reject(err);
          }
          if ((result as any).error) {
            return reject((result as any).error);
          }
          return resolve(result);
        },
      );
    });
  }

  public async sendTransaction(txData: TxDataAll): Promise<TxHash> {
    // tslint:disable-next-line:no-unbound-method
    const sendTransactionAsync = promisify<TxHash>(this.web3.eth.sendTransaction, this.web3.eth);
    return sendTransactionAsync(txData);
  }

  public async signMessage(message: string, account?: EthAddress): Promise<EthSignedMessage> {
    const messageHex = fromUtf8(message);

    const signerAccount = account || requireAccount(this);

    const response = await this.rpc("eth_sign", [signerAccount, messageHex]);
    const signature = response.result as Hex;

    const rsv = fromRpcSig(signature);

    return {
      ...hashPersonalMessage(message),
      signature,

      message,
      r: bufferToHex(rsv.r),
      s: bufferToHex(rsv.s),
      v: bufferToHex(toBuffer(rsv.v)),
      signer: signerAccount,
    };
  }

  /**
   * Awaits to confirm that the transaction was succesfull
   * @param txHash Transaction hash which will be checked
   * @param blockConfirmations Blockchain can get reorganized and the transaction can go to mempool,
   *                           wait for some for confirmations
   */
  public async awaitReceipt(txHash: TxHash, blockConfirmations?: number /* = 12 */): Promise<CivilTransactionReceipt> {
    while (true) {
      const receipt = await this.getReceipt(txHash);
      if (!receipt) {
        await delay(POLL_MILLISECONDS);
        continue;
      }

      this.checkForEvmException(receipt);

      if (blockConfirmations) {
        throw new Error("Not implemented yet");
        /*
        try {
          await this.nodeStream.awaitConfirmations(receipt.blockHash, blockConfirmations);
        } catch (e) {
          debug("Failed to get block confirmations, tx got back into mempool", e);
          continue;
        }*/
      }
      return receipt;
    }
  }

  /**
   * Low-level call,
   * Tries to get the receipt from blockchain and automatically decodes it's logs
   * into proper Events from our smart-contracts
   * *Warning:* The transaction receipt can be returned even if the transaction has failed, check the `status` field
   * @param txHash Transaction hash for which the receipt is returned
   * @returns Null if the transaction is not yet inside the blockchain (still in mempool), decoded transaction otherwise
   */
  public async getReceipt(txHash: TxHash): Promise<CivilTransactionReceipt | null> {
    // web3-typescript-typings have wrong type, the call can return null if still in mempool
    // Fix: https://github.com/0xProject/0x.js/pull/338
    // tslint:disable:no-unbound-method
    const getTransactionReceipt = promisify<Web3.TransactionReceipt | null>(
      this.web3.eth.getTransactionReceipt,
      this.web3.eth,
    );
    // tslint:enable:no-unbound-method

    const receipt = await getTransactionReceipt(txHash);
    if (receipt) {
      return this.receiptToCivilReceipt(receipt);
    }
    return null;
  }

  private receiptToCivilReceipt(receipt: Web3.TransactionReceipt): CivilTransactionReceipt {
    receipt.logs = receipt.logs.map(log => this.abiDecoder.tryToDecodeLogOrNoop(log));
    return receipt as CivilTransactionReceipt;
  }

  private checkForEvmException(receipt: CivilTransactionReceipt): void {
    // tslint:disable-next-line
    // https://ethereum.stackexchange.com/questions/28077/how-do-i-detect-a-failed-transaction-after-the-byzantium-fork-as-the-revert-opco/28078#28078
    // Pre-Bizantium, let's just throw, Civil didn't exist before Bizantium
    if (receipt.status === null) {
      debug("Warning: Pre-Bizantium block, not supported");
      throw new Error(CivilErrors.EvmException);
    }

    if (new BigNumber(receipt.status).isZero()) {
      throw new Error(CivilErrors.EvmException);
    }
  }
}
