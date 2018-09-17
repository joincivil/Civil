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
  FormHeader,
  FormCopy,
  FullWidthButton,
} from "./styledComponents";
import { CommitVoteToolTipText, ConfirmVoteToolTipText } from "./textComponents";
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
                  toolTipText={<CommitVoteToolTipText />}
                  secondaryDisplayLabel="Revealing Votes"
                  secondaryToolTipText={<ConfirmVoteToolTipText />}
                  flavorText="under challenge"
                  activePhaseIndex={0}
                />
              </StyledListingDetailPhaseCardSection>

              <ChallengePhaseDetail
                challengeID={this.props.challengeID}
                challenger={this.props.challenger}
                rewardPool={this.props.rewardPool}
                stake={this.props.stake}
              />

              <StyledListingDetailPhaseCardSection>
                <ChallengeResults
                  collapsable={true}
                  totalVotes={this.props.totalVotes}
                  votesFor={this.props.votesFor}
                  votesAgainst={this.props.votesAgainst}
                  percentFor={this.props.percentFor}
                  percentAgainst={this.props.percentAgainst}
                />
              </StyledListingDetailPhaseCardSection>

              <AppealDecisionDetail appealGranted={this.props.appealGranted} />

              <StyledListingDetailPhaseCardSection bgAccentColor="COMMIT_VOTE">
                <FormHeader>Submit Your Votes!</FormHeader>
                <FormCopy>
                  Submit your vote with your CVL tokens, and help curate credible, trustworthy journalism on Civil.
                </FormCopy>
                <FullWidthButton size={buttonSizes.MEDIUM} onClick={this.swapFlipped}>
                  Submit My Vote
                </FullWidthButton>
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
                <FormHeader>Submit Your Votes!</FormHeader>
                <FormCopy>
                  Submit your vote with your CVL tokens, and help curate credible, trustworthy journalism on Civil.
                </FormCopy>
              </StyledListingDetailPhaseCardSection>
              <StyledListingDetailPhaseCardSection>
                <StyledPhaseKicker>Appeal Challenge ID {this.props.appealChallengeID}</StyledPhaseKicker>
                <CommitVote
                  tokenBalance={this.props.tokenBalance}
                  salt={this.props.salt}
                  numTokens={this.props.numTokens}
                  onInputChange={this.props.onInputChange}
                  userHasCommittedVote={this.props.userHasCommittedVote}
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
}
