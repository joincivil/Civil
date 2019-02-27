import { EthAddress, Hex } from "@joincivil/typescript-types";
import { soliditySha3 } from "./crypto";

export function getVoteSaltHash(vote: string, salt: string): string {
  return soliditySha3(["uint", "uint"], [vote, salt]);
}

/** For Proof of Use UserGroups smart-contract forceUnion */
export function prepareForceUnionMessage(
  userGroupsAddress: EthAddress,
  addressA: EthAddress,
  addressB: EthAddress,
): Hex {
  return soliditySha3(
    ["address", "bytes32"],
    [userGroupsAddress, soliditySha3(["address", "address"], [addressA, addressB])],
  );
}

export function prepareMaxGroupSizeMessage(userGroupsAddress: EthAddress, nonce: number, groupSize: number): Hex {
  return soliditySha3(["address", "bytes32"], [userGroupsAddress, soliditySha3(["uint", "uint"], [nonce, groupSize])]);
}

export function prepareNewsroomMessage(newsroomAddress: EthAddress, contentHash: Hex): Hex {
  // TODO(ritave): We might want to use Metamask's typed signining procedure which would explain
  //               Sadly it's only supported by Metamask so not yet
  //               https://medium.com/metamask/scaling-web3-with-signtypeddata-91d6efc8b290
  return soliditySha3(["address", "bytes32"], [newsroomAddress, contentHash]);
}

export function prepareUserFriendlyNewsroomMessage(
  newsroomAddress: EthAddress,
  contentHash: Hex,
  name?: string,
): string {
  return `I authorize ${
    name ? name : "this newsroom"
  } to publish this post and verify its content.\n\nNewsroom address:\n${newsroomAddress}\n\nPost content hash:\n${contentHash}`;
}

export function prepareConstitutionSignMessage(newsroomName: string, constitutionHash: Hex): string {
  return `By signing this message, I am agreeing on behalf of the Newsroom to abide by the Civil Community's ethical principles as described in the Civil Constitution.\n\nNewsrooom Name:\n${newsroomName}\n\nConstitution Hash:\n${constitutionHash}`;
}

export function getDefaultFromBlock(network: number): number {
  // A map of the network id to its corresponding default fromBlock, which
  // could be the TCR genesis block or possibly the geneis block of the
  // first Newsroom contract on that network
  const defaultFromBlocks: { [index: string]: number } = {
    1: 6904575,
    4: 3689706,
    50: 0,
  };
  return defaultFromBlocks[network.toString()] || 0;
}

const urlRegex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
export function isValidHttpUrl(url: string): boolean {
  if (url.indexOf("http") !== 0) {
    return false;
  }

  if (!window.URL) {
    return !!url.match(urlRegex);
  }

  try {
    // tslint:disable-next-line:no-unused-expression
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

export enum Parameters {
  minDeposit = "minDeposit",
  pMinDeposit = "pMinDeposit",
  applyStageLen = "applyStageLen",
  pApplyStageLen = "pApplyStageLen",
  commitStageLen = "commitStageLen",
  pCommitStageLen = "pCommitStageLen",
  revealStageLen = "revealStageLen",
  pRevealStageLen = "pRevealStageLen",
  dispensationPct = "dispensationPct",
  pDispensationPct = "pDispensationPct",
  voteQuorum = "voteQuorum",
  pVoteQuorum = "pVoteQuorum",
  challengeAppealLen = "challengeAppealLen",
  challengeAppealCommitLen = "challengeAppealCommitLen",
  challengeAppealRevealLen = "challengeAppealRevealLen",
}

export enum GovernmentParameters {
  requestAppealLen = "requestAppealLen",
  judgeAppealLen = "judgeAppealLen",
  appealFee = "appealFee",
  appealVotePercentage = "appealVotePercentage",
  appealChallengeVoteDispensationPct = "appealChallengeVoteDispensationPct",
  govtPCommitStageLen = "govtPCommitStageLen",
  govtPRevealStageLen = "govtPRevealStageLen",
}

export function getInfuraUrlFromIpfs(ipfsUrl: string): string {
  const hash = ipfsUrl.split("://")[1];
  return `https://ipfs.infura.io/ipfs/${hash}`;
}
