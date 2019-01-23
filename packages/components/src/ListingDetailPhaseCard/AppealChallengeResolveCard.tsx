import * as React from "react";
import {
  ListingDetailPhaseCardComponentProps,
  ChallengePhaseProps,
  AppealDecisionProps,
  AppealChallengePhaseProps,
} from "./types";
import {
  StyledListingDetailPhaseCardContainer,
  StyledListingDetailPhaseCardSection,
  StyledPhaseKicker,
  StyledPhaseDisplayName,
  CTACopy,
} from "./styledComponents";
import { ReadyToCompletePhaseDisplayNameText, ResolveChallengeToolTipText } from "./textComponents";
import { TransactionButtonNoModal } from "../TransactionButton";
import { ChallengePhaseDetail } from "./ChallengePhaseDetail";
import { ChallengeResults, ChallengeResultsProps } from "../ChallengeResultsChart";
import { NeedHelp } from "./NeedHelp";
import { AppealDecisionDetail } from "./AppealDecisionDetail";
import { QuestionToolTip } from "../QuestionToolTip";

export interface AppealChallengeResultsProps {
  appealChallengeTotalVotes: string;
  appealChallengeVotesFor: string;
  appealChallengeVotesAgainst: string;
  appealChallengePercentFor: string;
  appealChallengePercentAgainst: string;
  didAppealChallengeSucceed: boolean;
}

export const AppealChallengeResolveCard: React.SFC<
  ListingDetailPhaseCardComponentProps &
    ChallengePhaseProps &
    ChallengeResultsProps &
    AppealDecisionProps &
    AppealChallengePhaseProps &
    AppealChallengeResultsProps
> = props => {
  return (
    <StyledListingDetailPhaseCardContainer>
      <StyledListingDetailPhaseCardSection>
        <StyledPhaseKicker>Challenge ID {props.challengeID}</StyledPhaseKicker>
        <StyledPhaseKicker>Appeal Challenge ID {props.appealChallengeID}</StyledPhaseKicker>
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
          didChallengeSucceed={props.didChallengeSucceed}
        />
      </StyledListingDetailPhaseCardSection>

      <AppealDecisionDetail appealGranted={props.appealGranted} />

      <StyledListingDetailPhaseCardSection>
        <ChallengeResults
          headerText={`Appeal Challenge #${props.appealChallengeID} Results`}
          totalVotes={props.appealChallengeTotalVotes}
          votesFor={props.appealChallengeVotesFor}
          votesAgainst={props.appealChallengeVotesAgainst}
          percentFor={props.appealChallengePercentFor}
          percentAgainst={props.appealChallengePercentAgainst}
          didChallengeSucceed={props.didAppealChallengeSucceed}
          isAppealChallenge={true}
        />
      </StyledListingDetailPhaseCardSection>

      <StyledListingDetailPhaseCardSection>
        <CTACopy>
          This challenge is complete. To update this Newsroom's status on the Civil Registry, please resolve this appeal
          challenge.
        </CTACopy>
        <TransactionButtonNoModal
          transactions={props.transactions!}
          disabledOnMobile={true}
          onMobileClick={props.onMobileTransactionClick}
        >
          Resolve Appeal Challenge
        </TransactionButtonNoModal>
      </StyledListingDetailPhaseCardSection>

      <NeedHelp />
    </StyledListingDetailPhaseCardContainer>
  );
};
