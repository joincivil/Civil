import { EthAddress } from "../../types";

export interface Contract {
  readonly address: EthAddress;
  owner?: { callAsync(): Promise<EthAddress> };
}
