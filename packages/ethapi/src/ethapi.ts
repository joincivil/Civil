import { CivilErrors, delay, hashPersonalMessage } from "@joincivil/utils";
import * as Debug from "debug";
import { bufferToHex, fromRpcSig, fromUtf8, toBuffer } from "ethereumjs-util";
import { ReplaySubject, Observable } from "rxjs";
import {
  ContractOptions,
  BigNumber,
  bigNumberify,
  DecodedTransactionReceipt,
  EthAddress,
  EthSignedMessage,
  Hex,
  TxHash,
} from "@joincivil/typescript-types";

import { AbiDecoder } from "./abidecoder";
import { requireAccount } from "./helpers";

import Web3 = require("web3");
import { Log, TransactionReceipt } from "web3/types";
import Contract from "web3/eth/contract";
import { Tx as TransactionConfig, Block, Transaction } from "web3/eth/types";
import { ABIDefinition as AbiItem } from "web3/eth/abi";
import { JsonRPCResponse } from "web3/providers";

export type Provider = Web3["currentProvider"];

const debug = Debug("civil:ethapi");

export const DEFAULT_HTTP_NODE = "http://127.0.0.1:8545";
const POLL_MILLISECONDS = 5000;

export class EthApi {
  // Initialized for sure by the helper method setProvider used in constructor
  private web3!: Web3;
  private abiDecoder: AbiDecoder;
  private accountObservable: ReplaySubject<EthAddress | undefined>;
  private networkObservable: ReplaySubject<number>;
  private rpcId: number = 10000; // HACK(ritave): Ids that shouldn't collide with web3, get rid of web3

  // TODO(ritave): Use abi decoding seperatly in just the generated smart-contracts
  constructor(provider: Provider, abis: any[][]) {
    this.currentProvider = provider;
    this.abiDecoder = new AbiDecoder(abis);

    this.accountObservable = new ReplaySubject<EthAddress | undefined>(undefined);

    this.web3.eth
      .getAccounts()
      .then(accounts => {
        const account = accounts && accounts.length > 0 ? accounts[0] : undefined;
        this.web3.eth.defaultAccount = account!;
        if (account) {
          this.accountObservable.next(account);
        }
      })
      .catch(err => {
        console.error("error getting accounts", err);
      });

    // @ts-ignore `on` exists for providers that support subscriptions
    if (provider.on) {
      // @ts-ignore `on` exists for providers that support subscriptions
      provider.on("accountsChanged", accounts => {
        const account = accounts && accounts.length > 0 ? accounts[0] : undefined;
        this.web3.eth.defaultAccount = account!;
        if (account) {
          this.accountObservable.next(account);
        }
      });
    }

    this.networkObservable = new ReplaySubject<number>();
    this.web3.eth.net
      .getId()
      .then(network => {
        this.networkObservable.next(network);
      })
      .catch(err => {
        console.error("error getting network", err);
      });

    // @ts-ignore `on` exists for providers that support subscriptions
    if (provider.on) {
      // @ts-ignore `on` exists for providers that support subscriptions
      provider.on("networkChanged", network => {
        this.networkObservable.next(network);
      });
    }
  }

  public get currentProvider(): Web3["currentProvider"] {
    return this.web3.currentProvider;
  }

  public set currentProvider(provider: Web3["currentProvider"]) {
    // TODO(ritave): Cancel any pending calls to the previous provider
    console.log("provider change");
    this.web3 = new Web3(provider);
  }

  public get accountStream(): Observable<EthAddress | undefined> {
    return this.accountObservable;
  }

  public get networkStream(): Observable<number> {
    return this.networkObservable;
  }

  public async network(): Promise<number> {
    return this.web3.eth.net.getId();
  }

  public async getAccount(): Promise<string | null> {
    return this.web3.eth.defaultAccount;
  }

  public async getGasPriceString(): Promise<string> {
    // @ts-ignore @types/web3 are wrong - this really does return a string
    // https://web3js.readthedocs.io/en/v1.2.1/web3-eth.html#getgasprice
    return this.web3.eth.getGasPrice();
  }

  public async getGasPrice(): Promise<BigNumber> {
    return this.getGasPriceString().then(gp => new BigNumber(gp));
  }

  public async getBlock(blockNumber: number | "latest" | "pending"): Promise<Block> {
    return this.web3.eth.getBlock(blockNumber);
  }

  public async getLatestBlockNumber(): Promise<number> {
    return this.web3.eth.getBlockNumber();
  }

  public async getConfirmations(startBlock: number): Promise<number> {
    const block = await this.getLatestBlockNumber();
    return block - startBlock;
  }

  public async getCode(address: EthAddress): Promise<string> {
    return this.web3.eth.getCode(address);
  }

  public async rpc(method: string, ...params: any[]): Promise<any> {
    this.rpcId++;
    // use this for web3
    // return this.currentProvider!.send(method, params);
    return new Promise<JsonRPCResponse>((resolve, reject) => {
      this.currentProvider!.send(
        {
          id: this.rpcId,
          jsonrpc: "2.0",
          method,
          params,
        },
        // @ts-ignore typing on this is whacky
        (err, res) => {
          if (err) {
            reject(err);
          }
          if ((res as any).error) {
            reject((res as any).error);
          }
          resolve(res.result);
        },
      );
    });
  }

  public async sendTransaction(txData: TransactionConfig): Promise<TxHash> {
    // TOOD(dankins): handle rejection
    // tslint:disable-next-line:no-unbound-method
    return new Promise((resolve, reject) => {
      this.web3.eth
        .sendTransaction(txData)
        .once("transactionHash", hash => {
          resolve(hash);
        })
        .catch(reject);
    });
  }

  public async getTransaction(txHash: TxHash): Promise<Transaction> {
    return this.web3.eth.getTransaction(txHash);
  }

  public async signMessage(message: string, account?: EthAddress): Promise<EthSignedMessage> {
    const messageHex = fromUtf8(message);

    const signerAccount = account || (await requireAccount(this).toPromise());
    let signature: Hex;
    try {
      // @ts-ignore types are wrong on personal sign
      signature = await this.web3.eth.personal.sign(messageHex, signerAccount);
    } catch (e) {
      if (e.message.toLowerCase().includes("user denied")) {
        throw e; // rethrow the metamask error to be handled in ui
      } else {
        signature = (await this.rpc("eth_sign", signerAccount, messageHex)).result;
      }
    }

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
   * Converts an address to a web3 checksummed address
   * @param address
   */
  public toChecksumAddress(address: string): string {
    return this.web3.utils.toChecksumAddress(address);
  }

  /**
   * Converts a given number into a BigNumber instance
   * @param numberOrHexString
   */
  public toBigNumber(amount: number | string | BigNumber): any {
    if (typeof amount === "number") {
      return bigNumberify(amount);
    } else if (amount instanceof BigNumber) {
      return amount;
    } else if (typeof amount === "string" && amount.startsWith("<sub>")) {
      console.log("found a weird bignumber:", amount);
      return bigNumberify(0);
    }
    return bigNumberify(amount);
  }
  // public toBigNumber(numberOrHexString: number | string | BigNumber): any {
  //   // @ts-ignore
  //   // const rtn = this.web3.utils.toBN(numberOrHexString);
  //   // @ts-ignore
  //   // hack(dankins): this is to trick ethers.js into thinking this is a valid bignumber
  //   // https://github.com/ethers-io/ethers.js/blob/master/src.ts/utils/bignumber.ts#L85
  //   // rtn.toHexString = () => this.web3.utils.numberToHex(rtn);

  //   return rtn;
  // }

  public toWei(amount: number): BigNumber {
    const wei = this.web3.utils.toWei(amount.toString());
    return this.toBigNumber(wei);
  }

  public async accountBalace(account: EthAddress): Promise<number> {
    const balance = await this.web3.eth.getBalance(account);
    return parseFloat(this.web3.utils.fromWei(balance, "ether"));
  }

  /**
   * Awaits to confirm that the transaction was succesfull
   * @param txHash Transaction hash which will be checked
   * @param blockConfirmations Blockchain can get reorganized and the transaction can go to mempool,
   *                           wait for some for confirmations
   */
  public async awaitReceipt<R extends DecodedTransactionReceipt | TransactionReceipt = TransactionReceipt>(
    txHash: TxHash,
    blockConfirmations: number = 1, // wait till the api says the current block is confirmed
  ): Promise<R> {
    while (true) {
      const receipt = await this.getReceipt<R>(txHash);
      if (!receipt) {
        // TODO(ritave): Move to pending block parsing instead of polling
        await delay(POLL_MILLISECONDS);
        continue;
      }

      this.checkForEvmException(receipt);
      await this.awaitConfirmations(receipt.blockNumber, blockConfirmations);
      return receipt;
    }
  }

  public async awaitConfirmations(startblock: number, confirmations: number): Promise<void> {
    while (true) {
      const confirmationsSoFar = await this.getConfirmations(startblock);
      if (confirmationsSoFar >= confirmations) {
        return;
      } else {
        await delay(POLL_MILLISECONDS);
      }
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
  public async getReceipt<R extends DecodedTransactionReceipt | TransactionReceipt = TransactionReceipt>(
    txHash: TxHash,
  ): Promise<R | null> {
    const receipt = await this.web3.eth.getTransactionReceipt(txHash);
    if (receipt) {
      return this.receiptToDecodedReceipt<R>(receipt);
    }
    return null;
  }

  public getContractClass(abi: AbiItem[], address?: string, options?: ContractOptions | undefined): Contract {
    const contract = new this.web3.eth.Contract(abi, address, options);

    if (!contract.options.address) {
      contract.options.address = address!;
    }
    return contract;
  }

  public async estimateGas(options: TransactionConfig): Promise<number> {
    return this.web3.eth.estimateGas(options);
  }

  private receiptToDecodedReceipt<R extends DecodedTransactionReceipt<any> | TransactionReceipt>(
    receipt: TransactionReceipt,
  ): R {
    receipt.logs = receipt.logs!.map((log: Log) => this.abiDecoder.tryToDecodeLogOrNoop(log));
    return (receipt as any) as R;
  }

  private checkForEvmException(receipt: TransactionReceipt): void {
    // tslint:disable-next-line
    // https://ethereum.stackexchange.com/questions/28077/how-do-i-detect-a-failed-transaction-after-the-byzantium-fork-as-the-revert-opco/28078#28078
    // Pre-Bizantium, let's just throw, Civil didn't exist before Bizantium
    if (receipt.status === null) {
      debug("Warning: Pre-Bizantium block, not supported");
      throw new Error(CivilErrors.EvmException);
    }

    if (receipt.status === false) {
      throw new Error(CivilErrors.EvmException);
    }
  }
}
