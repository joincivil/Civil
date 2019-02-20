import * as React from "react";
import { ListingDetailPhaseCardComponentProps, ChallengePhaseProps } from "./types";
import {
  CTACopy,
  StyledListingDetailPhaseCardContainer,
  StyledListingDetailPhaseCardSection,
  StyledPhaseKicker,
  StyledPhaseDisplayName,
} from "./styledComponents";
import { ReadyToCompletePhaseDisplayNameText, ResolveChallengeToolTipText } from "./textComponents";
import { TransactionButtonNoModal } from "../TransactionButton";
import { ChallengePhaseDetail } from "./ChallengePhaseDetail";
import { ChallengeResults, ChallengeResultsProps } from "../ChallengeResultsChart";
import NeedHelp from "./NeedHelp";
import { QuestionToolTip } from "../QuestionToolTip";

export const ChallengeResolveCard: React.StatelessComponent<
  ListingDetailPhaseCardComponentProps & ChallengePhaseProps & ChallengeResultsProps
> = props => {
  return (
    <StyledListingDetailPhaseCardContainer>
      <StyledListingDetailPhaseCardSection>
        <StyledPhaseKicker>Challenge ID {props.challengeID}</StyledPhaseKicker>
        <StyledPhaseDisplayName>
          <ReadyToCompletePhaseDisplayNameText />
          <QuestionToolTip explainerText={<ResolveChallengeToolTipText />} positionBottom={true} />
        </StyledPhaseDisplayName>
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

      <StyledListingDetailPhaseCardSection>
        <CTACopy>
          This challenge is complete. To update this Newsroom's status on the Civil Registry, please resolve this
          challenge.
        </CTACopy>
        <TransactionButtonNoModal
          transactions={props.transactions!}
          disabledOnMobile={true}
          onMobileClick={props.onMobileTransactionClick}
        >
          Resolve Challenge
        </TransactionButtonNoModal>
      </StyledListingDetailPhaseCardSection>

      <NeedHelp />
    </StyledListingDetailPhaseCardContainer>
  );
};
