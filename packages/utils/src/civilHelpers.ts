import { soliditySHA3 } from "ethereumjs-abi";

export function getVoteSaltHash(vote: string, salt: string): string {
  return `0x${soliditySHA3(["uint", "uint"], [vote, salt]).toString("hex")}`;
}
