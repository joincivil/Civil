/*
 * This file is used from the 0xproject and it's on Apache 2.0 License
 * https://github.com/0xProject/0x.js/blob/development/packages/0x.js/src/utils/abi_decoder.ts
 * See bottom of the file for the license
 *
 * The changes are mostly stylistic to conform to the linter, minor types and usage of ES6 features
 * instead of reundant lodash ones
 */

import BigNumber from "bignumber.js";
import { isUndefined, padStart, startsWith } from "lodash";
import * as Web3 from "web3";
// TODO(ritave): Use ethereumjs-abi
import * as SolidityCoder from "web3/lib/solidity/coder";
import { AbiType, DecodedLogEntry, SolidityTypes } from "../../typescript-types/build";

const HEX_START = "0x";
const ADDRESS_LENGTH_CHAR = 40;
const ADDRESS_LENGTH_BYTES = 16;

export class AbiDecoder {
  private static _padZeros(address: string): string {
    let formatted = address;
    if (startsWith(formatted, HEX_START)) {
      formatted = formatted.slice(HEX_START.length);
    }

    formatted = padStart(formatted, ADDRESS_LENGTH_CHAR, "0");
    return `0x${formatted}`;
  }

  private savedABIs: Web3.AbiDefinition[] = [];
  private methodIds: { [signatureHash: string]: Web3.EventAbi } = {};

  constructor(abiArrays: Web3.AbiDefinition[][]) {
    abiArrays.forEach(this.addABI.bind(this));
  }

  public tryToDecodeLogOrNoop<LogType extends DecodedLogEntry = DecodedLogEntry>(
    log: Web3.LogEntry,
  ): LogType | Web3.LogEntry {
    const methodId = log.topics[0];
    const event = this.methodIds[methodId];
    if (isUndefined(event)) {
      return log;
    }
    const logData = log.data;
    const decodedParams: any = {};
    let dataIndex = 0;
    let topicsIndex = 1;

    const nonIndexedInputs = event.inputs.filter(input => !input.indexed);
    const dataTypes = nonIndexedInputs.map(input => input.type);
    const decodedData = SolidityCoder.decodeParams(dataTypes, logData.slice("0x".length));

    event.inputs.forEach((param: Web3.EventParameter) => {
      // Indexed parameters are stored in topics. Non-indexed ones in decodedData
      let value = param.indexed ? log.topics[topicsIndex++] : decodedData[dataIndex++];
      if (param.type === SolidityTypes.Address) {
        value = AbiDecoder._padZeros(new BigNumber(value).toString(ADDRESS_LENGTH_BYTES));
      } else if (
        param.type === SolidityTypes.Uint256 ||
        param.type === SolidityTypes.Uint8 ||
        param.type === SolidityTypes.Uint
      ) {
        value = new BigNumber(value);
      }
      decodedParams[param.name] = value;
    });

    // Due to event.name being run-time and not a literal, we're forced to manually cast
    return ({
      ...log,
      event: event.name as any,
      args: decodedParams,
    } as any) as LogType;
  }
  private addABI(abiArray: Web3.AbiDefinition[]): void {
    abiArray.forEach((abi: Web3.AbiDefinition) => {
      if (abi.type === AbiType.Event) {
        const abiTypes = abi.inputs.map(input => input.type);
        const signature = `${abi.name}(${abiTypes.join(",")})`;
        const signatureHash = new Web3().sha3(signature);
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
