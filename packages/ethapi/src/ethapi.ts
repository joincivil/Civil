import { CivilErrors, delay, hashPersonalMessage, isBigNumber, promisify } from "@joincivil/utils";
import BigNumber from "bignumber.js";
import * as Debug from "debug";
import { bufferToHex, fromRpcSig, fromUtf8, toBuffer } from "ethereumjs-util";
import { Observable } from "rxjs/Observable";
import { ReplaySubject } from "rxjs/ReplaySubject";
import * as Web3 from "web3";
import {
  DecodedTransactionReceipt,
  EthAddress,
  EthSignedMessage,
  Hex,
  TxDataAll,
  TxHash,
} from "../../typescript-types/build";
import { AbiDecoder } from "./abidecoder";
import { requireAccount } from "./helpers";

const debug = Debug("civil:ethapi");

const POLL_MILLISECONDS = 1000;

export class EthApi {
  // Initialized for sure by the helper method setProvider used in constructor
  private web3!: Web3;
  private abiDecoder: AbiDecoder;
  private accountObservable: Observable<EthAddress | undefined>;
  private networkObservable: Observable<number>;
  private rpcId: number = 0; // Decreasing ids to not collide with web3

  // TODO(ritave): Use abi decoding seperatly in just the generated smart-contracts
  constructor(provider: Web3.Provider, abis: Web3.AbiDefinition[][]) {
    this.currentProvider = provider;
    this.abiDecoder = new AbiDecoder(abis);

    // Lazy polling
    // When anyone wants to listen to updates concerning network and accounts,
    // the polling starts, and the results are given to all listeners.
    // If all listeners stop listening - the polling stops
    // There is a cached version of the poll last result, which is invalidated after POLL_MILLISECONDS
    // FYI for dev: shareReplay doesn't unsubscribe properly
    const lazyPoll = <T extends any>(method: string, map: (result: Web3.JSONRPCResponsePayload) => T): Observable<T> =>
      Observable.timer(0, POLL_MILLISECONDS)
        .exhaustMap(async _ => this.rpc(method)) // Waits for the last rpc request to finish before sending a new one
        .map(map)
        .multicast(() => new ReplaySubject(1, POLL_MILLISECONDS)) // Do only one rpc call for everyone wanting updates, cache the last output
        .refCount() // Stop polling if everybody unsubscribes
        .distinctUntilChanged();

    this.networkObservable = lazyPoll("net_version", res => Number.parseInt(res.result, 10));
    this.accountObservable = lazyPoll("eth_accounts", res => {
      const accounts = res.result as EthAddress[];
      const account = accounts.length > 0 ? accounts[0] : undefined;
      this.web3.eth.defaultAccount = account;
      return account;
    });
  }

  public get currentProvider(): Web3.Provider {
    return this.web3.currentProvider;
  }

  public set currentProvider(provider: Web3.Provider) {
    // TODO(ritave): Cancel any pending calls to the previous provider
    this.web3 = new Web3(provider);
  }

  public get accountStream(): Observable<EthAddress | undefined> {
    return this.accountObservable;
  }

  public get networkStream(): Observable<number> {
    return this.networkObservable;
  }

  public async getGasPrice(): Promise<BigNumber> {
    const gp = promisify<BigNumber>(this.web3.eth.getGasPrice.bind(this.web3.eth));
    return gp();
  }

  public async getBlock(blockNumber: number | "latest" | "pending"): Promise<Web3.BlockWithoutTransactionData> {
    // tslint:disable-next-line:no-unbound-method
    const getBlockAsync = promisify<Web3.BlockWithoutTransactionData>(this.web3.eth.getBlock.bind(this.web3.eth));
    return getBlockAsync(blockNumber);
  }

  public async getLatestBlockNumber(): Promise<number> {
    const blockNumberPromise = promisify<number>(this.web3.eth.getBlockNumber.bind(this.web3.eth.getBlockNumber));
    return blockNumberPromise();
  }

  public async getCode(address: EthAddress): Promise<string> {
    const getCodeAsync = promisify<string>(this.web3.eth.getCode.bind(this.web3.eth));
    return getCodeAsync(address);
  }

  public async rpc(method: string, ...params: any[]): Promise<Web3.JSONRPCResponsePayload> {
    this.rpcId--;
    return new Promise<Web3.JSONRPCResponsePayload>((resolve, reject) => {
      this.currentProvider.sendAsync(
        {
          id: this.rpcId,
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

    const signerAccount = account || (await requireAccount(this).toPromise());
    let signature: Hex;
    try {
      signature = (await this.rpc("personal_sign", messageHex, signerAccount, "")).result;
    } catch {
      signature = (await this.rpc("eth_sign", signerAccount, messageHex)).result;
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
   * Converts a given number into a BigNumber instance
   * @param numberOrHexString
   */
  public toBigNumber(numberOrHexString: number | string | Hex | BigNumber): any {
    // This is a proxy method, for web3.toBigNumber, that exists
    // to ensure that we're creating instances of BigNumber that are
    // compatible with the version of web3 we're currently using. We
    // can likely get rid of this (or modify it) if/when we switch to
    // Web3 1.0.0 (or another modern version)
    if (isBigNumber(numberOrHexString)) {
      return this.web3.toBigNumber(numberOrHexString.toString());
    }
    return this.web3.toBigNumber(numberOrHexString as number | string);
  }

  /**
   * Awaits to confirm that the transaction was succesfull
   * @param txHash Transaction hash which will be checked
   * @param blockConfirmations Blockchain can get reorganized and the transaction can go to mempool,
   *                           wait for some for confirmations
   */
  public async awaitReceipt<R extends DecodedTransactionReceipt | Web3.TransactionReceipt = Web3.TransactionReceipt>(
    txHash: TxHash,
    blockConfirmations?: number /* = 12 */,
  ): Promise<R> {
    while (true) {
      const receipt = await this.getReceipt<R>(txHash);
      if (!receipt) {
        // TODO(ritave): Move to pending block parsing instead of polling
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
  public async getReceipt<R extends DecodedTransactionReceipt | Web3.TransactionReceipt = Web3.TransactionReceipt>(
    txHash: TxHash,
  ): Promise<R | null> {
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
      return this.receiptToDecodedReceipt<R>(receipt);
    }
    return null;
  }

  public getContractClass<T extends Web3.ContractInstance = any>(abi: Web3.AbiDefinition[]): Web3.Contract<T> {
    return this.web3.eth.contract(abi);
  }

  public async estimateGas(options: TxDataAll): Promise<number> {
    // tslint:disable-next-line:no-unbound-method
    const promisifed = promisify<number>(this.web3.eth.estimateGas, this.web3.eth);
    return promisifed(options);
  }

  private receiptToDecodedReceipt<R extends DecodedTransactionReceipt<any> | Web3.TransactionReceipt>(
    receipt: Web3.TransactionReceipt,
  ): R {
    receipt.logs = receipt.logs.map(log => this.abiDecoder.tryToDecodeLogOrNoop(log));
    return (receipt as any) as R;
  }

  private checkForEvmException(receipt: Web3.TransactionReceipt): void {
    // tslint:disable-next-line
    // https://ethereum.stackexchange.com/questions/28077/how-do-i-detect-a-failed-transaction-after-the-byzantium-fork-as-the-revert-opco/28078#28078
    // Pre-Bizantium, let's just throw, Civil didn't exist before Bizantium
    if (receipt.status === null) {
      debug("Warning: Pre-Bizantium block, not supported");
      throw new Error(CivilErrors.EvmException);
    }

    if (this.toBigNumber(receipt.status).isZero()) {
      throw new Error(CivilErrors.EvmException);
    }
  }
}
