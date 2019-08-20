import { advanceEvmTime } from "@joincivil/dev-utils";
import { DecodedLogEntry } from "@joincivil/typescript-types";
import { getVoteSaltHash } from "@joincivil/utils";
import * as fs from "fs";
import { promisify } from "util";
// We're just using types from web3
import Web3 = require("web3");
import ethApi from "./getethapi";
import { TransactionReceipt } from "web3/types";
import { Block, Transaction } from "web3/eth/types";

import { BN } from "bn.js";

// advanceEvmTime was moved to dev-utils
// We would need to update ALL the tests, this is a workaround
export { advanceEvmTime } from "@joincivil/dev-utils";

const NoOpTokenController = artifacts.require("NoOpTokenController");
const Token = artifacts.require("CVLToken");

const PLCRVoting = artifacts.require("CivilPLCRVoting");
const CivilParameterizer = artifacts.require("CivilParameterizer");
const AddressRegistry = artifacts.require("AddressRegistry");
const RestrictedAddressRegistry = artifacts.require("RestrictedAddressRegistry");
const ContractAddressRegistry = artifacts.require("ContractAddressRegistry");
const CivilTCR = artifacts.require("CivilTCR");
const Government = artifacts.require("Government");
const Newsroom = artifacts.require("Newsroom");
const DummyTokenTelemetry = artifacts.require("DummyTokenTelemetry");

configureProviders(
  PLCRVoting,
  CivilParameterizer,
  AddressRegistry,
  RestrictedAddressRegistry,
  ContractAddressRegistry,
  CivilTCR,
  Government,
  Newsroom,
  DummyTokenTelemetry,
);

const config = JSON.parse(fs.readFileSync("./conf/config.json").toString());
export const paramConfig = config.nets.ganache.paramDefaults; // always ganache when testing

export function findEvent<T = any>(tx: any, eventName: string): DecodedLogEntry<T> | undefined {
  return tx.logs.find((log: any) => log.event === eventName);
}

export function getReceiptValue(receipt: any, arg: any): any {
  return receipt.logs[0].args[arg];
}

export async function getBlockTimestamp(): Promise<any> {
  const blockNumberPromise = promisify<number>(web3.eth.getBlockNumber.bind(web3.eth));
  const blockNumber = await blockNumberPromise();
  const getBlock = promisify<number, Block>(web3.eth.getBlock.bind(web3.eth));
  return (await getBlock(blockNumber)).timestamp;
}

export async function timestampFromTx(web3: Web3, tx: Transaction | TransactionReceipt): Promise<number> {
  if (tx.blockNumber === null) {
    throw new Error("Transaction not yet mined");
  }

  return (await web3.eth.getBlock(tx.blockNumber)).timestamp as number;
}

export async function proposeReparamAndGetPropID(
  propName: string,
  propValue: BN,
  parameterizer: any,
  account: string,
): Promise<any> {
  const receipt = await parameterizer.proposeReparameterization(propName, propValue, { from: account });
  return receipt.logs[0].args.propID;
}

export async function challengeAndGetPollID(listing: string, account: string, registry: any): Promise<string> {
  const receipt = await registry.challenge(listing, "0x", { from: account });
  return receipt.logs[0].args.challengeID;
}

export async function challengeAppealAndGetPollID(listing: string, account: string, registry: any): Promise<string> {
  const receipt = await registry.challengeGrantedAppeal(listing, "0x", { from: account });
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
  salt: string = "123",
): Promise<string> {
  const votingAddress = await registry.voting();
  const voting = await PLCRVoting.at(votingAddress);
  const pollID = await challengeAndGetPollID(listing, challenger, registry);
  await commitVote(voting, pollID, "0", "100", salt, voter);
  await advanceEvmTime(paramConfig.commitStageLength + 1);
  await voting.revealVote(pollID, "0", salt, { from: voter });
  await advanceEvmTime(paramConfig.revealStageLength + 1);
  return pollID;
}

export async function simpleUnsuccessfulChallenge(
  registry: any,
  listing: string,
  challenger: string,
  voter: string,
  salt: string = "420",
): Promise<string> {
  const votingAddress = await registry.voting();
  const voting = await PLCRVoting.at(votingAddress);
  const pollID = await challengeAndGetPollID(listing, challenger, registry);
  await commitVote(voting, pollID, "1", "100", salt, voter);
  await advanceEvmTime(paramConfig.commitStageLength + 1);
  await voting.revealVote(pollID, "1", salt, { from: voter });
  await advanceEvmTime(paramConfig.revealStageLength + 1);
  return pollID;
}

export async function simpleSuccessfulAppealChallenge(
  registry: any,
  listing: string,
  challenger: string,
  voter: string,
  salt: string = "123",
): Promise<string> {
  const votingAddress = await registry.voting();
  const voting = await PLCRVoting.at(votingAddress);
  const pollID = await challengeAppealAndGetPollID(listing, challenger, registry);
  await commitVote(voting, pollID, "1", "100", salt, voter);
  await advanceEvmTime(paramConfig.appealChallengeCommitStageLength + 1);
  await voting.revealVote(pollID, "1", salt, { from: voter });
  await advanceEvmTime(paramConfig.appealChallengeRevealStageLength + 1);
  return pollID;
}

export async function simpleUnsuccessfulAppealChallenge(
  registry: any,
  listing: string,
  challenger: string,
  voter: string,
  salt: string = "420",
): Promise<string> {
  const votingAddress = await registry.voting();
  const voting = await PLCRVoting.at(votingAddress);
  const pollID = await challengeAppealAndGetPollID(listing, challenger, registry);
  await commitVote(voting, pollID, "0", "100", salt, voter);
  await advanceEvmTime(paramConfig.appealChallengeCommitStageLength + 1);
  await voting.revealVote(pollID, "0", salt, { from: voter });
  await advanceEvmTime(paramConfig.appealChallengeRevealStageLength + 1);
  return pollID;
}

export async function addToWhitelist(
  listingAddress: string,
  deposit: BN,
  account: string,
  registry: any,
): Promise<void> {
  await registry.apply(listingAddress, deposit, "0x", { from: account });
  await advanceEvmTime(paramConfig.applyStageLength + 1);
  await registry.updateStatus(listingAddress, { from: account });
}

export function getChallengeReward(): BN {
  const reward = new BN(100)
    .sub(new BN(paramConfig.dispensationPct))
    .mul(new BN(paramConfig.minDeposit))
    .div(new BN(100));

  return reward;
}

export function getAppealChallengeReward(): BN {
  const fee = new BN(paramConfig.appealFeeAmount);
  const reward = new BN(100)
    .sub(new BN(paramConfig.appealChallengeVoteDispensationPct))
    .mul(fee)
    .div(new BN(100));

  return fee.sub(reward);
}

export function getTotalVoterReward(): BN {
  const totalVoterReward = new BN(paramConfig.minDeposit).sub(getChallengeReward());
  return totalVoterReward;
}

export function getTotalAppealChallengeVoterReward(): BN {
  const totalVoterReward = new BN(paramConfig.appealFeeAmount).sub(getAppealChallengeReward());
  return totalVoterReward;
}

export function toBaseTenBigNumber(p: number): BN {
  return new BN(p.toString(10));
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

export function divideAndGetWei(numerator: number | BN, denominator: number): BN {
  const weiNumerator = new BN(web3.utils.toWei(numerator.toString(), "gwei"));
  return weiNumerator.div(new BN(denominator));
}

export function multiplyFromWei(x: number | BN, weiBN: BN): BN {
  const xBN = typeof x === "number" ? new BN(x) : x;
  const weiProduct = xBN.mul(weiBN);
  return new BN(web3.utils.fromWei(weiProduct.toString(), "gwei"));
}

export function multiplyByPercentage(x: number | BN, y: number | BN, z: number = 100): BN {
  const weiQuotient = divideAndGetWei(y, z);
  return multiplyFromWei(x, weiQuotient);
}

async function giveTokensTo(totalSupply: BN, addresses: string[], accounts: string[], token: any): Promise<boolean> {
  const user = addresses[0];
  const allocation = totalSupply.div(new BN(accounts.length));
  await token.transfer(user, allocation);

  if (addresses.length === 1) {
    return true;
  }
  return giveTokensTo(totalSupply, addresses.slice(1), accounts, token);
}

async function createAndDistributeToken(totalSupply: BN, decimals: string, addresses: string[]): Promise<any> {
  const controller = await NoOpTokenController.new();
  const token = await Token.new(totalSupply, "TestCoin", decimals, "TEST", controller.address);
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
  const parameterizerConfig = config.nets.ganache.paramDefaults; // always ganache when testing
  const tokenAddress = await parameterizer.token();
  const plcrAddress = await parameterizer.voting();
  const parameterizerAddress = await parameterizer.address;
  const token = await Token.at(tokenAddress);
  const government = await Government.new(
    appellateEntity,
    appellateEntity,
    plcrAddress,
    parameterizerConfig.appealFeeAmount,
    parameterizerConfig.requestAppealPhaseLength,
    parameterizerConfig.judgeAppealPhaseLength,
    parameterizerConfig.appealSupermajorityPercentage,
    parameterizerConfig.appealChallengeVoteDispensationPct,
    0,
    parameterizerConfig.govtPCommitStageLength,
    parameterizerConfig.govtPRevealStageLength,
    parameterizerConfig.constitutionHash,
    parameterizerConfig.constitutionURI,
  );

  const registry = await CivilTCR.new(tokenAddress, plcrAddress, parameterizerAddress, government.address);

  await approveRegistryFor(accounts.slice(0, 8));
  return registry;
}

async function createTestTokenInstance(accounts: string[]): Promise<any> {
  return createAndDistributeToken(new BN("1000000000000000000000000"), "18", accounts);
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
  const telemetryAddress = await telemetry.address;
  const plcr = await PLCRVoting.new(token.address, telemetryAddress);
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
  const parameterizerConfig = config.nets.ganache.paramDefaults; // always ganache when testing

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

export async function createAllTestParameterizerInstance(accounts: string[]): Promise<any> {
  const telemetry = await DummyTokenTelemetry.new();
  const token = await createTestTokenInstance(accounts);
  const plcr = await createTestPLCRInstance(token, telemetry, accounts);
  const parameterizer = await createTestParameterizerInstance(accounts, token, plcr);
  return [parameterizer, telemetry];
}

export async function createAllTestAddressRegistryInstance(accounts: string[]): Promise<any> {
  const [parameterizer] = await createAllTestParameterizerInstance(accounts);
  return createTestRegistryInstance(AddressRegistry, parameterizer, accounts);
}

export async function createAllTestRestrictedAddressRegistryInstance(accounts: string[]): Promise<any> {
  const [parameterizer] = await createAllTestParameterizerInstance(accounts);
  return createTestRegistryInstance(RestrictedAddressRegistry, parameterizer, accounts);
}

export async function createAllTestContractAddressRegistryInstance(accounts: string[]): Promise<any> {
  const [parameterizer] = await createAllTestParameterizerInstance(accounts);
  return createTestRegistryInstance(ContractAddressRegistry, parameterizer, accounts);
}

export async function createAllCivilTCRInstance(accounts: string[], appellateEntity: string): Promise<any> {
  const [parameterizer, telemetry] = await createAllTestParameterizerInstance(accounts);
  return createTestCivilTCRInstance(parameterizer, telemetry, accounts, appellateEntity);
}

export async function createDummyNewsrom(from?: string): Promise<any> {
  return Newsroom.new("Fake newsroom name", "http://fakenewsroomcharter.com", web3.utils.sha3("hello"), { from });
}

export function configureProviders(...contracts: any[]): void {
  // TODO(ritave): Use our own contracts
  contracts.forEach(contract => contract.setProvider(ethApi.currentProvider));
}
