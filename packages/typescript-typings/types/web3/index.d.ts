declare module "web3" {
  import * as BigNumber from "bignumber.js";

  type MixedData = string | number | object | any[] | BigNumber.BigNumber;

  class Web3 {
    public static providers: typeof providers;
    public currentProvider: Provider;

    public eth: Web3.EthApi;
    public personal: Web3.PersonalApi | undefined;
    public version: Web3.VersionApi;
    public net: Web3.NetApi;

    public constructor(provider?: Provider);

    public isConnected(): boolean;
    public setProvider(provider: Provider): void;
    public reset(keepIsSyncing: boolean): void;
    public toHex(data: MixedData): string;
    public toAscii(hex: string): string;
    public fromAscii(ascii: string, padding?: number): string;
    public toUtf8(hex: string): string;
    public fromUtf8(text: string, allowZero?: true): string;
    public toDecimal(hex: string): number;
    public fromDecimal(value: number | string): string;
    public fromWei(value: number | string, unit: Unit): string;
    public fromWei(value: BigNumber.BigNumber, unit: Unit): BigNumber.BigNumber;
    public toWei(amount: number | string, unit: Unit): string;
    public toWei(amount: BigNumber.BigNumber, unit: Unit): BigNumber.BigNumber;
    public toBigNumber(value: number | string): BigNumber.BigNumber;
    public isAddress(address: string): boolean;
    public isChecksumAddress(address: string): boolean;
    public sha3(value: string, options?: Web3.Sha3Options): string;
  }

  namespace providers {
    class HttpProvider implements Provider {
      constructor(url?: string, timeout?: number, username?: string, password?: string);
      public sendAsync(
        payload: Web3.JSONRPCRequestPayload,
        callback: (err: Error, result: Web3.JSONRPCResponsePayload) => void,
      ): void;
    }
  }

  namespace Web3 {
    export enum AbiType {
      Function = "function",
      Constructor = "constructor",
      Event = "event",
      Fallback = "fallback",
    }
    export interface MethodAbi {
      type: AbiType.Function;
      name: string;
      inputs: DataItem[];
      outputs: DataItem[];
      constant: boolean;
      stateMutability: StateMutability;
      payable: boolean;
    }
    export interface ConstructorAbi {
      type: AbiType.Constructor;
      inputs: DataItem[];
      payable: boolean;
      stateMutability: ConstructorStateMutability;
    }
    export interface FallbackAbi {
      type: AbiType.Fallback;
      payable: boolean;
    }
    export interface DataItem {
      name: string;
      type: string;
      components?: DataItem[];
    }
    export interface EventParameter extends DataItem {
      indexed: boolean;
    }
    export type FunctionAbi = MethodAbi | ConstructorAbi | FallbackAbi;
    export interface EventAbi {
      type: AbiType.Event;
      name: string;
      inputs: EventParameter[];
      anonymous: boolean;
    }
    export type AbiDefinition = FunctionAbi | EventAbi;
    export type ContractAbi = AbiDefinition[];

    export interface AbstractBlock {
      number: number | null;
      hash: string | null;
      parentHash: string;
      nonce: string | null;
      sha3Uncles: string;
      logsBloom: string | null;
      transactionsRoot: string;
      stateRoot: string;
      miner: string;
      difficulty: BigNumber;
      totalDifficulty: BigNumber;
      extraData: string;
      size: number;
      gasLimit: number;
      gasUsed: number;
      timestamp: number;
      uncles: string[];
    }
    export interface BlockWithoutTransactionData extends AbstractBlock {
      transactions: string[];
    }
    export interface BlockWithTransactionData extends AbstractBlock {
      transactions: Transaction[];
    }

    // Earliest is omitted by design. It is simply an alias for the `0` constant and
    // is thus not very helpful. Moreover, this type is used in places that only accept
    // `latest` or `pending`.
    export enum BlockParamLiteral {
      Latest = "latest",
      Pending = "pending",
    }
    export type BlockParam = BlockParamLiteral | number;

    interface CallTxDataBase {
      to?: string;
      value?: number | string | BigNumber;
      gas?: number | string | BigNumber;
      gasPrice?: number | string | BigNumber;
      data?: string;
      nonce?: number;
    }
    export interface TxData extends CallTxDataBase {
      from: string;
    }
    export interface CallData extends CallTxDataBase {
      from?: string;
    }

    export type Unit =
      | "kwei"
      | "ada"
      | "mwei"
      | "babbage"
      | "gwei"
      | "shannon"
      | "szabo"
      | "finney"
      | "ether"
      | "kether"
      | "grand"
      | "einstein"
      | "mether"
      | "gether"
      | "tether";

    export interface Transaction {
      hash: string;
      nonce: number;
      blockHash: string | null;
      blockNumber: number | null;
      transactionIndex: number | null;
      from: string;
      to: string | null;
      value: BigNumber;
      gasPrice: BigNumber;
      gas: number;
      input: string;
    }

    export interface TransactionReceipt {
      blockHash: string;
      blockNumber: number;
      transactionHash: string;
      transactionIndex: number;
      from: string;
      to: string;
      status: null | string | 0 | 1;
      cumulativeGasUsed: number;
      gasUsed: number;
      contractAddress: string | null;
      logs: LogEntry[];
    }

    export interface FilterObject {
      fromBlock?: number | string;
      toBlock?: number | string;
      address?: string;
      topics?: LogTopic[];
    }

    export interface LogEntry {
      logIndex: number | null;
      transactionIndex: number | null;
      transactionHash: string;
      blockHash: string | null;
      blockNumber: number | null;
      address: string;
      data: string;
      topics: string[];
    }
    export interface LogEntryEvent extends LogEntry {
      removed: boolean;
    }

    export interface Provider {
      sendAsync(payload: JSONRPCRequestPayload, callback: JSONRPCErrorCallback): void;
    }

    export interface JSONRPCRequestPayload {
      params: any[];
      method: string;
      id: number;
      jsonrpc: string;
    }

    export interface JSONRPCResponsePayload {
      result: any;
      id: number;
      jsonrpc: string;
    }

    export type JSONRPCErrorCallback = (err: Error | null, result?: JSONRPCResponsePayload) => void;

    export interface ContractInstance {
      address: string;
      abi: ContractAbi;
      [name: string]: any;
    }

    export interface Contract<A extends ContractInstance> {
      at(address: string): A;
      getData(...args: any[]): string;
      "new"(...args: any[]): A;
    }

    export interface FilterResult {
      get(callback: () => void): void;
      watch(callback: (err: Error, result: LogEntryEvent) => void): void;
      stopWatching(callback?: () => void): void;
    }

    export interface Sha3Options {
      encoding: "hex";
    }

    interface EthApi {
      coinbase: string;
      mining: boolean;
      hashrate: number;
      gasPrice: BigNumber.BigNumber;
      accounts: string[];
      blockNumber: number;
      defaultAccount?: string;
      defaultBlock: BlockParam;
      syncing: Web3.SyncingResult;
      compile: {
        solidity(sourceString: string, cb?: (err: Error, result: any) => void): object;
      };
      getMining(cd: (err: Error, mining: boolean) => void): void;
      getHashrate(cd: (err: Error, hashrate: number) => void): void;
      getGasPrice(cd: (err: Error, gasPrice: BigNumber.BigNumber) => void): void;
      getAccounts(cd: (err: Error, accounts: string[]) => void): void;
      getBlockNumber(callback: (err: Error, blockNumber: number) => void): void;
      getSyncing(cd: (err: Error, syncing: Web3.SyncingResult) => void): void;
      isSyncing(cb: (err: Error, isSyncing: boolean, syncingState: Web3.SyncingState) => void): Web3.IsSyncing;

      getBlock(hashStringOrBlockNumber: string | BlockParam): BlockWithoutTransactionData;
      getBlock(
        hashStringOrBlockNumber: string | BlockParam,
        callback: (err: Error, blockObj: BlockWithoutTransactionData) => void,
      ): void;
      getBlock(hashStringOrBlockNumber: string | BlockParam, returnTransactionObjects: true): BlockWithTransactionData;
      getBlock(
        hashStringOrBlockNumber: string | BlockParam,
        returnTransactionObjects: true,
        callback: (err: Error, blockObj: BlockWithTransactionData) => void,
      ): void;

      getBlockTransactionCount(hashStringOrBlockNumber: string | BlockParam): number;
      getBlockTransactionCount(
        hashStringOrBlockNumber: string | BlockParam,
        callback: (err: Error, blockTransactionCount: number) => void,
      ): void;

      // TODO returnTransactionObjects
      getUncle(hashStringOrBlockNumber: string | BlockParam, uncleNumber: number): BlockWithoutTransactionData;
      getUncle(
        hashStringOrBlockNumber: string | BlockParam,
        uncleNumber: number,
        callback: (err: Error, uncle: BlockWithoutTransactionData) => void,
      ): void;

      getTransaction(transactionHash: string): Transaction;
      getTransaction(transactionHash: string, callback: (err: Error, transaction: Transaction) => void): void;

      getTransactionFromBlock(hashStringOrBlockNumber: string | BlockParam, indexNumber: number): Transaction;
      getTransactionFromBlock(
        hashStringOrBlockNumber: string | BlockParam,
        indexNumber: number,
        callback: (err: Error, transaction: Transaction) => void,
      ): void;

      contract(abi: AbiDefinition[]): Web3.Contract<any>;

      // TODO block param
      getBalance(addressHexString: string): BigNumber.BigNumber;
      getBalance(addressHexString: string, callback: (err: Error, result: BigNumber.BigNumber) => void): void;

      // TODO block param
      getStorageAt(address: string, position: number): string;
      getStorageAt(address: string, position: number, callback: (err: Error, storage: string) => void): void;

      // TODO block param
      getCode(addressHexString: string): string;
      getCode(addressHexString: string, callback: (err: Error, code: string) => void): void;

      filter(value: string | FilterObject): Web3.FilterResult;

      sendTransaction(txData: TxData): string;
      sendTransaction(txData: TxData, callback: (err: Error, value: string) => void): void;

      sendRawTransaction(rawTxData: string): string;
      sendRawTransaction(rawTxData: string, callback: (err: Error, value: string) => void): void;

      sign(address: string, data: string): string;
      sign(address: string, data: string, callback: (err: Error, signature: string) => void): void;

      getTransactionReceipt(txHash: string): TransactionReceipt | null;
      getTransactionReceipt(txHash: string, callback: (err: Error, receipt: TransactionReceipt | null) => void): void;

      // TODO block param
      call(callData: CallData): string;
      call(callData: CallData, callback: (err: Error, result: string) => void): void;

      estimateGas(callData: CallData): number;
      estimateGas(callData: CallData, callback: (err: Error, gas: number) => void): void;

      // TODO defaultBlock
      getTransactionCount(address: string): number;
      getTransactionCount(address: string, callback: (err: Error, count: number) => void): void;
    }

    interface VersionApi {
      api: string;
      network: string;
      node: string;
      ethereum: string;
      whisper: string;
      getNetwork(cd: (err: Error, networkId: string) => void): void;
      getNode(cd: (err: Error, nodeVersion: string) => void): void;
      getEthereum(cd: (err: Error, ethereum: string) => void): void;
      getWhisper(cd: (err: Error, whisper: string) => void): void;
    }

    interface PersonalApi {
      listAccounts: string[] | undefined;
      newAccount(password?: string): string;
      unlockAccount(address: string, password?: string, duration?: number): boolean;
      lockAccount(address: string): boolean;
      sign(message: string, account: string, password: string): string;
      sign(hexMessage: string, account: string, callback: (error: Error, signature: string) => void): void;
    }

    interface NetApi {
      listening: boolean;
      peerCount: number;
      getListening(cd: (err: Error, listening: boolean) => void): void;
      getPeerCount(cd: (err: Error, peerCount: number) => void): void;
    }

    export interface SyncingState {
      startingBlock: number;
      currentBlock: number;
      highestBlock: number;
    }
    export type SyncingResult = false | SyncingState;

    export interface IsSyncing {
      addCallback(cb: (err: Error, isSyncing: boolean, syncingState: SyncingState) => void): void;
      stopWatching(): void;
    }
  }
  /* tslint:disable */
  export = Web3;
  /* tslint:enable */
}
