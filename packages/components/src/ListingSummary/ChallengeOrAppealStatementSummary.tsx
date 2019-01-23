import * as React from "react";
import { ChallengeOrAppealStatementSummaryProps } from "./types";
import { StyledListingChallengeOrAppealStatement } from "./styledComponents";

const ChallengeOrAppealStatementSummary: React.SFC<ChallengeOrAppealStatementSummaryProps> = props => {
  const { challengeID, challengeStatementSummary, appealStatementSummary } = props;
  if (challengeStatementSummary) {
    const challengeIDDisplay = challengeID ? `#${challengeID}` : "";
    return (
      <StyledListingChallengeOrAppealStatement>
        <b>Challenge {challengeIDDisplay} Summary</b>
        <br />
        {challengeStatementSummary}
      </StyledListingChallengeOrAppealStatement>
    );
  } else if (appealStatementSummary) {
    return (
      <StyledListingChallengeOrAppealStatement>
        <b>Appeal Summary</b>
        <br />
        {appealStatementSummary}
      </StyledListingChallengeOrAppealStatement>
    );
  }
  return null;
};

export default ChallengeOrAppealStatementSummary;
