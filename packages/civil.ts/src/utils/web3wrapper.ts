import { Observable } from "rxjs";
import * as Web3 from "web3";

import { Artifact, MapObject } from "../types";

export class Web3Wrapper {
  public static streamifyEvents<T extends Web3.ContractInstance>(instance: T): T {
    for (const abiInput of instance.abi) {
      if (abiInput.type === "event") {
        instance[abiInput.name + "Stream"] = (paramFilters: MapObject, filterObject?: Web3.FilterObject) => {
          return new Observable((subscriber) => {
            const filter: Web3.FilterResult = instance[abiInput.name](paramFilters, filterObject);
            let errored = false;
            filter.watch((err, event) => {
              if (err) {
                subscriber.error(err);
                errored = true;
                return filter.stopWatching();
              }
              subscriber.next(event);
            });

            return () => {
              if (!errored) {
                filter.stopWatching(() => subscriber.complete());
              }
            };
          });
        };
      }
    }
    return instance;
  }

  public web3: Web3;

  constructor(provider: Web3.Provider) {
    this.setProvider(provider);
  }

  public setProvider(provider: Web3.Provider) {
    this.web3 = new Web3(provider);
  }

  public getContract<T extends Web3.Contract<any>>(artifact: Artifact): T {
    return this.web3.eth.contract(artifact.abi) as T;
  }
}
