import * as React from "react";
import {
  ListingDetailPhaseCardComponentProps,
  PhaseWithExpiryProps,
  ChallengePhaseProps,
  CommitVoteProps,
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
import { TwoPhaseProgressBarCountdownTimer } from "../PhaseCountdown/";
import { buttonSizes } from "../Button";
import { NeedHelp } from "./NeedHelp";
import { ChallengePhaseDetail } from "./ChallengePhaseDetail";
import { CommitVote } from "./CommitVote";

export type ChallengeCommitVoteCardProps = ListingDetailPhaseCardComponentProps &
  PhaseWithExpiryProps &
  ChallengePhaseProps &
  CommitVoteProps;

export interface ChallengeCommitVoteCardState {
  flipped: boolean;
}

export class ChallengeCommitVoteCard extends React.Component<
  ChallengeCommitVoteCardProps,
  ChallengeCommitVoteCardState
> {
  constructor(props: ChallengeCommitVoteCardProps) {
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
                <StyledPhaseDisplayName>Under Challenge</StyledPhaseDisplayName>
                <TwoPhaseProgressBarCountdownTimer
                  endTime={this.props.endTime}
                  totalSeconds={this.props.phaseLength}
                  displayLabel="Accepting votes"
                  secondaryDisplayLabel="Confirming Votes"
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

              {this.renderCommitVoteCallout()}

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
                <StyledPhaseKicker>Challenge ID {this.props.challengeID}</StyledPhaseKicker>
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

  private renderCommitVoteCallout = (): JSX.Element => {
    if (this.props.userHasCommittedVote) {
      return (
        <StyledListingDetailPhaseCardSection bgAccentColor="COMMIT_VOTE">
          <FormHeader>Thanks for participating in this challenge!</FormHeader>
          <FormCopy>
            You have committed a vote in this challenge. Thanks for that. You can change your vote until the deadline.
          </FormCopy>
          <FullWidthButton size={buttonSizes.MEDIUM} onClick={this.swapFlipped}>
            Submit My Vote
          </FullWidthButton>
        </StyledListingDetailPhaseCardSection>
      );
    }
    return (
      <StyledListingDetailPhaseCardSection bgAccentColor="COMMIT_VOTE">
        <FormHeader>Submit Your Votes!</FormHeader>
        <FormCopy>
          Submit your vote with your CVL tokens, and help curate credible, trustworthy journalism on Civil.
        </FormCopy>
        <FullWidthButton size={buttonSizes.MEDIUM} onClick={this.swapFlipped}>
          Submit My Vote
        </FullWidthButton>
      </StyledListingDetailPhaseCardSection>
    );
  };
}
