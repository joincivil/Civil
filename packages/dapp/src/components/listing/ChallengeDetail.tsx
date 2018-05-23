import * as React from "react";
import {
  isChallengeInCommitStage,
  isChallengeInRevealStage,
  canRequestAppeal,
  didChallengeSucceed,
  doesChallengeHaveAppeal,
  ChallengeData,
  EthAddress,
  TwoStepEthTransaction,
} from "@joincivil/core";
import AppealDetail from "./AppealDetail";
import CommitVoteDetail from "./CommitVoteDetail";
import CountdownTimer from "../utility/CountdownTimer";
import RevealVoteDetail from "./RevealVoteDetail";
import TransactionButton from "../utility/TransactionButton";
import { ViewModule, ViewModuleHeader } from "../utility/ViewModules";
import { appealChallenge, approveForAppeal } from "../../apis/civilTCR";
import BigNumber from "bignumber.js";

export interface ChallengeDetailProps {
  listingAddress: EthAddress;
  challengeID: BigNumber;
  challenge: ChallengeData;
}

class ChallengeDetail extends React.Component<ChallengeDetailProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    const challenge = this.props.challenge;
    const appealExists = doesChallengeHaveAppeal(challenge);
    return (
      <ViewModule>
        <ViewModuleHeader>Challenge Details</ViewModuleHeader>

        <dl>
          <dt>Challenger</dt>
          <dd>{challenge.challenger.toString()}</dd>

          <dt>Reward Pool</dt>
          <dd>{challenge.rewardPool.toString()}</dd>

          <dt>Stake</dt>
          <dd>{challenge.stake.toString()}</dd>

          <dt>Challenge Succeeded</dt>
          <dd>{didChallengeSucceed(challenge).toString()}</dd>
        </dl>

        {isChallengeInCommitStage(challenge) && this.renderCommitStage()}
        {isChallengeInRevealStage(challenge) && this.renderRevealStage()}
        {canRequestAppeal(challenge) && this.renderRequestAppealStage()}
        {appealExists && <AppealDetail listingAddress={this.props.listingAddress} appeal={challenge.appeal!} />}
      </ViewModule>
    );
  }

  private renderCommitStage(): JSX.Element {
    return (
      <>
        Commit Vote Phase ends in <CountdownTimer endTime={this.props.challenge.poll.commitEndDate.toNumber()} />
        <br />
        <CommitVoteDetail challengeID={this.props.challengeID} />
      </>
    );
  }
  private renderRevealStage(): JSX.Element {
    return (
      <>
        Reveal Vote Phase ends in <CountdownTimer endTime={this.props.challenge.poll.revealEndDate.toNumber()} />
        <br />
        <RevealVoteDetail challengeID={this.props.challengeID} />
      </>
    );
  }
  private renderRequestAppealStage(): JSX.Element {
    return (
      <>
        Request Appeal Phase Ends in <CountdownTimer endTime={this.props.challenge.requestAppealExpiry.toNumber()} />
        <br />
        <TransactionButton transactions={[{ transaction: approveForAppeal }, { transaction: this.appeal }]}>
          Request Appeal
        </TransactionButton>
      </>
    );
  }

  private appeal = async (): Promise<TwoStepEthTransaction<any>> => {
    return appealChallenge(this.props.listingAddress);
  };
}

export default ChallengeDetail;
