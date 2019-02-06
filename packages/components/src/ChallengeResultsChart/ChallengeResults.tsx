import * as React from "react";
import styled from "styled-components";
import { StyledListingDetailPhaseCardSectionHeader } from "../ListingDetailPhaseCard/styledComponents";
import { ChallengeResultsProps } from "./types";
import {
  VoteTypeSummary,
  VoteTypeSummaryContainer,
  VotesPerTokenContainer,
  VotesPerTokenCount,
  VotesPerTokenTotal,
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

const ExplainerText: React.SFC<ChallengeResultsProps> = props => {
  let explainerText;

  console.log("isAppealChallenge: ", props.isAppealChallenge);

  if (props.didChallengeSucceed) {
    if (props.isAppealChallenge) {
      explainerText = "This granted appeal has been upheld by the Civil Community.";
    } else {
      explainerText =
        "The Civil Community has voted to reject this newsroom, on the grounds that it is in violation of the Civil Constitution.";
    }
  } else {
    if (props.isAppealChallenge) {
      explainerText = "This granted appeal has been overturned by the Civil Community.";
    } else {
      explainerText =
        "The Civil Community has voted to accept this newsroom, on the grounds that it adheres to the Civil Constitution.";
    }
  }
  return <StyledExplainerText>{explainerText}</StyledExplainerText>;
};

const ChallengeResultsInner: React.StatelessComponent<ChallengeResultsProps> = props => {
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
          <VotesPerTokenContainer>
            <VotesPerTokenTotal>Total Votes</VotesPerTokenTotal>
            <VotesPerTokenCount>{props.totalVotes}</VotesPerTokenCount>
          </VotesPerTokenContainer>
        </VoteTypeSummary>
      </VoteTypeSummaryContainer>
    </>
  );
};

export const ChallengeResults: React.StatelessComponent<ChallengeResultsProps> = props => {
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
