import { isUndefined } from "lodash";

import { AbiType, DecodedLogEntry } from "@joincivil/typescript-types";

import Web3 = require("web3");
import { Log, Callback } from "web3/types";
import { ABIDefinition as AbiItem } from "web3/eth/abi";
import { JsonRPCRequest, JsonRPCResponse } from "web3/providers";

const stubProvider = {
  send: (payload: JsonRPCRequest, callback: Callback<JsonRPCResponse>) => ({}),
  host: "x",
  supportsSubscriptions: () => false,
  sendBatch: async (methods: any, moduleInstance: any) => Promise.reject([]),
};

export class AbiDecoder {
  private savedABIs: any[] = [];
  private methodIds: { [signatureHash: string]: AbiItem } = {};

  constructor(abiArrays: any[][]) {
    abiArrays.forEach(this.addABI.bind(this));
  }

  public tryToDecodeLogOrNoop<LogType extends DecodedLogEntry = DecodedLogEntry>(log: Log): LogType {
    const methodId = log.topics[0];
    const event = this.methodIds[methodId as string];

    if (isUndefined(event)) {
      // @ts-ignore
      return log;
    }
    const decoded = new Web3(stubProvider).eth.abi.decodeLog(event.inputs!, log.data, log.topics);
    return ({
      ...log,
      event: event.name as any,
      args: decoded,
    } as any) as LogType;
  }
  private addABI(abiArray: AbiItem[]): void {
    abiArray.forEach(abi => {
      if (abi.type === AbiType.Event) {
        const abiTypes = abi.inputs!.map(input => input.type);
        const signature = `${abi.name}(${abiTypes.join(",")})`;
        const signatureHash = new Web3(stubProvider).utils.sha3(signature);
        this.methodIds[signatureHash] = abi;
      }
    });
    this.savedABIs = this.savedABIs.concat(abiArray);
  }
}

/*
Copyright 2017 ZeroEx Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
