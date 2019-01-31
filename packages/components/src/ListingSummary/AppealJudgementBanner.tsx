import * as React from "react";
import { HollowGreenCheck, HollowRedNoGood } from "../icons";
import { ListingSummaryComponentProps } from "./types";
import { StyledBaseResultsBanner, StyledRejectedResultsBanner } from "./styledComponents";

const AppealDecisionBanner: React.SFC<ListingSummaryComponentProps> = props => {
  const { appeal, didListingChallengeSucceed } = props;
  if (!appeal || !appeal.appealGranted) {
    return <></>;
  }

  let decisionText;

  // Challenge succeeded (newsroom rejected) and appeal was granted, so newsroom is accepted
  if (didListingChallengeSucceed) {
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
