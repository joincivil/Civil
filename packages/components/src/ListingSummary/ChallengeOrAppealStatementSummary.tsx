import * as React from "react";
import { ChallengeOrAppealStatementSummaryProps } from "./types";
import { StyledListingChallengeOrAppealStatement } from "./styledComponents";

const ChallengeOrAppealStatementSummary: React.SFC<ChallengeOrAppealStatementSummaryProps> = props => {
  const { challengeID, challengeStatementSummary } = props;
  if (!challengeID || !challengeStatementSummary) {
    return null;
  }

  return (
    <StyledListingChallengeOrAppealStatement>
      <b>Challenge #{challengeID} Summary</b>
      <br />
      {challengeStatementSummary}
    </StyledListingChallengeOrAppealStatement>
  );
};

export default ChallengeOrAppealStatementSummary;
