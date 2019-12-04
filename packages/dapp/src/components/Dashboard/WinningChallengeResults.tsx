import * as React from "react";
import { AppealChallengeData } from "@joincivil/typescript-types";
import { VoteTypeSummaryRow as PartialChallengeResultsComponent } from "@joincivil/components";
import { getChallengeViewProps, getAppealChallengeViewProps } from "../utility/WinningChallengeResultsHOC";

export interface WinningChallengeWrapperResultsProps {
  challengeID?: string;
  challenge?: any;
  appealChallengeID?: string;
  appealChallenge?: AppealChallengeData;
  isProposalChallenge?: boolean;
}

const WinningChallengeResults: React.FunctionComponent<WinningChallengeWrapperResultsProps> = props => {
  const { challengeID, challenge, appealChallenge, isProposalChallenge } = props;
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
  } else {
    console.error("no winning challenge results found. challengeID: ", challengeID);
  }

  return <></>;
};

export default WinningChallengeResults;
