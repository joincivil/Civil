import { advanceEvmTime } from "@joincivil/dev-utils";
import { DecodedLogEntry } from "@joincivil/typescript-types";
import { getVoteSaltHash } from "@joincivil/utils";
import BigNumber from "bignumber.js";
import * as fs from "fs";
import { promisify } from "util";
// We're just using types from web3
// tslint:disable-next-line:no-implicit-dependencies
import * as Web3 from "web3";
import ethApi from "./getethapi";

// advanceEvmTime was moved to dev-utils
// We would need to update ALL the tests, this is a workaround
export { advanceEvmTime } from "@joincivil/dev-utils";

const Token = artifacts.require("tokens/eip20/EIP20");

const PLCRVoting = artifacts.require("CivilPLCRVoting");
const CivilParameterizer = artifacts.require("CivilParameterizer");
const AddressRegistry = artifacts.require("AddressRegistry");
const RestrictedAddressRegistry = artifacts.require("RestrictedAddressRegistry");
const ContractAddressRegistry = artifacts.require("ContractAddressRegistry");
const CivilTCR = artifacts.require("CivilTCR");
const Government = artifacts.require("Government");
const Newsroom = artifacts.require("Newsroom");
const TokenTelemetry = artifacts.require("TokenTelemetry");
configureProviders(
  PLCRVoting,
  CivilParameterizer,
  AddressRegistry,
  RestrictedAddressRegistry,
  ContractAddressRegistry,
  CivilTCR,
  Government,
  Newsroom,
);

const config = JSON.parse(fs.readFileSync("./conf/config.json").toString());
export const paramConfig = config.paramDefaults;

export function findEvent<T = any>(tx: any, eventName: string): DecodedLogEntry<T> | undefined {
  return tx.logs.find((log: any) => log.event === eventName);
}

export function getReceiptValue(receipt: any, arg: any): any {
  return receipt.logs[0].args[arg];
}

export async function getBlockTimestamp(): Promise<any> {
  const blockNumberPromise = promisify<number>(web3.eth.getBlockNumber.bind(web3.eth));
  const blockNumber = await blockNumberPromise();
  const getBlock = promisify<number, Web3.BlockWithoutTransactionData>(web3.eth.getBlock.bind(web3.eth));
  return (await getBlock(blockNumber)).timestamp;
}

export async function timestampFromTx(web3: Web3, tx: Web3.Transaction | Web3.TransactionReceipt): Promise<number> {
  if (tx.blockNumber === null) {
    throw new Error("Transaction not yet mined");
  }
  const getBlock = promisify<number, Web3.BlockWithoutTransactionData>(web3.eth.getBlock.bind(web3.eth));
  return (await getBlock(tx.blockNumber)).timestamp;
}

export async function proposeReparamAndGetPropID(
  propName: string,
  propValue: BigNumber,
  parameterizer: any,
  account: string,
): Promise<any> {
  const receipt = await parameterizer.proposeReparameterization(propName, propValue, { from: account });
  return receipt.logs[0].args.propID;
}

export async function challengeAndGetPollID(listing: string, account: string, registry: any): Promise<string> {
  const receipt = await registry.challenge(listing, "", { from: account });
  return receipt.logs[0].args.challengeID;
}

export async function challengeAppealAndGetPollID(listing: string, account: string, registry: any): Promise<string> {
  const receipt = await registry.challengeGrantedAppeal(listing, "", { from: account });
  return receipt.logs[0].args.appealChallengeID;
}

export async function challengeReparamAndGetPollID(
  propID: string,
  account: string,
  parameterizer: any,
): Promise<string> {
  const receipt = await parameterizer.challengeReparameterization(propID, { from: account });
  return receipt.logs[0].args.challengeID;
}

export async function simpleSuccessfulChallenge(
  registry: any,
  listing: string,
  challenger: string,
  voter: string,
): Promise<void> {
  const votingAddress = await registry.voting();
  const voting = PLCRVoting.at(votingAddress);
  const pollID = await challengeAndGetPollID(listing, challenger, registry);
  await commitVote(voting, pollID, "0", "100", "123", voter);
  await advanceEvmTime(paramConfig.commitStageLength + 1);
  await voting.revealVote(pollID, "0", "123", { from: voter });
  await advanceEvmTime(paramConfig.revealStageLength + 1);
}

export async function simpleUnsuccessfulChallenge(
  registry: any,
  listing: string,
  challenger: string,
  voter: string,
): Promise<void> {
  const votingAddress = await registry.voting();
  const voting = PLCRVoting.at(votingAddress);
  const pollID = await challengeAndGetPollID(listing, challenger, registry);
  await commitVote(voting, pollID, "1", "100", "420", voter);
  await advanceEvmTime(paramConfig.commitStageLength + 1);
  await voting.revealVote(pollID, "1", "420", { from: voter });
  await advanceEvmTime(paramConfig.revealStageLength + 1);
}

export async function simpleSuccessfulAppealChallenge(
  registry: any,
  listing: string,
  challenger: string,
  voter: string,
): Promise<void> {
  const votingAddress = await registry.voting();
  const voting = PLCRVoting.at(votingAddress);
  const pollID = await challengeAppealAndGetPollID(listing, challenger, registry);
  await commitVote(voting, pollID, "1", "100", "123", voter);
  await advanceEvmTime(paramConfig.appealChallengeCommitStageLength + 1);
  await voting.revealVote(pollID, "1", "123", { from: voter });
  await advanceEvmTime(paramConfig.appealChallengeRevealStageLength + 1);
}

export async function simpleUnsuccessfulAppealChallenge(
  registry: any,
  listing: string,
  challenger: string,
  voter: string,
): Promise<void> {
  const votingAddress = await registry.voting();
  const voting = PLCRVoting.at(votingAddress);
  const pollID = await challengeAppealAndGetPollID(listing, challenger, registry);
  await commitVote(voting, pollID, "0", "100", "420", voter);
  await advanceEvmTime(paramConfig.appealChallengeCommitStageLength + 1);
  await voting.revealVote(pollID, "0", "420", { from: voter });
  await advanceEvmTime(paramConfig.appealChallengeRevealStageLength + 1);
}

export async function addToWhitelist(
  listingAddress: string,
  deposit: BigNumber,
  account: string,
  registry: any,
): Promise<void> {
  await registry.apply(listingAddress, deposit, "", { from: account });
  await advanceEvmTime(paramConfig.applyStageLength + 1);
  await registry.updateStatus(listingAddress, { from: account });
}

export function toBaseTenBigNumber(p: number): BigNumber {
  return new BigNumber(p.toString(10), 10);
}

export async function commitVote(
  voting: any,
  pollID: any,
  voteOption: string,
  tokensArg: string,
  salt: string,
  voter: string,
): Promise<void> {
  const hash = getVoteSaltHash(voteOption, salt);
  await voting.requestVotingRights(tokensArg, { from: voter });

  const prevPollID = await voting.getInsertPointForNumTokens.call(voter, tokensArg, pollID);
  await voting.commitVote(pollID, hash, tokensArg, prevPollID, { from: voter });
}

export function divideAndGetWei(numerator: number, denominator: number): BigNumber {
  const weiNumerator = web3.toWei(new BigNumber(numerator), "gwei");
  return weiNumerator.div(new BigNumber(denominator));
}

export function multiplyFromWei(x: number, weiBN: BigNumber): BigNumber {
  const weiProduct = new BigNumber(x).mul(weiBN);
  return new BigNumber(web3.fromWei(weiProduct, "gwei"));
}

export function multiplyByPercentage(x: number, y: number, z: number = 100): BigNumber {
  const weiQuotient = divideAndGetWei(y, z);
  return multiplyFromWei(x, weiQuotient);
}

async function giveTokensTo(
  totalSupply: BigNumber,
  addresses: string[],
  accounts: string[],
  token: any,
): Promise<boolean> {
  const user = addresses[0];
  const allocation = totalSupply.div(new BigNumber(accounts.length, 10));
  await token.transfer(user, allocation);

  if (addresses.length === 1) {
    return true;
  }
  return giveTokensTo(totalSupply, addresses.slice(1), accounts, token);
}

async function createAndDistributeToken(totalSupply: BigNumber, decimals: string, addresses: string[]): Promise<any> {
  const token = await Token.new(totalSupply, "TestCoin", decimals, "TEST");
  await giveTokensTo(totalSupply, addresses, addresses, token);
  return token;
}

async function createTestRegistryInstance(registryContract: any, parameterizer: any, accounts: string[]): Promise<any> {
  async function approveRegistryFor(addresses: string[]): Promise<boolean> {
    const user = addresses[0];
    const balanceOfUser = await token.balanceOf(user);
    await token.approve(registry.address, balanceOfUser, { from: user });
    if (addresses.length === 1) {
      return true;
    }
    return approveRegistryFor(addresses.slice(1));
  }

  const tokenAddress = await parameterizer.token();
  const plcrAddress = await parameterizer.voting();
  const parameterizerAddress = await parameterizer.address;
  const token = await Token.at(tokenAddress);

  const registry = await registryContract.new(tokenAddress, plcrAddress, parameterizerAddress, "registry");

  await approveRegistryFor(accounts.slice(0, 8));
  return registry;
}

async function createTestCivilTCRInstance(
  parameterizer: any,
  telemetry: any,
  accounts: string[],
  appellateEntity: string,
): Promise<any> {
  async function approveRegistryFor(addresses: string[]): Promise<boolean> {
    const user = addresses[0];
    const balanceOfUser = await token.balanceOf(user);
    await token.approve(registry.address, balanceOfUser, { from: user });
    await token.approve(government.address, balanceOfUser, { from: user });
    if (addresses.length === 1) {
      return true;
    }
    return approveRegistryFor(addresses.slice(1));
  }
  const parameterizerConfig = config.paramDefaults;
  const tokenAddress = await parameterizer.token();
  const plcrAddress = await parameterizer.voting();
  const parameterizerAddress = await parameterizer.address;
  const telemetryAddress = await telemetry.address;
  const token = await Token.at(tokenAddress);
  const government = await Government.new(
    appellateEntity,
    appellateEntity,
    tokenAddress,
    plcrAddress,
    parameterizerConfig.appealFeeAmount,
    parameterizerConfig.requestAppealPhaseLength,
    parameterizerConfig.judgeAppealPhaseLength,
    parameterizerConfig.appealSupermajorityPercentage,
    parameterizerConfig.govtPDeposit,
    parameterizerConfig.govtPCommitStageLength,
    parameterizerConfig.govtPRevealStageLength,
    parameterizerConfig.constitutionHash,
    parameterizerConfig.constitutionURI,
  );

  const registry = await CivilTCR.new(
    tokenAddress,
    plcrAddress,
    parameterizerAddress,
    government.address,
    telemetryAddress,
  );

  await approveRegistryFor(accounts.slice(0, 8));
  return registry;
}

async function createTestTokenInstance(accounts: string[]): Promise<any> {
  return createAndDistributeToken(new BigNumber("1000000000000000000000000"), "18", accounts);
}

async function createTestPLCRInstance(token: any, telemetry: any, accounts: string[]): Promise<any> {
  async function approvePLCRFor(addresses: string[]): Promise<boolean> {
    const user = addresses[0];
    const balanceOfUser = await token.balanceOf(user);

    await token.approve(plcr.address, balanceOfUser, { from: user });
    if (addresses.length === 1) {
      return true;
    }
    return approvePLCRFor(addresses.slice(1));
  }
  const plcr = await PLCRVoting.new(token.address, telemetry.address);
  await approvePLCRFor(accounts);

  return plcr;
}

async function createTestParameterizerInstance(accounts: string[], token: any, plcr: any): Promise<any> {
  async function approveParameterizerFor(addresses: string[]): Promise<boolean> {
    const user = addresses[0];
    const balanceOfUser = await token.balanceOf(user);
    await token.approve(parameterizer.address, balanceOfUser, { from: user });
    if (addresses.length === 1) {
      return true;
    }
    return approveParameterizerFor(addresses.slice(1));
  }
  const parameterizerConfig = config.paramDefaults;

  const params = [
    parameterizerConfig.minDeposit,
    parameterizerConfig.pMinDeposit,
    parameterizerConfig.applyStageLength,
    parameterizerConfig.pApplyStageLength,
    parameterizerConfig.commitStageLength,
    parameterizerConfig.pCommitStageLength,
    parameterizerConfig.revealStageLength,
    parameterizerConfig.pRevealStageLength,
    parameterizerConfig.dispensationPct,
    parameterizerConfig.pDispensationPct,
    parameterizerConfig.voteQuorum,
    parameterizerConfig.pVoteQuorum,
    parameterizerConfig.challengeAppealLength,
    parameterizerConfig.appealChallengeCommitStageLength,
    parameterizerConfig.appealChallengeRevealStageLength,
  ];
  const parameterizer = await CivilParameterizer.new(token.address, plcr.address, params);

  await approveParameterizerFor(accounts);
  return parameterizer;
}

export async function createAllTestParameterizerInstance(telemetry: any, accounts: string[]): Promise<any> {
  const token = await createTestTokenInstance(accounts);
  const plcr = await createTestPLCRInstance(token, telemetry, accounts);
  return createTestParameterizerInstance(accounts, token, plcr);
}

export async function createAllTestAddressRegistryInstance(accounts: string[]): Promise<any> {
  const parameterizer = await createAllTestParameterizerInstance(accounts);
  return createTestRegistryInstance(AddressRegistry, parameterizer, accounts);
}

export async function createAllTestRestrictedAddressRegistryInstance(accounts: string[]): Promise<any> {
  const parameterizer = await createAllTestParameterizerInstance(accounts);
  return createTestRegistryInstance(RestrictedAddressRegistry, parameterizer, accounts);
}

export async function createAllTestContractAddressRegistryInstance(accounts: string[]): Promise<any> {
  const parameterizer = await createAllTestParameterizerInstance(accounts);
  return createTestRegistryInstance(ContractAddressRegistry, parameterizer, accounts);
}

export async function createAllCivilTCRInstance(accounts: string[], appellateEntity: string): Promise<any> {
  const telemetry = await TokenTelemetry.new();
  const parameterizer = await createAllTestParameterizerInstance(telemetry, accounts);
  return createTestCivilTCRInstance(parameterizer, telemetry, accounts, appellateEntity);
}

export async function createDummyNewsrom(from?: string): Promise<any> {
  return Newsroom.new("Fake newsroom name", "http://fakenewsroomcharter.com", web3.sha3(), { from });
}

export function configureProviders(...contracts: any[]): void {
  // TODO(ritave): Use our own contracts
  contracts.forEach(contract => contract.setProvider(ethApi.currentProvider));
}
