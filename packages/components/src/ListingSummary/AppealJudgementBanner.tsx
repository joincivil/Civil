import * as React from "react";
import { HollowGreenCheck, HollowRedNoGood, HollowGrayNotGranted } from "../icons";
import { ListingSummaryComponentProps } from "./types";
import {
  StyledBaseResultsBanner,
  StyledRejectedResultsBanner,
  StyledNotGrantedResultsBanner,
} from "./styledComponents";

const AppealDecisionBanner: React.FunctionComponent<ListingSummaryComponentProps> = props => {
  const {
    appeal,
    appealGranted,
    doesChallengeHaveAppeal,
    isAwaitingAppealJudgement,
    didChallengeOriginallySucceed,
  } = props;
  if (!doesChallengeHaveAppeal && !isAwaitingAppealJudgement) {
    return <></>;
  }

  let decisionText = <></>;
  if (isAwaitingAppealJudgement) {
    decisionText = (
      <StyledNotGrantedResultsBanner>
        <HollowGrayNotGranted /> Appeal requested
      </StyledNotGrantedResultsBanner>
    );
  } else if (appeal) {
    if (appeal.appealGranted || appealGranted) {
      if (didChallengeOriginallySucceed) {
        // Challenge succeeded (newsroom rejected) and appeal was granted, so newsroom is accepted
        decisionText = (
          <StyledBaseResultsBanner>
            <HollowGreenCheck /> Appeal granted to accept Newsroom
          </StyledBaseResultsBanner>
        );
        // Challenge failed (newsroom accepted) and appeal was granted, so newsroom is rejected
        //
      } else {
        decisionText = (
          <StyledRejectedResultsBanner>
            <HollowRedNoGood /> Appeal granted to reject Newsroom
          </StyledRejectedResultsBanner>
        );
      }
    } else {
      decisionText = (
        <StyledNotGrantedResultsBanner>
          <HollowGrayNotGranted /> Appeal requested but not granted
        </StyledNotGrantedResultsBanner>
      );
    }
  }

  return decisionText;
};

export default AppealDecisionBanner;
