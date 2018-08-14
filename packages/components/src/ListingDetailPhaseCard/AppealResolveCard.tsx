import * as React from "react";
import { ListingDetailPhaseCardComponentProps, ChallengePhaseProps, AppealDecisionProps } from "./types";
import {
  StyledListingDetailPhaseCardContainer,
  StyledListingDetailPhaseCardSection,
  StyledPhaseKicker,
  StyledPhaseDisplayName,
  CTACopy,
} from "./styledComponents";
import { TransactionInvertedButton } from "../TransactionButton";
import { ChallengeResults, ChallengeResultsProps } from "../ChallengeResultsChart";
import { ChallengePhaseDetail } from "./ChallengePhaseDetail";
import { NeedHelp } from "./NeedHelp";
import { AppealDecisionDetail } from "./AppealDecisionDetail";

export const AppealResolveCard: React.StatelessComponent<
  ListingDetailPhaseCardComponentProps & ChallengePhaseProps & AppealDecisionProps & ChallengeResultsProps
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

      <AppealDecisionDetail appealGranted={props.appealGranted} />

      <StyledListingDetailPhaseCardSection>
        <CTACopy>
          This challenge is complete. To update this Newsroom's status on the Civil Registry, please{" "}
          <a href="#">resolve this appeal</a>.
        </CTACopy>
        <TransactionInvertedButton
          transactions={props.transactions!}
          modalContentComponents={props.modalContentComponents}
        >
          Resolve Appeal
        </TransactionInvertedButton>
      </StyledListingDetailPhaseCardSection>

      <NeedHelp />
    </StyledListingDetailPhaseCardContainer>
  );
};
