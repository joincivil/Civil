import * as React from "react";
import {
  isAppealChallengeInCommitStage,
  isAppealChallengeInRevealStage,
  AppealData,
  AppealChallengeData,
  ChallengeData,
  EthAddress,
  UserChallengeData,
} from "@joincivil/core";
import BigNumber from "bignumber.js";
import AppealChallengeCommitVote from "./AppealChallengeCommitVote";
import AppealChallengeRevealVote from "./AppealChallengeRevealVote";
import AppealChallengeResolve from "./AppealChallengeResolve";

export interface AppealChallengeDetailProps {
  listingAddress: EthAddress;
  challengeID: BigNumber;
  challenge: ChallengeData;
  appealChallengeID: BigNumber;
  appealChallenge: AppealChallengeData;
  userAppealChallengeData?: UserChallengeData;
  appeal: AppealData;
  parameters: any;
  govtParameters: any;
  user: any;
  balance: BigNumber;
  votingBalance: BigNumber;
}

export interface ChallengeVoteState {
  voteOption?: string;
  salt?: string;
  numTokens?: string;
  isReviewVoteModalOpen: boolean;
}

class AppealChallengeDetail extends React.Component<AppealChallengeDetailProps> {
  public render(): JSX.Element {
    const challenge = this.props.appealChallenge;
    const canResolveChallenge =
      !isAppealChallengeInCommitStage(challenge) && !isAppealChallengeInRevealStage(challenge) && !challenge.resolved;
    return (
      <>
        {isAppealChallengeInCommitStage(challenge) && this.renderCommitStage()}
        {isAppealChallengeInRevealStage(challenge) && this.renderRevealStage()}
        {canResolveChallenge && this.renderResolveAppealChallenge()}
      </>
    );
  }

  private renderCommitStage(): JSX.Element {
    return <AppealChallengeCommitVote {...this.props} />;
  }

  private renderRevealStage(): JSX.Element {
    return <AppealChallengeRevealVote {...this.props} />;
  }

  private renderResolveAppealChallenge(): JSX.Element {
    return <AppealChallengeResolve {...this.props} />;
  }
}

export default AppealChallengeDetail;
