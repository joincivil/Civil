import * as React from "react";
import {
  ListingDetailPhaseCardComponentProps,
  PhaseWithExpiryProps,
  ChallengePhaseProps,
  CommitVoteProps,
  AppealDecisionProps,
  AppealChallengePhaseProps,
} from "./types";
import {
  StyledListingDetailPhaseCardContainer,
  StyledListingDetailPhaseCardSection,
  StyledPhaseKicker,
  StyledPhaseDisplayName,
  StyledCardStage,
  StyledCard,
  StyledCardClose,
  StyledCardFront,
  StyledCardBack,
  StyledVisibleOnDesktop,
  StyledVisibleOnMobile,
  FormHeader,
  FormCopy,
  FullWidthButton,
} from "./styledComponents";
import {
  CommitVoteCalloutHeaderText,
  AppealChallengeCommitVoteCalloutCopyText,
  CommitVoteAlreadyVotedHeaderText,
  CommitVoteAlreadyVotedCopyText,
  CommitVoteToolTipText,
  ConfirmVoteToolTipText,
} from "./textComponents";
import { buttonSizes } from "../Button";
import { ChallengeResults, ChallengeResultsProps } from "../ChallengeResultsChart";
import { TwoPhaseProgressBarCountdownTimer } from "../PhaseCountdown/";
import { CommitVote } from "./CommitVote";
import { ChallengePhaseDetail } from "./ChallengePhaseDetail";
import { AppealDecisionDetail } from "./AppealDecisionDetail";
import { NeedHelp } from "./NeedHelp";

export type AppealChallengeCommitVoteCardProps = ListingDetailPhaseCardComponentProps &
  PhaseWithExpiryProps &
  ChallengePhaseProps &
  ChallengeResultsProps &
  CommitVoteProps &
  AppealDecisionProps &
  AppealChallengePhaseProps;

export interface AppealChallengeCommitVoteCardState {
  flipped: boolean;
}

export class AppealChallengeCommitVoteCard extends React.Component<
  AppealChallengeCommitVoteCardProps,
  AppealChallengeCommitVoteCardState
> {
  constructor(props: AppealChallengeCommitVoteCardProps) {
    super(props);
    this.state = { flipped: false };
  }

  public render(): JSX.Element {
    return (
      <StyledCardStage width="485">
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
                  displayLabel="Accepting votes"
                  toolTipText={<CommitVoteToolTipText phaseLength={this.props.phaseLength} />}
                  secondaryDisplayLabel="Revealing Votes"
                  secondaryToolTipText={<ConfirmVoteToolTipText phaseLength={this.props.secondaryPhaseLength} />}
                  flavorText="under challenge"
                  activePhaseIndex={0}
                />
              </StyledListingDetailPhaseCardSection>

              <StyledListingDetailPhaseCardSection>
                <ChallengePhaseDetail
                  challengeID={this.props.challengeID}
                  challenger={this.props.challenger}
                  isViewingUserChallenger={this.props.isViewingUserChallenger}
                  rewardPool={this.props.rewardPool}
                  stake={this.props.stake}
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
                  didChallengeSucceed={this.props.didChallengeSucceed}
                />
              </StyledListingDetailPhaseCardSection>

              <AppealDecisionDetail appealGranted={this.props.appealGranted} />

              <StyledListingDetailPhaseCardSection bgAccentColor="COMMIT_VOTE">
                {this.renderCommitVoteCallout()}
                <StyledVisibleOnDesktop>
                  <FullWidthButton size={buttonSizes.MEDIUM} onClick={this.swapFlipped}>
                    {this.renderCommitVoteButtonText()}
                  </FullWidthButton>
                </StyledVisibleOnDesktop>
                <StyledVisibleOnMobile>
                  <FullWidthButton size={buttonSizes.MEDIUM} onClick={this.props.onMobileTransactionClick}>
                    {this.renderCommitVoteButtonText()}
                  </FullWidthButton>
                </StyledVisibleOnMobile>
              </StyledListingDetailPhaseCardSection>

              <NeedHelp />
            </StyledListingDetailPhaseCardContainer>
          </StyledCardFront>

          <StyledCardBack>
            <StyledListingDetailPhaseCardContainer>
              <StyledListingDetailPhaseCardSection bgAccentColor="COMMIT_VOTE">
                <StyledCardClose>
                  <span onClick={this.swapFlipped}>✖</span>
                </StyledCardClose>
                {this.renderCommitVoteCallout()}
              </StyledListingDetailPhaseCardSection>
              <StyledListingDetailPhaseCardSection>
                <StyledPhaseKicker>Appeal Challenge ID {this.props.appealChallengeID}</StyledPhaseKicker>
                <CommitVote
                  isAppealChallenge={true}
                  tokenBalance={this.props.tokenBalance}
                  votingTokenBalance={this.props.votingTokenBalance}
                  tokenBalanceDisplay={this.props.tokenBalanceDisplay}
                  votingTokenBalanceDisplay={this.props.votingTokenBalanceDisplay}
                  salt={this.props.salt}
                  numTokens={this.props.numTokens}
                  onInputChange={this.props.onInputChange}
                  userHasCommittedVote={this.props.userHasCommittedVote}
                  onCommitMaxTokens={this.props.onCommitMaxTokens}
                  onReviewVote={this.props.onReviewVote}
                />
              </StyledListingDetailPhaseCardSection>
            </StyledListingDetailPhaseCardContainer>
          </StyledCardBack>
        </StyledCard>
      </StyledCardStage>
    );
  }

  private swapFlipped = (): void => {
    this.setState(() => ({ flipped: !this.state.flipped }));
  };

  private renderCommitVoteCallout = (): JSX.Element => {
    if (this.props.userHasCommittedVote) {
      return (
        <>
          <FormHeader>
            <CommitVoteAlreadyVotedHeaderText />
          </FormHeader>
          <FormCopy>
            <CommitVoteAlreadyVotedCopyText />
          </FormCopy>
        </>
      );
    }
    return (
      <>
        <FormHeader>
          <CommitVoteCalloutHeaderText />
        </FormHeader>
        <FormCopy>
          <AppealChallengeCommitVoteCalloutCopyText />
        </FormCopy>
      </>
    );
  };

  private renderCommitVoteButtonText = (): JSX.Element => {
    if (this.props.userHasCommittedVote) {
      return <>Change My Vote</>;
    }
    return <>Ready To Commit My Vote</>;
  };
}
