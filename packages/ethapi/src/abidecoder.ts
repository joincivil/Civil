import { isUndefined } from "lodash";

import { AbiType, DecodedLogEntry } from "@joincivil/typescript-types";

import Web3 from "web3";
import { Log } from "web3-core";
import { AbiItem } from "web3-utils";
import { JsonRpcPayload } from "web3-core-helpers";

// JsonRpcResponse is in the latest version of web3-core-helpers but not released yet
type JsonRpcResponse = any;

const stubProvider = {
  send: (payload: JsonRpcPayload, callback: JsonRpcResponse) => ({}),
  host: "x",
  supportsSubscriptions: () => false,
  sendBatch: async (methods: any, moduleInstance: any) => Promise.reject([]),
  connected: false,
  disconnect: () => true,
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
    // @ts-ignore
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
