import * as React from "react";
import { HollowGreenCheck, HollowRedNoGood } from "../icons";
import { ListingSummaryComponentProps } from "./types";
import { StyledBaseResultsBanner, StyledRejectedResultsBanner } from "./styledComponents";

const ChallengeResultsBanner: React.SFC<ListingSummaryComponentProps> = props => {
  const { appeal, didListingChallengeSucceed, canBeWhitelisted } = props;
  let decisionText = null;

  if (appeal && appeal.appealGranted) {
    if (didListingChallengeSucceed) {
      // Challenge succeeded (newsroom rejected) and appeal was granted, so newsroom is accepted
      decisionText = (
        <StyledBaseResultsBanner>
          <HollowGreenCheck /> Appeal granted to accept Newsroom
        </StyledBaseResultsBanner>
      );
    } else {
      // Challenge failed (newsroom accepted) and appeal was granted, so newsroom is rejected
      decisionText = (
        <StyledRejectedResultsBanner>
          <HollowRedNoGood /> Appeal granted to reject Newsroom
        </StyledRejectedResultsBanner>
      );
    }
  } else if (didListingChallengeSucceed) {
    // Challenge succeeded (newsroom rejected)
    decisionText = (
      <StyledRejectedResultsBanner>
        <HollowRedNoGood /> Community voted to reject Newsroom
      </StyledRejectedResultsBanner>
    );
  } else if (canBeWhitelisted) {
    // Challenge failed (newsroom accepted)
    decisionText = (
      <StyledBaseResultsBanner>
        <HollowGreenCheck /> Newsroom application passed without challenge
      </StyledBaseResultsBanner>
    );
  } else if (!didListingChallengeSucceed) {
    // Challenge failed (newsroom accepted)
    decisionText = (
      <StyledBaseResultsBanner>
        <HollowGreenCheck /> Community voted to accept Newsroom
      </StyledBaseResultsBanner>
    );
  }

  return decisionText;
};

export default ChallengeResultsBanner;
