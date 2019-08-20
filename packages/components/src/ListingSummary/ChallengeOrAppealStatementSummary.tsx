import * as React from "react";
import { ListingSummaryComponentProps, ChallengeOrAppealStatementSummaryProps } from "./types";
import { StyledListingChallengeOrAppealStatement } from "./styledComponents";

const ChallengeOrAppealStatementSummary: React.FunctionComponent<
  ListingSummaryComponentProps & ChallengeOrAppealStatementSummaryProps
> = props => {
  const {
    challengeID,
    challengeStatementSummary,
    appealStatementSummary,
    appealChallengeID,
    appealChallengeStatementSummary,
    inChallengeCommitVotePhase,
    inChallengeRevealPhase,
    isAwaitingAppealJudgement,
    isInAppealChallengeCommitPhase,
    isInAppealChallengeRevealPhase,
  } = props;
  if (isInAppealChallengeCommitPhase || (isInAppealChallengeRevealPhase && appealChallengeStatementSummary)) {
    const appealChallengeIDDisplay = appealChallengeID ? `#${appealChallengeID}` : "";
    return (
      <StyledListingChallengeOrAppealStatement>
        <b>Challenge {appealChallengeIDDisplay} Summary</b>
        <br />
        {appealChallengeStatementSummary}
      </StyledListingChallengeOrAppealStatement>
    );
  } else if (isAwaitingAppealJudgement && appealStatementSummary) {
    return (
      <StyledListingChallengeOrAppealStatement>
        <b>Appeal Summary</b>
        <br />
        {appealStatementSummary}
      </StyledListingChallengeOrAppealStatement>
    );
  } else if (inChallengeCommitVotePhase || (inChallengeRevealPhase && challengeStatementSummary)) {
    const challengeIDDisplay = challengeID ? `#${challengeID}` : "";
    return (
      <StyledListingChallengeOrAppealStatement>
        <b>Challenge {challengeIDDisplay} Summary</b>
        <br />
        {challengeStatementSummary}
      </StyledListingChallengeOrAppealStatement>
    );
  }
  return null;
};

export default ChallengeOrAppealStatementSummary;
