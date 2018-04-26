import * as React from "react";
import styled from "styled-components";
import { isAppealChallengeInCommitStage, isAppealChallengeInRevealStage, AppealChallengeData } from "@joincivil/core";

const StyledDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%
  color: black;
`;

export interface AppealChallengeDetailProps {
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
        Challenger: {challenge.challenger}
        <br />
        Reward Pool: {challenge.rewardPool}
        <br />
        Reward Pool: {challenge.rewardPool}
        <br />
        {isAppealChallengeInCommitStage(challenge) && this.renderCommitStage()}
        {isAppealChallengeInRevealStage(challenge) && this.renderRevealStage()}
        {canResolveChallenge && this.renderResolveAppealChallenge()}
      </StyledDiv>
    );
  }

  private renderCommitStage(): JSX.Element {
    return <>COMMIT THINGS</>;
  }
  private renderRevealStage(): JSX.Element {
    return <>REVEAL THINGS</>;
  }
  private renderResolveAppealChallenge(): JSX.Element {
    return <>RESOLVE APPEAL CHALLENGE</>;
  }
}

export default AppealChallengeDetail;
