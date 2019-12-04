import * as React from "react";
import { TwoStepEthTransaction, Civil } from "@joincivil/core";
import { EthAddress, BigNumber, EthSignedMessage, StorageHeader } from "@joincivil/typescript-types";
import { CivilErrors, getVoteSaltHash } from "@joincivil/utils";
import { CivilContext, ICivilContext } from "@joincivil/components";
import { CivilTCR } from "@joincivil/core/build/src/contracts/tcr/civilTCR";

export const CivilHelperContext = React.createContext<CivilHelper | undefined>(undefined);

export const CivilHelperProvider: React.FunctionComponent = ({ children }) => {
  const civilCtx = React.useContext<ICivilContext>(CivilContext);
  const civilTCR = React.useMemo(() => {
    return new CivilHelper(civilCtx.civil!);
  }, [civilCtx.civil]);
  return <CivilHelperContext.Provider value={civilTCR}>{children}</CivilHelperContext.Provider>;
};

export class CivilHelper {
  public civil: Civil;
  public tcrPromise: Promise<CivilTCR>;

  constructor(civil: Civil) {
    this.civil = civil;
    this.tcrPromise = this.civil.tcrSingletonTrusted();
  }

  public async getTCR(): Promise<CivilTCR> {
    return this.tcrPromise;
  }

  public resolveReparameterizationChallenge = (propID: string) => this.updateReparameterizationProp(propID);

  public approveForProposalChallenge = () => this.approveForProposeReparameterization();

  public async publishContent(content: string): Promise<StorageHeader> {
    const civil = this.civil;
    return civil.publishContent(content);
  }

  public async approveForChallenge(): Promise<TwoStepEthTransaction | void> {
    const civil = this.civil;
    const tcr = await civil.tcrSingletonTrusted();
    const parameterizer = await tcr.getParameterizer();
    const minDeposit = await parameterizer.getParameterValue("minDeposit");
    return this.approve(minDeposit);
  }

  public async approveForApply(multisigAddress?: EthAddress): Promise<TwoStepEthTransaction | void> {
    const civil = this.civil;
    const tcr = await civil.tcrSingletonTrusted();
    const parameterizer = await tcr.getParameterizer();
    const minDeposit = await parameterizer.getParameterValue("minDeposit");
    return this.approve(minDeposit, multisigAddress);
  }

  public async approveForDeposit(
    tokensWei: BigNumber,
    multisigAddress?: EthAddress,
  ): Promise<TwoStepEthTransaction | void> {
    return this.approve(tokensWei, multisigAddress);
  }

  public async approveForAppeal(): Promise<TwoStepEthTransaction | void> {
    const civil = this.civil;
    const tcr = await civil.tcrSingletonTrusted();
    const government = await tcr.getGovernment();
    const appealFee = await government.getAppealFee();
    return this.approve(appealFee);
  }

  public async approveForChallengeGrantedAppeal(): Promise<TwoStepEthTransaction | void> {
    const civil = this.civil;
    const tcr = await civil.tcrSingletonTrusted();
    const government = await tcr.getGovernment();
    const appealFee = await government.getAppealFee();
    return this.approve(appealFee);
  }

  public toWei(amount: number): BigNumber {
    return this.civil.toWei(amount);
  }

  public async approve(amount: BigNumber, multisigAddress?: EthAddress): Promise<TwoStepEthTransaction | void> {
    const civil = this.civil;
    const tcr = await civil.tcrSingletonTrustedMultisigSupport(multisigAddress);
    const token = await tcr.getToken();
    const balance = await token.getBalance();
    if (balance.lt(amount)) {
      throw new Error(CivilErrors.InsufficientToken);
    }
    const approvedTokens = await token.getApprovedTokensForSpender(tcr.address, multisigAddress || undefined);
    if (approvedTokens.lt(amount)) {
      return token.approveSpender(tcr.address, amount);
    }
  }

  public async approveForProposeReparameterization(): Promise<TwoStepEthTransaction | void> {
    const civil = this.civil;
    const tcr = await civil.tcrSingletonTrusted();
    const parameterizer = await tcr.getParameterizer();
    const eip = await tcr.getToken();
    const deposit = await parameterizer.getParameterValue("pMinDeposit");
    const approvedTokensForSpender = await eip.getApprovedTokensForSpender(parameterizer.address);
    if (approvedTokensForSpender.lt(deposit)) {
      return eip.approveSpender(parameterizer.address, deposit);
    }
  }

  public async applyToTCR(address: EthAddress, multisigAddress?: EthAddress): Promise<TwoStepEthTransaction> {
    const civil = this.civil;
    const tcr = await civil.tcrSingletonTrustedMultisigSupport(multisigAddress);
    const parameterizer = await tcr.getParameterizer();
    const deposit = await parameterizer.getParameterValue("minDeposit");
    return tcr.apply(address, deposit, "");
  }

  public async challengeGrantedAppeal(address: EthAddress, data: string = ""): Promise<TwoStepEthTransaction> {
    const civil = this.civil;
    const tcr = await civil.tcrSingletonTrusted();
    return tcr.challengeGrantedAppeal(address, data);
  }

  public async requestAppealWithUri(address: EthAddress, uri: string = ""): Promise<TwoStepEthTransaction> {
    const civil = this.civil;
    const tcr = await civil.tcrSingletonTrusted();
    return tcr.requestAppealWithURI(address, uri);
  }

  public async challengeGrantedAppealWithUri(address: EthAddress, uri: string = ""): Promise<TwoStepEthTransaction> {
    const civil = this.civil;
    const tcr = await civil.tcrSingletonTrusted();
    return tcr.challengeGrantedAppealWithURI(address, uri);
  }

  public async challengeListing(address: EthAddress, data: string = ""): Promise<TwoStepEthTransaction> {
    const civil = this.civil;
    const tcr = await civil.tcrSingletonTrusted();
    return tcr.challenge(address, data);
  }

  public async challengeListingWithUri(address: EthAddress, uri: string = ""): Promise<TwoStepEthTransaction> {
    const civil = this.civil;
    const tcr = await civil.tcrSingletonTrusted();
    return tcr.challengeWithURI(address, uri);
  }

  public async commitVote(
    pollID: BigNumber,
    voteOption: BigNumber,
    salt: BigNumber,
    numTokens: BigNumber,
  ): Promise<TwoStepEthTransaction> {
    const civil = this.civil;
    const tcr = await civil.tcrSingletonTrusted();
    const secretHash = getVoteSaltHash(voteOption.toString(), salt.toString());
    const voting = tcr.getVoting();
    const prevPollID = await voting.getPrevPollID(numTokens, pollID);

    return voting.commitVote(pollID, secretHash, numTokens, prevPollID);
  }

  public async depositTokens(
    address: EthAddress,
    numTokens: BigNumber,
    multisigAddress?: EthAddress,
  ): Promise<TwoStepEthTransaction> {
    const civil = this.civil;
    const tcr = await civil.tcrSingletonTrustedMultisigSupport(multisigAddress);
    return tcr.deposit(address, numTokens);
  }

  public async exitListing(address: EthAddress, multisigAddress?: EthAddress): Promise<TwoStepEthTransaction> {
    const civil = this.civil;
    const tcr = await civil.tcrSingletonTrustedMultisigSupport(multisigAddress);
    return tcr.exitListing(address);
  }

  public async withdrawTokensFromMultisig(multisigAddress?: EthAddress): Promise<TwoStepEthTransaction> {
    const civil = this.civil;
    const token = await civil.cvlTokenSingletonTrusted(multisigAddress);
    return token.transferToSelf(await token.getBalance(multisigAddress));
  }

  public async updateStatus(address: EthAddress): Promise<TwoStepEthTransaction> {
    const civil = this.civil;
    const tcr = await civil.tcrSingletonTrusted();
    return tcr.updateStatus(address);
  }

  public async getNewsroom(address: EthAddress): Promise<any> {
    const civil = this.civil;
    let newsroom;
    newsroom = await civil.newsroomAtUntrusted(address);
    return newsroom;
  }

  public async getParameterValues(params: string[]): Promise<BigNumber[]> {
    const civil = this.civil;
    const tcr = await civil.tcrSingletonTrusted();
    const parameterizer = await tcr.getParameterizer();
    return Promise.all(params.map(async item => parameterizer.getParameterValue(item)));
  }

  public async getGovernmentParameters(params: string[]): Promise<BigNumber[]> {
    const tcr = await this.civil.tcrSingletonTrusted();
    const government = await tcr.getGovernment();
    return Promise.all(params.map(async item => government.getParameterValue(item)));
  }

  public async getApplicationMaximumLengthInBlocks(): Promise<BigNumber> {
    const params = await this.getParameterValues([
      "applyStageLen",
      "commitStageLen",
      "revealStageLen",
      "challengeAppealLen",
      "challengeAppealCommitLen",
      "challengeAppealRevealLen",
    ]);
    const gov = await this.getGovernmentParameters(["judgeAppealPhaseLength", "requestAppealPhaseLength"]);
    // TODO: don't rely on constants
    // TOOD(dankins): make sure this division works with int bn.js
    return params
      .concat(gov)
      .reduce((acc, item) => {
        return acc.add(item);
      }, this.civil.toBigNumber(0))
      .div(this.civil.toBigNumber(25)); // divided by a pessimistic guess about blocktime
  }

  public async setAppellate(address: EthAddress): Promise<TwoStepEthTransaction> {
    const civil = this.civil;
    const council = await civil.councilSingletonTrusted();
    return council.transferAppellate(address);
  }

  public async getRawGrantAppeal(address: EthAddress): Promise<string> {
    const civil = this.civil;
    const tcr = await civil.tcrSingletonTrusted();
    const council = await tcr.getCouncil();
    const tx = await council.getRawGrantAppeal(address);
    return tx.data!;
  }

  public async grantAppeal(address: EthAddress, uri: string): Promise<TwoStepEthTransaction> {
    const civil = this.civil;
    const tcr = await civil.tcrSingletonTrusted();
    const council = await tcr.getCouncil();
    return council.grantAppeal(address, uri);
  }

  public async confirmAppeal(id: number): Promise<TwoStepEthTransaction> {
    const civil = this.civil;
    const tcr = await civil.tcrSingletonTrusted();
    const council = await tcr.getCouncil();
    return council.confirmAppeal(id);
  }

  public async approveVotingRightsForCommit(numTokens: BigNumber): Promise<TwoStepEthTransaction | void> {
    const civil = this.civil;
    const tcr = await civil.tcrSingletonTrusted();

    const voting = tcr.getVoting();
    const eip = await tcr.getToken();

    const currentApprovedTokens = await voting.getNumVotingRights();
    const difference = numTokens.sub(currentApprovedTokens);
    if (difference.gt(0)) {
      const approvedTokensForSpender = await eip.getApprovedTokensForSpender(voting.address);
      if (approvedTokensForSpender.lt(difference)) {
        const approveSpenderReceipt = await eip.approveSpender(voting.address, difference);
        await approveSpenderReceipt.awaitReceipt();
      }
    }
  }

  public async approveVotingRightsForTransfer(tokensWei: BigNumber): Promise<TwoStepEthTransaction | void> {
    const civil = this.civil;
    const tcr = await civil.tcrSingletonTrusted();

    const voting = tcr.getVoting();
    const eip = await tcr.getToken();

    const approvedTokensForSpender = await eip.getApprovedTokensForSpender(voting.address);

    try {
      if (approvedTokensForSpender.lt(tokensWei)) {
        const approveSpenderReceipt = await eip.approveSpender(voting.address, tokensWei);
        await approveSpenderReceipt.awaitReceipt();
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async revealVote(pollID: BigNumber, voteOption: BigNumber, salt: BigNumber): Promise<TwoStepEthTransaction> {
    const civil = this.civil;
    const tcr = await civil.tcrSingletonTrusted();
    const voting = tcr.getVoting();

    return voting.revealVote(pollID, voteOption, salt);
  }

  public async withdrawTokens(
    address: EthAddress,
    tokensWei: BigNumber,
    multisigAddress?: EthAddress,
  ): Promise<TwoStepEthTransaction> {
    const civil = this.civil;
    const tcr = await civil.tcrSingletonTrustedMultisigSupport(multisigAddress);
    return tcr.withdraw(address, tokensWei);
  }

  public async proposeReparameterization(
    paramName: string,
    newValue: BigNumber,
  ): Promise<TwoStepEthTransaction | void> {
    const civil = this.civil;
    const tcr = await civil.tcrSingletonTrusted();
    const parameterizer = await tcr.getParameterizer();
    return parameterizer.proposeReparameterization(paramName, newValue);
  }

  public async challengeReparameterization(propID: string): Promise<TwoStepEthTransaction | void> {
    const tcr = await this.civil.tcrSingletonTrusted();
    const parameterizer = await tcr.getParameterizer();
    return parameterizer.challengeReparameterization(propID);
  }

  public async updateReparameterizationProp(propID: string): Promise<TwoStepEthTransaction | void> {
    const tcr = await this.civil.tcrSingletonTrusted();
    const parameterizer = await tcr.getParameterizer();
    return parameterizer.processProposal(propID);
  }

  public async updateGovernmentParameter(
    paramName: string,
    newValue: BigNumber,
  ): Promise<TwoStepEthTransaction | void> {
    const civil = this.civil;
    const tcr = await civil.tcrSingletonTrusted();
    const govt = await tcr.getGovernment();
    return govt.set(paramName, newValue);
  }

  public async updateGovernmentProposal(propID: string): Promise<TwoStepEthTransaction | void> {
    const civil = this.civil;
    const tcr = await civil.tcrSingletonTrusted();
    const govt = await tcr.getGovernment();
    return govt.processProposal(propID);
  }

  public async multiClaimRewards(challengeIDs: BigNumber[], salts: BigNumber[]): Promise<TwoStepEthTransaction | void> {
    const tcr = await this.civil.tcrSingletonTrusted();
    return tcr.multiClaimReward(challengeIDs, salts);
  }

  public async claimRewards(challengeID: BigNumber, salt: BigNumber): Promise<TwoStepEthTransaction | void> {
    const tcr = await this.civil.tcrSingletonTrusted();
    return tcr.claimReward(challengeID, salt);
  }

  public async rescueTokens(challengeID: BigNumber): Promise<TwoStepEthTransaction | void> {
    const tcr = await this.civil.tcrSingletonTrusted();
    const civil = this.civil;
    const voting = tcr.getVoting();
    return voting.rescueTokens(civil.toBigNumber(challengeID.toString()));
  }

  public async rescueTokensInMultiplePolls(pollIDs: BigNumber[]): Promise<TwoStepEthTransaction | void> {
    const tcr = await this.civil.tcrSingletonTrusted();
    const voting = tcr.getVoting();
    return voting.rescueTokensInMultiplePolls(pollIDs);
  }

  public async withdrawVotingRights(numTokens: BigNumber): Promise<TwoStepEthTransaction | void> {
    const tcr = await this.civil.tcrSingletonTrusted();
    const voting = tcr.getVoting();
    return voting.withdrawVotingRights(numTokens);
  }

  public async requestVotingRights(tokensWei: BigNumber): Promise<TwoStepEthTransaction | void> {
    const tcr = await this.civil.tcrSingletonTrusted();
    const voting = tcr.getVoting();
    return voting.requestVotingRights(tokensWei);
  }

  public async signMessage(message: string): Promise<EthSignedMessage> {
    const civil = this.civil;
    return civil.signMessage(message);
  }

  public async getConstitutionUri(): Promise<string> {
    const tcr = await this.civil.tcrSingletonTrusted();
    const government = await tcr.getGovernment();
    return government.getConstitutionURI();
  }

  public async getConstitutionHash(): Promise<string> {
    const tcr = await this.civil.tcrSingletonTrusted();
    const government = await tcr.getGovernment();
    return government.getConstitutionHash();
  }
}
