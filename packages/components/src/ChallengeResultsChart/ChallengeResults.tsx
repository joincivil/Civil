import * as React from "react";
import styled from "styled-components";
import { StyledListingDetailPhaseCardSectionHeader } from "../ListingDetailPhaseCard/styledComponents";
import { ChallengeResultsProps } from "./types";
import {
  VoteTypeSummary,
  VoteTypeSummaryContainer,
  VotesPerTokenTotal,
  TotalVotesLabelContainer,
  TotalVotesCount,
  StyledExplainerText,
} from "./styledComponents";
import { CHALLENGE_RESULTS_VOTE_TYPES } from "./constants";
import { VoteTypeSummaryRow } from "./VoteTypeSummaryRow";
import { Collapsable } from "../Collapsable";

const DefaultHeader = styled(StyledListingDetailPhaseCardSectionHeader)`
  & + ${VoteTypeSummaryContainer} {
    margin-top: 14px;
  }
`;

const StyledInner = styled.div`
  padding-top: 14px;
`;

const ExplainerText: React.FunctionComponent<ChallengeResultsProps> = props => {
  let explainerText;

  if (props.didChallengeSucceed) {
    if (props.isAppealChallenge) {
      explainerText = (
        <>
          The Civil Community <b>voted to overturn</b> the Civil Council's decision.
        </>
      );
    } else {
      explainerText = (
        <>
          The Civil Community <b>voted to reject this newsroom</b> on the grounds that it is in violation of the Civil
          Constitution.
        </>
      );
    }
  } else {
    if (props.isAppealChallenge) {
      explainerText = (
        <>
          The Civil Community <b>voted to uphold</b> The Civil Council's decision.
        </>
      );
    } else {
      explainerText = (
        <>
          The Civil Community <b>voted to accept this newsroom</b> on the grounds that it adheres to the Civil
          Constitution.
        </>
      );
    }
  }
  return <StyledExplainerText>{explainerText}</StyledExplainerText>;
};

const ChallengeResultsInner: React.FunctionComponent<ChallengeResultsProps> = props => {
  const Header = props.styledHeaderComponent || DefaultHeader;
  const defaultHeaderText = props.challengeID ? `Challenge ${props.challengeID} Results` : "Challenge Results";
  const explainerText = !props.noExplainerText && <ExplainerText {...props} />;
  return (
    <>
      {!props.noHeader && <Header>{props.headerText || defaultHeaderText}</Header>}
      {props.noHeader && <StyledInner />}

      {explainerText}

      <VoteTypeSummaryContainer>
        <VoteTypeSummaryRow
          voteType={
            props.isAppealChallenge ? CHALLENGE_RESULTS_VOTE_TYPES.OVERTURN : CHALLENGE_RESULTS_VOTE_TYPES.REMAIN
          }
          votesCount={props.votesFor}
          votesPercent={props.percentFor}
        />
      </VoteTypeSummaryContainer>

      <VoteTypeSummaryContainer>
        <VoteTypeSummaryRow
          voteType={props.isAppealChallenge ? CHALLENGE_RESULTS_VOTE_TYPES.UPHOLD : CHALLENGE_RESULTS_VOTE_TYPES.REMOVE}
          votesCount={props.votesAgainst}
          votesPercent={props.percentAgainst}
        />
      </VoteTypeSummaryContainer>

      <VoteTypeSummaryContainer>
        <VoteTypeSummary>
          <TotalVotesLabelContainer>
            <VotesPerTokenTotal>Total Votes</VotesPerTokenTotal>
          </TotalVotesLabelContainer>
          <TotalVotesCount>{props.totalVotes}</TotalVotesCount>
        </VoteTypeSummary>
      </VoteTypeSummaryContainer>
    </>
  );
};

export const ChallengeResults: React.FunctionComponent<ChallengeResultsProps> = props => {
  if (props.collapsable) {
    const Header = props.styledHeaderComponent || DefaultHeader;
    const headerElement = <Header>{props.headerText || "Challenge Results"}</Header>;
    const open = props.open !== undefined ? props.open : true;

    return (
      <Collapsable header={headerElement} open={open}>
        <ChallengeResultsInner noHeader={true} headerText="" {...props} />
      </Collapsable>
    );
  }

  return <ChallengeResultsInner {...props} />;
};
