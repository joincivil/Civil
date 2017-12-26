import { Observable } from "rxjs";
import { Subject } from "rxjs/Subject";
import * as Web3 from "web3";

import { Artifact, EthAddress, EventFunction, MapObject } from "../types";
import { Web3Wrapper } from "../utils/web3wrapper";

// TOOD(ritave): use @0xproject/abi-gen tool to generate nicer types
export abstract class BaseContract<T extends Web3.ContractInstance> {
  protected contract: Web3.Contract<T>;
  protected instance: T;
  protected cache: { [key: string]: any };

  protected web3Wrapper: Web3Wrapper;

  constructor(web3Wrapper: Web3Wrapper, artifact: Artifact, address: EthAddress) {
    this.web3Wrapper = web3Wrapper;
    this.contract = this.web3Wrapper.getContract(artifact);
    this.instance = Web3Wrapper.streamifyEvents(this.contract.at(address));
  }

  protected cachedPropOrBlockchain<V>(property: string): () => Promise<V> {
    return async () => {
      if (this.cache[property]) {
        return this.cache[property];
      }
      const value = await this.instance[property].call();
      this.cache[property] = value;
      return value;
    };
  }
}
