import * as React from "react";
import { ListingDetailPhaseCardComponentProps, ChallengePhaseProps } from "./types";
import {
  CTACopy,
  StyledListingDetailPhaseCardContainer,
  StyledListingDetailPhaseCardSection,
  StyledPhaseKicker,
  StyledPhaseDisplayName,
} from "./styledComponents";
import { TransactionInvertedButton } from "../TransactionButton";
import { ChallengePhaseDetail } from "./ChallengePhaseDetail";
import { ChallengeResults, ChallengeResultsProps } from "../ChallengeResultsChart";
import { NeedHelp } from "./NeedHelp";

export const ChallengeResolveCard: React.StatelessComponent<
  ListingDetailPhaseCardComponentProps & ChallengePhaseProps & ChallengeResultsProps
> = props => {
  return (
    <StyledListingDetailPhaseCardContainer>
      <StyledListingDetailPhaseCardSection>
        <StyledPhaseKicker>Challenge ID {props.challengeID}</StyledPhaseKicker>
        <StyledPhaseDisplayName>Ready to Complete</StyledPhaseDisplayName>
      </StyledListingDetailPhaseCardSection>

      <ChallengePhaseDetail
        challengeID={props.challengeID}
        challenger={props.challenger}
        rewardPool={props.rewardPool}
        stake={props.stake}
      />

      <StyledListingDetailPhaseCardSection>
        <ChallengeResults
          collapsable={true}
          totalVotes={props.totalVotes}
          votesFor={props.votesFor}
          votesAgainst={props.votesAgainst}
          percentFor={props.percentFor}
          percentAgainst={props.percentAgainst}
        />
      </StyledListingDetailPhaseCardSection>

      <StyledListingDetailPhaseCardSection>
        <CTACopy>
          This challenge is complete. To update this Newsroom's status on the Civil Registry, please{" "}
          <a href="#">resolve this challenge</a>.
        </CTACopy>
        <TransactionInvertedButton
          transactions={props.transactions!}
          modalContentComponents={props.modalContentComponents}
        >
          Resolve Challenge
        </TransactionInvertedButton>
      </StyledListingDetailPhaseCardSection>

      <NeedHelp />
    </StyledListingDetailPhaseCardContainer>
  );
};
