import abi = require("ethereumjs-abi");

export function getVoteSaltHash(vote: string, salt: string): string {
  return `0x${abi.soliditySHA3(["uint", "uint"], [vote, salt]).toString("hex")}`;
}
