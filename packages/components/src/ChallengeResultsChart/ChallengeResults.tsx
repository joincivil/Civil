import * as React from "react";
import { FormHeader } from "../ListingDetailPhaseCard/styledComponents";
import { ChallengeResultsProps } from "./types";
import {
  VoteTypeSummary,
  VoteTypeSummaryContainer,
  VotesPerTokenContainer,
  VotesPerTokenCount,
  BreakdownBarContainer,
  VotesPerTokenTotal,
} from "./styledComponents";
import { CHALLENGE_RESULTS_VOTE_TYPES } from "./constants";
import { VoteTypeSummaryRow } from "./VoteTypeSummaryRow";
import { Collapsable } from "../Collapsable";

const ChallengeResultsInner: React.StatelessComponent<ChallengeResultsProps> = props => {
  const Header = props.styledHeaderComponent || FormHeader;
  return (
    <>
      {!props.noHeader && <Header>{props.headerText || "Challenge Results"}</Header>}

      <VoteTypeSummaryContainer>
        <VoteTypeSummaryRow
          voteType={CHALLENGE_RESULTS_VOTE_TYPES.REMAIN}
          votesCount={props.votesAgainst}
          votesPercent={props.percentAgainst}
        />
      </VoteTypeSummaryContainer>

      <VoteTypeSummaryContainer>
        <VoteTypeSummaryRow
          voteType={CHALLENGE_RESULTS_VOTE_TYPES.REMOVE}
          votesCount={props.votesFor}
          votesPercent={props.percentFor}
        />
      </VoteTypeSummaryContainer>

      <VoteTypeSummaryContainer>
        <VoteTypeSummary>
          <VotesPerTokenContainer>
            <VotesPerTokenTotal>Total Votes</VotesPerTokenTotal>
            <VotesPerTokenCount>{props.totalVotes}</VotesPerTokenCount>
          </VotesPerTokenContainer>

          <BreakdownBarContainer>
            <a href="#">Read more details</a>
          </BreakdownBarContainer>
        </VoteTypeSummary>
      </VoteTypeSummaryContainer>
    </>
  );
};

export const ChallengeResults: React.StatelessComponent<ChallengeResultsProps> = props => {
  if (props.collapsable) {
    const Header = props.styledHeaderComponent || FormHeader;
    const headerElement = <Header>{props.headerText || "Challenge Results"}</Header>;

    return (
      <Collapsable header={headerElement} open={true}>
        <ChallengeResultsInner noHeader={true} headerText="" {...props} />
      </Collapsable>
    );
  }

  return <ChallengeResultsInner {...props} />;
};
