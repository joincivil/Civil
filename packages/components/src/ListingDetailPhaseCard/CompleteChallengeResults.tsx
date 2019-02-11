import * as React from "react";
import {
  ListingDetailPhaseCardComponentProps,
  ChallengePhaseProps,
  AppealDecisionProps,
  AppealChallengePhaseProps,
  AppealChallengeResultsProps,
} from "./types";
import {
  StyledListingDetailPhaseCardContainer,
  StyledListingDetailPhaseCardSection,
} from "./styledComponents";
import { ChallengeResults, ChallengeResultsProps } from "../ChallengeResultsChart";
import { AppealDecisionDetail } from "./AppealDecisionDetail";

export interface CompleteChallengeResultsProps {
  listingRemovedTimestamp?: number;
}

export type CompleteChallengeResultsAllProps = ListingDetailPhaseCardComponentProps &
  ChallengePhaseProps &
  ChallengeResultsProps &
  AppealDecisionProps &
  AppealChallengePhaseProps &
  AppealChallengeResultsProps &
  CompleteChallengeResultsProps;

export const CompleteChallengeResults: React.StatelessComponent<CompleteChallengeResultsAllProps> = props => {
  const showAppealChallenge =
    props.appealChallengeTotalVotes &&
    props.appealChallengeVotesFor &&
    props.appealChallengeVotesAgainst &&
    props.appealChallengePercentFor &&
    props.appealChallengePercentAgainst;

  return (
    <StyledListingDetailPhaseCardContainer>
      <StyledListingDetailPhaseCardSection>
        <ChallengeResults
          headerText={`Challenge #${props.challengeID} Results`}
          totalVotes={props.totalVotes}
          votesFor={props.votesFor}
          votesAgainst={props.votesAgainst}
          percentFor={props.percentFor}
          percentAgainst={props.percentAgainst}
          didChallengeSucceed={props.didChallengeSucceed}
        />
      </StyledListingDetailPhaseCardSection>

      {props.appealRequested && <AppealDecisionDetail appealGranted={props.appealGranted} />}

      {showAppealChallenge && (
        <StyledListingDetailPhaseCardSection>
          <ChallengeResults
            headerText={`Appeal Challenge #${props.appealChallengeID} Results`}
            totalVotes={props.appealChallengeTotalVotes!}
            votesFor={props.appealChallengeVotesFor!}
            votesAgainst={props.appealChallengeVotesAgainst!}
            percentFor={props.appealChallengePercentFor!}
            percentAgainst={props.appealChallengePercentAgainst!}
            didChallengeSucceed={props.didAppealChallengeSucceed!}
            isAppealChallenge={true}
          />
        </StyledListingDetailPhaseCardSection>
      )}
    </StyledListingDetailPhaseCardContainer>
  );
};
