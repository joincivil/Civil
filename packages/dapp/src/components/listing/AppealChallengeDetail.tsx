import * as React from "react";
import {
  AppealData,
  AppealChallengeData,
  ChallengeData,
  EthAddress,
  UserChallengeData,
  BigNumber,
} from "@joincivil/typescript-types";
import { appealChallengeHelpers } from "@joincivil/utils";
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
  onMobileTransactionClick?(): any;
}

export interface ChallengeVoteState {
  voteOption?: string;
  numTokens?: string;
  salt?: string;
  isReviewVoteModalOpen: boolean;
}

class AppealChallengeDetail extends React.Component<AppealChallengeDetailProps> {
  public render(): JSX.Element {
    const challenge = this.props.appealChallenge;
    const canResolveChallenge =
      !appealChallengeHelpers.isAppealChallengeInCommitStage(challenge) &&
      !appealChallengeHelpers.isAppealChallengeInRevealStage(challenge) &&
      !challenge.resolved;
    return (
      <>
        {appealChallengeHelpers.isAppealChallengeInCommitStage(challenge) && this.renderCommitStage()}
        {appealChallengeHelpers.isAppealChallengeInRevealStage(challenge) && this.renderRevealStage()}
        {canResolveChallenge && this.renderResolveAppealChallenge()}
      </>
    );
  }

  private renderCommitStage(): JSX.Element {
    return <AppealChallengeCommitVote {...this.props} />;
  }

  private renderRevealStage(): JSX.Element {
    return <AppealChallengeRevealVote {...this.props} key={this.props.user} />;
  }

  private renderResolveAppealChallenge(): JSX.Element {
    return <AppealChallengeResolve {...this.props} />;
  }
}

export default AppealChallengeDetail;
