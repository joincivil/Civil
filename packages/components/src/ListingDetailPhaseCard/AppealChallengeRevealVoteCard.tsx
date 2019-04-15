import * as React from "react";
import {
  ListingDetailPhaseCardComponentProps,
  PhaseWithExpiryProps,
  ChallengePhaseProps,
  RevealVoteProps,
  AppealDecisionProps,
  AppealChallengePhaseProps,
} from "./types";
import {
  StyledListingDetailPhaseCardContainer,
  StyledListingDetailPhaseCardSection,
  StyledCardStage,
  StyledCard,
  StyledCardClose,
  StyledCardFront,
  StyledCardBack,
  StyledPhaseKicker,
  StyledPhaseDisplayName,
  StyledVisibleOnDesktop,
  StyledVisibleOnMobile,
  FormHeader,
  FormCopy,
  FullWidthButton,
} from "./styledComponents";
import {
  CommitVoteToolTipText,
  ConfirmVoteToolTipText,
  RevealVoteCallToActionHeaderText,
  RevealVoteCallToActionCopyText,
  RevealVoteDidNotCommitHeaderText,
  RevealVoteDidNotCommitCopyText,
  RevealVoteDoneHeaderText,
  RevealVoteDoneCopyText,
  RevealVoteButtonText,
  RevealVoteCalloutCopyText,
} from "./textComponents";
import { buttonSizes } from "../Button";
import { ChallengeResults, ChallengeResultsProps } from "../ChallengeResultsChart";
import { TwoPhaseProgressBarCountdownTimer } from "../PhaseCountdown/";
import { RevealVote } from "./RevealVote";
import { ChallengePhaseDetail } from "./ChallengePhaseDetail";
import { AppealDecisionDetail } from "./AppealDecisionDetail";
import NeedHelp from "./NeedHelp";

export type AppealChallengeRevealVoteCardProps = ListingDetailPhaseCardComponentProps &
  PhaseWithExpiryProps &
  ChallengePhaseProps &
  RevealVoteProps &
  ChallengeResultsProps &
  AppealDecisionProps &
  AppealChallengePhaseProps;

export interface AppealChallengeRevealVoteCardState {
  flipped: boolean;
}

export class AppealChallengeRevealVoteCard extends React.Component<
  AppealChallengeRevealVoteCardProps,
  AppealChallengeRevealVoteCardState
> {
  constructor(props: AppealChallengeRevealVoteCardProps) {
    super(props);
    this.state = { flipped: false };
  }

  public render(): JSX.Element {
    return (
      <StyledCardStage>
        <StyledCard flipped={this.state.flipped}>
          <StyledCardFront>
            <StyledListingDetailPhaseCardContainer>
              <StyledListingDetailPhaseCardSection>
                <StyledPhaseKicker>Challenge ID {this.props.challengeID}</StyledPhaseKicker>
                <StyledPhaseKicker>Appeal Challenge ID {this.props.appealChallengeID}</StyledPhaseKicker>
                <StyledPhaseDisplayName>Challenge Appeal Decision</StyledPhaseDisplayName>
                <TwoPhaseProgressBarCountdownTimer
                  endTime={this.props.endTime}
                  totalSeconds={this.props.phaseLength}
                  displayLabel="Confirm Vote Phase"
                  toolTipText={<ConfirmVoteToolTipText phaseLength={this.props.phaseLength} />}
                  secondaryDisplayLabel="Submit Vote Phase"
                  secondaryToolTipText={<CommitVoteToolTipText phaseLength={this.props.secondaryPhaseLength} />}
                  flavorText="under challenge"
                  activePhaseIndex={1}
                />
              </StyledListingDetailPhaseCardSection>

              <StyledListingDetailPhaseCardSection>
                <ChallengePhaseDetail
                  challengeID={this.props.challengeID}
                  challenger={this.props.challenger}
                  isViewingUserChallenger={this.props.isViewingUserChallenger}
                  rewardPool={this.props.rewardPool}
                  stake={this.props.stake}
                  dispensationPct={this.props.dispensationPct}
                />
              </StyledListingDetailPhaseCardSection>

              <StyledListingDetailPhaseCardSection>
                <ChallengeResults
                  collapsable={true}
                  totalVotes={this.props.totalVotes}
                  votesFor={this.props.votesFor}
                  votesAgainst={this.props.votesAgainst}
                  percentFor={this.props.percentFor}
                  percentAgainst={this.props.percentAgainst}
                  didChallengeSucceed={this.props.didChallengeOriginallySucceed}
                />
              </StyledListingDetailPhaseCardSection>

              <AppealDecisionDetail
                appealGranted={this.props.appealGranted}
                appealGrantedStatementUri={this.props.appealGrantedStatementURI}
              />

              <StyledListingDetailPhaseCardSection bgAccentColor="REVEAL_VOTE">
                {this.renderRevealVote()}
              </StyledListingDetailPhaseCardSection>

              <NeedHelp faqURL={this.props.faqURL} />
            </StyledListingDetailPhaseCardContainer>
          </StyledCardFront>

          <StyledCardBack>
            <StyledListingDetailPhaseCardContainer>
              <StyledListingDetailPhaseCardSection bgAccentColor="REVEAL_VOTE">
                <StyledCardClose>
                  <span onClick={this.swapFlipped}>✖</span>
                </StyledCardClose>
                <FormHeader>Confirm Your Secret Vote for Appeal Challenge #{this.props.appealChallengeID}</FormHeader>
                <FormCopy>
                  <RevealVoteCalloutCopyText votingSmartContractFaqURL={this.props.votingSmartContractFaqURL} />
                </FormCopy>
              </StyledListingDetailPhaseCardSection>
              <StyledListingDetailPhaseCardSection>
                <RevealVote
                  isAppealChallenge={true}
                  salt={this.props.salt}
                  voteOption={this.props.voteOption}
                  onInputChange={this.props.onInputChange}
                  transactions={this.props.transactions}
                  votingSmartContractFaqURL={this.props.votingSmartContractFaqURL}
                />
                />
              </StyledListingDetailPhaseCardSection>
            </StyledListingDetailPhaseCardContainer>
          </StyledCardBack>
        </StyledCard>
      </StyledCardStage>
    );
  }

  private renderRevealVote = (): JSX.Element => {
    if (this.props.userHasCommittedVote === false) {
      return (
        <>
          <FormHeader>
            <RevealVoteDidNotCommitHeaderText />
          </FormHeader>
          <FormCopy>
            <RevealVoteDidNotCommitCopyText />
          </FormCopy>
        </>
      );
    } else if (this.props.userHasRevealedVote) {
      return (
        <>
          <FormHeader>
            <RevealVoteDoneHeaderText />
          </FormHeader>
          <FormCopy>
            <RevealVoteDoneCopyText />
          </FormCopy>
        </>
      );
    } else {
      return (
        <>
          <FormHeader>
            <RevealVoteCallToActionHeaderText />
          </FormHeader>
          <FormCopy>
            <RevealVoteCallToActionCopyText />
          </FormCopy>
          <StyledVisibleOnDesktop>
            <FullWidthButton size={buttonSizes.MEDIUM} onClick={this.swapFlipped}>
              <RevealVoteButtonText />
            </FullWidthButton>
          </StyledVisibleOnDesktop>
          <StyledVisibleOnMobile>
            <FullWidthButton size={buttonSizes.MEDIUM} onClick={this.props.onMobileTransactionClick}>
              <RevealVoteButtonText />
            </FullWidthButton>
          </StyledVisibleOnMobile>
        </>
      );
    }
  };

  private swapFlipped = (): void => {
    this.setState(() => ({ flipped: !this.state.flipped }));
  };
}
