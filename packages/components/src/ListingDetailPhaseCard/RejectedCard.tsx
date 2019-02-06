import * as React from "react";
import { getLocalDateTimeStrings } from "@joincivil/utils";
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
  StyledPhaseDisplayName,
  MetaItemValue,
  MetaItemLabel,
} from "./styledComponents";
import { RejectedNewroomDisplayNameText, RejectedNewsroomsToolTipText } from "./textComponents";
import { ChallengeResults, ChallengeResultsProps } from "../ChallengeResultsChart";
import { QuestionToolTip } from "../QuestionToolTip";
import { AppealDecisionDetail } from "./AppealDecisionDetail";

export interface RejectedCardProps {
  listingRemovedTimestamp?: number;
}

export type RejectedCardAllProps = ListingDetailPhaseCardComponentProps &
  ChallengePhaseProps &
  ChallengeResultsProps &
  AppealDecisionProps &
  AppealChallengePhaseProps &
  AppealChallengeResultsProps &
  RejectedCardProps;

export const RejectedCard: React.StatelessComponent<RejectedCardAllProps> = props => {
  let displayDateTime;
  const showAppealChallenge =
    props.appealChallengeTotalVotes &&
    props.appealChallengeVotesFor &&
    props.appealChallengeVotesAgainst &&
    props.appealChallengePercentFor &&
    props.appealChallengePercentAgainst;
  if (props.listingRemovedTimestamp) {
    const listingRemovedDateTime = getLocalDateTimeStrings(props.listingRemovedTimestamp);
    displayDateTime = `${listingRemovedDateTime[0]} ${listingRemovedDateTime[1]}`;
  }

  return (
    <StyledListingDetailPhaseCardContainer>
      <StyledListingDetailPhaseCardSection>
        <StyledPhaseDisplayName>
          <RejectedNewroomDisplayNameText />
          <QuestionToolTip explainerText={<RejectedNewsroomsToolTipText />} positionBottom={true} />
        </StyledPhaseDisplayName>
        <MetaItemLabel>Rejected date</MetaItemLabel>
        <MetaItemValue>{displayDateTime}</MetaItemValue>
      </StyledListingDetailPhaseCardSection>
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
