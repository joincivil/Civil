import { EthAddress, Hex } from "@joincivil/typescript-types";
import { soliditySha3 } from "./crypto";

export function getVoteSaltHash(vote: string, salt: string): string {
  return soliditySha3(["uint", "uint"], [vote, salt]);
}

export function prepareNewsroomMessage(newsroomAddress: EthAddress, contentHash: Hex): Hex {
  // TODO(ritave): We might want to use Metamask's typed signining procedure which would explain
  //               Sadly it's only supported by Metamask so not yet
  //               https://medium.com/metamask/scaling-web3-with-signtypeddata-91d6efc8b290
  return soliditySha3(["address", "bytes32"], [newsroomAddress, contentHash]);
}
