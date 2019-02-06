import * as React from "react";
import { HollowGreenCheck, HollowRedNoGood, HollowGrayNotGranted } from "../icons";
import { ListingSummaryComponentProps } from "./types";
import {
  StyledBaseResultsBanner,
  StyledRejectedResultsBanner,
  StyledNotGrantedResultsBanner,
} from "./styledComponents";

const AppealDecisionBanner: React.SFC<ListingSummaryComponentProps> = props => {
  const { appeal, didChallengeOriginallySucceed } = props;
  if (!appeal) {
    return <></>;
  }

  let decisionText;
  if (!appeal.appealGranted) {
    decisionText = (
      <StyledNotGrantedResultsBanner>
        <HollowGrayNotGranted /> Appeal requested but not granted
      </StyledNotGrantedResultsBanner>
    );
  } else if (didChallengeOriginallySucceed) {
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

  return decisionText;
};

export default AppealDecisionBanner;
