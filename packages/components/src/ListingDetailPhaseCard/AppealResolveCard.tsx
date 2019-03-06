import * as React from "react";
import { ListingDetailPhaseCardComponentProps, ChallengePhaseProps, AppealDecisionProps } from "./types";
import {
  StyledListingDetailPhaseCardContainer,
  StyledListingDetailPhaseCardSection,
  StyledPhaseKicker,
  StyledPhaseDisplayName,
  CTACopy,
} from "./styledComponents";
import { TransactionButtonNoModal } from "../TransactionButton";
import { ChallengeResults, ChallengeResultsProps } from "../ChallengeResultsChart";
import { ChallengePhaseDetail } from "./ChallengePhaseDetail";
import NeedHelp from "./NeedHelp";
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

      <StyledListingDetailPhaseCardSection>
        <ChallengePhaseDetail
          challengeID={props.challengeID}
          challenger={props.challenger}
          isViewingUserChallenger={props.isViewingUserChallenger}
          rewardPool={props.rewardPool}
          stake={props.stake}
          dispensationPct={props.dispensationPct}
        />
      </StyledListingDetailPhaseCardSection>

      <StyledListingDetailPhaseCardSection>
        <ChallengeResults
          collapsable={true}
          totalVotes={props.totalVotes}
          votesFor={props.votesFor}
          votesAgainst={props.votesAgainst}
          percentFor={props.percentFor}
          percentAgainst={props.percentAgainst}
          didChallengeSucceed={props.didChallengeOriginallySucceed}
        />
      </StyledListingDetailPhaseCardSection>

      <AppealDecisionDetail
        appealGranted={props.appealGranted}
        appealGrantedStatementUri={props.appealGrantedStatementURI}
      />

      <StyledListingDetailPhaseCardSection>
        <CTACopy>
          This challenge is complete. To update this Newsroom's status on the Civil Registry, please{" "}
          <a href="#">resolve this appeal</a>.
        </CTACopy>
        <TransactionButtonNoModal
          transactions={props.transactions!}
          disabledOnMobile={true}
          onMobileClick={props.onMobileTransactionClick}
        >
          Resolve Appeal
        </TransactionButtonNoModal>
      </StyledListingDetailPhaseCardSection>

      <NeedHelp faqURL={props.faqURL} />
    </StyledListingDetailPhaseCardContainer>
  );
};
