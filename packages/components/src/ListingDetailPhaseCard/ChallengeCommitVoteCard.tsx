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
  StyledVisibleOnDesktop,
  StyledVisibleOnMobile,
  FormHeader,
  FormCopy,
  FullWidthButton,
} from "./styledComponents";
import {
  UnderChallengePhaseDisplayNameText,
  CommitVoteCalloutHeaderText,
  CommitVoteCalloutCopyText,
  CommitVoteAlreadyVotedHeaderText,
  CommitVoteAlreadyVotedCopyText,
  UnderChallengeToolTipText,
  CommitVoteToolTipText,
  ConfirmVoteToolTipText,
} from "./textComponents";
import { TwoPhaseProgressBarCountdownTimer } from "../PhaseCountdown/";
import { buttonSizes } from "../Button";
import NeedHelp from "./NeedHelp";
import { ChallengePhaseDetail } from "./ChallengePhaseDetail";
import { CommitVote } from "./CommitVote";
import { QuestionToolTip } from "../QuestionToolTip";

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
      <StyledCardStage>
        <StyledCard flipped={this.state.flipped}>
          <StyledCardFront>
            <StyledListingDetailPhaseCardContainer>
              <StyledListingDetailPhaseCardSection>
                <StyledPhaseKicker>Challenge ID {this.props.challengeID}</StyledPhaseKicker>
                <StyledPhaseDisplayName>
                  <UnderChallengePhaseDisplayNameText />
                  <QuestionToolTip explainerText={<UnderChallengeToolTipText />} positionBottom={true} />
                </StyledPhaseDisplayName>
                <TwoPhaseProgressBarCountdownTimer
                  endTime={this.props.endTime}
                  totalSeconds={this.props.phaseLength}
                  displayLabel="Accepting votes"
                  toolTipText={<CommitVoteToolTipText />}
                  secondaryDisplayLabel="Confirming Votes"
                  secondaryToolTipText={<ConfirmVoteToolTipText />}
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
                <FormHeader>Submit a Secret Vote for Challenge #{this.props.challengeID}</FormHeader>
              </StyledListingDetailPhaseCardSection>
              <StyledListingDetailPhaseCardSection>
                <CommitVote
                  tokenBalance={this.props.tokenBalance}
                  votingTokenBalance={this.props.votingTokenBalance}
                  tokenBalanceDisplay={this.props.tokenBalanceDisplay}
                  votingTokenBalanceDisplay={this.props.votingTokenBalanceDisplay}
                  voteOption={this.props.voteOption}
                  salt={this.props.salt}
                  numTokens={this.props.numTokens}
                  onInputChange={this.props.onInputChange}
                  userHasCommittedVote={this.props.userHasCommittedVote}
                  onReviewVote={this.props.onReviewVote}
                  onCommitMaxTokens={this.props.onCommitMaxTokens}
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
          <CommitVoteCalloutCopyText />
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
