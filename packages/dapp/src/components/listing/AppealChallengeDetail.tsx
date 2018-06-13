import * as React from "react";
import styled from "styled-components";
import { isAppealChallengeInCommitStage, isAppealChallengeInRevealStage, AppealChallengeData } from "@joincivil/core";
import CommitVoteDetail from "./CommitVoteDetail";
import RevealVoteDetail from "./RevealVoteDetail";
import BigNumber from "bignumber.js";
import { getFormattedTokenBalance } from "@joincivil/utils";

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
      !isAppealChallengeInCommitStage(challenge) && !isAppealChallengeInRevealStage(challenge);
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
      </StyledDiv>
    );
  }

  private renderCommitStage(): JSX.Element {
    return <CommitVoteDetail challengeID={this.props.appealChallengeID} />;
  }
  private renderRevealStage(): JSX.Element {
    return <RevealVoteDetail challengeID={this.props.appealChallengeID} />;
  }
  private renderResolveAppealChallenge(): JSX.Element {
    return <>RESOLVE APPEAL CHALLENGE</>;
  }
}

export default AppealChallengeDetail;
