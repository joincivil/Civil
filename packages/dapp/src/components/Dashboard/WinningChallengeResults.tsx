import * as React from "react";
import { compose } from "redux";
import { AppealChallengeData } from "@joincivil/core";
import { VoteTypeSummaryRow as PartialChallengeResultsComponent } from "@joincivil/components";
import { ChallengeContainerProps, AppealChallengeContainerProps } from "../utility/HigherOrderComponents";
import {
  connectWinningChallengeResults,
  WinningChallengeResultsProps,
  getChallengeViewProps,
  getAppealChallengeViewProps,
} from "../utility/WinningChallengeResultsHOC";

export interface WinningChallengeWrapperResultsProps {
  challengeID?: string;
  challenge?: any;
  appealChallengeID?: string;
  appealChallenge?: AppealChallengeData;
  isProposalChallenge?: boolean;
}

const WinningChallengeResultsRedux = compose(connectWinningChallengeResults)(
  PartialChallengeResultsComponent,
) as React.ComponentClass<ChallengeContainerProps & AppealChallengeContainerProps & WinningChallengeResultsProps>;

const WinningChallengeResults: React.FunctionComponent<WinningChallengeWrapperResultsProps> = props => {
  const { challengeID, appealChallengeID, challenge, appealChallenge, isProposalChallenge } = props;
  let viewProps;
  if (appealChallenge) {
    viewProps = getAppealChallengeViewProps(appealChallenge);
  } else if (challenge && isProposalChallenge) {
    viewProps = getChallengeViewProps(challenge);
  } else if (challenge) {
    viewProps = getChallengeViewProps(challenge.challenge);
  }

  if (viewProps) {
    return <PartialChallengeResultsComponent {...viewProps} />;
  }

  return <WinningChallengeResultsRedux challengeID={challengeID} appealChallengeID={appealChallengeID} />;
};

export default WinningChallengeResults;
