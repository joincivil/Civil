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
  StyledPhaseKicker,
  StyledPhaseDisplayName,
  CTACopy,
} from "./styledComponents";
import { ReadyToCompletePhaseDisplayNameText, ResolveChallengeToolTipText } from "./textComponents";
import { TransactionButtonNoModal } from "../TransactionButton";
import { ChallengePhaseDetail } from "./ChallengePhaseDetail";
import { ChallengeResults, ChallengeResultsProps } from "../ChallengeResultsChart";
import NeedHelp from "./NeedHelp";
import { AppealDecisionDetail } from "./AppealDecisionDetail";
import { QuestionToolTip } from "../QuestionToolTip";

export type AppealChallengeResolveCardProps = ListingDetailPhaseCardComponentProps &
  ChallengePhaseProps &
  ChallengeResultsProps &
  AppealDecisionProps &
  AppealChallengePhaseProps &
  AppealChallengeResultsProps;

export const AppealChallengeResolveCard: React.FunctionComponent<AppealChallengeResolveCardProps> = props => {
  const showAppealChallenge =
    props.appealChallengeTotalVotes &&
    props.appealChallengeVotesFor &&
    props.appealChallengeVotesAgainst &&
    props.appealChallengePercentFor &&
    props.appealChallengePercentAgainst;
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
          didChallengeSucceed={props.didChallengeSucceed}
        />
      </StyledListingDetailPhaseCardSection>

      <AppealDecisionDetail
        appealGranted={props.appealGranted}
        appealGrantedStatementURI={props.appealGrantedStatementURI}
      />

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

      <NeedHelp faqURL={props.faqURL} />
    </StyledListingDetailPhaseCardContainer>
  );
};
