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
import { TransactionInvertedButton } from "../TransactionButton";
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
          <QuestionToolTip explainerText={<ResolveChallengeToolTipText />} strokeColor="#000" />
        </StyledPhaseDisplayName>
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
        <ChallengeResults
          headerText="Appeal Challenge Results"
          totalVotes={props.appealChallengeTotalVotes}
          votesFor={props.appealChallengeVotesFor}
          votesAgainst={props.appealChallengeVotesAgainst}
          percentFor={props.appealChallengePercentFor}
          percentAgainst={props.appealChallengePercentAgainst}
        />
      </StyledListingDetailPhaseCardSection>

      <StyledListingDetailPhaseCardSection>
        <CTACopy>
          This challenge is complete. To update this Newsroom's status on the Civil Registry, please{" "}
          <a href="#">resolve this appeal</a>.
        </CTACopy>
        <TransactionInvertedButton
          transactions={props.transactions!}
          modalContentComponents={props.modalContentComponents}
        >
          Resolve Appeal Challenge
        </TransactionInvertedButton>
      </StyledListingDetailPhaseCardSection>

      <NeedHelp />
    </StyledListingDetailPhaseCardContainer>
  );
};
