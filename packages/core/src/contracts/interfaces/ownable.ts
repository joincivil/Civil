import { EthAddress } from "../../types";
import { Contract } from "./contract";

export interface OwnableContract extends Contract {
  owner: { callAsync(): Promise<EthAddress> };
}
