import { EthAddress } from "../../types";

export interface OwnableContract {
  owner: { callAsync(): Promise<EthAddress> };
}
