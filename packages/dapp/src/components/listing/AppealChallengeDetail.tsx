import * as React from "react";
import styled from "styled-components";
import { isAppealChallengeInCommitStage, isAppealChallengeInRevealStage, AppealChallengeData } from "@joincivil/core";
import CommitVoteDetail from "./CommitVoteDetail";
import RevealVoteDetail from "./RevealVoteDetail";
import BigNumber from "bignumber.js";
import { getFormattedTokenBalance } from "@joincivil/utils";
import CountdownTimer from "../utility/CountdownTimer";

const StyledDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%
  color: black;
`;

export interface AppealChallengeDetailProps {
  appealChallengeID: BigNumber;
  appealChallenge: AppealChallengeData;
}

class AppealChallengeDetail extends React.Component<AppealChallengeDetailProps> {
  constructor(props: AppealChallengeDetailProps) {
    super(props);
  }

  public render(): JSX.Element {
    const challenge = this.props.appealChallenge;
    const canResolveChallenge =
      !isAppealChallengeInCommitStage(challenge) && !isAppealChallengeInRevealStage(challenge) && !challenge.resolved;
    const canShowResult = this.props.appealChallenge.resolved;
    return (
      <StyledDiv>
        <dl>
          <dt>Appeal Challenger</dt>
          <dd>{challenge.challenger.toString()}</dd>

          <dt>Appeal Reward Pool</dt>
          <dd>{getFormattedTokenBalance(challenge.rewardPool)}</dd>

          <dt>Appeal Stake</dt>
          <dd>{getFormattedTokenBalance(challenge.stake)}</dd>
        </dl>
        {isAppealChallengeInCommitStage(challenge) && this.renderCommitStage()}
        {isAppealChallengeInRevealStage(challenge) && this.renderRevealStage()}
        {canResolveChallenge && this.renderResolveAppealChallenge()}
        {canShowResult && this.renderVoteResult()}
      </StyledDiv>
    );
  }

  private renderVoteResult(): JSX.Element {
    const totalVotes = this.props.appealChallenge.poll.votesAgainst.add(this.props.appealChallenge.poll.votesFor);
    const percentFor = this.props.appealChallenge.poll.votesFor.div(totalVotes).mul(100);
    const percentAgainst = this.props.appealChallenge.poll.votesAgainst.div(totalVotes).mul(100);
    return (
      <>
        Appeal Challenge Result:
        <br />
        Reject: {this.props.appealChallenge.poll.votesFor.toString() + " CVL"} - {percentFor.toString() + "%"}
        <br />
        Allow: {this.props.appealChallenge.poll.votesAgainst.toString() + " CVL"} - {percentAgainst.toString() + "%"}
      </>
    );
  }

  private renderCommitStage(): JSX.Element {
    return (
      <>
        Commit Vote Phase ends in <CountdownTimer endTime={this.props.appealChallenge.poll.commitEndDate.toNumber()} />
        <br />
        <CommitVoteDetail challengeID={this.props.appealChallengeID} />
      </>
    );
  }
  private renderRevealStage(): JSX.Element {
    return (
      <>
        Reveal Vote Phase ends in <CountdownTimer endTime={this.props.appealChallenge.poll.revealEndDate.toNumber()} />
        <br />
        <RevealVoteDetail challengeID={this.props.appealChallengeID} />
      </>
    );
  }
  private renderResolveAppealChallenge(): JSX.Element {
    return <>RESOLVE APPEAL CHALLENGE</>;
  }
}

export default AppealChallengeDetail;
