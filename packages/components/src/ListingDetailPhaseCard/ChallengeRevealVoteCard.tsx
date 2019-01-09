import * as React from "react";
import {
  ListingDetailPhaseCardComponentProps,
  PhaseWithExpiryProps,
  ChallengePhaseProps,
  RevealVoteProps,
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
  UnderChallengeToolTipText,
  CommitVoteToolTipText,
  ConfirmVoteToolTipText,
} from "./textComponents";
import { TwoPhaseProgressBarCountdownTimer } from "../PhaseCountdown/";
import { buttonSizes } from "../Button";
import { ChallengePhaseDetail } from "./ChallengePhaseDetail";
import { NeedHelp } from "./NeedHelp";
import { RevealVote } from "./RevealVote";
import { QuestionToolTip } from "../QuestionToolTip";

export type ChallengeRevealVoteCardProps = ListingDetailPhaseCardComponentProps &
  PhaseWithExpiryProps &
  ChallengePhaseProps &
  RevealVoteProps;

export interface ChallengeRevealVoteCardState {
  flipped: boolean;
}

export class ChallengeRevealVoteCard extends React.Component<
  ChallengeRevealVoteCardProps,
  ChallengeRevealVoteCardState
> {
  constructor(props: ChallengeRevealVoteCardProps) {
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
                  displayLabel="Revealing votes"
                  toolTipText={<ConfirmVoteToolTipText phaseLength={this.props.phaseLength} />}
                  secondaryDisplayLabel="Accepting Votes"
                  secondaryToolTipText={<CommitVoteToolTipText phaseLength={this.props.secondaryPhaseLength} />}
                  flavorText="under challenge"
                  activePhaseIndex={1}
                />
              </StyledListingDetailPhaseCardSection>

              <StyledListingDetailPhaseCardSection>
                <ChallengePhaseDetail
                  challengeID={this.props.challengeID}
                  challenger={this.props.challenger}
                  rewardPool={this.props.rewardPool}
                  stake={this.props.stake}
                />
              </StyledListingDetailPhaseCardSection>

              <StyledListingDetailPhaseCardSection bgAccentColor="REVEAL_VOTE">
                {this.renderRevealVote()}
              </StyledListingDetailPhaseCardSection>

              <NeedHelp />
            </StyledListingDetailPhaseCardContainer>
          </StyledCardFront>

          <StyledCardBack>
            <StyledListingDetailPhaseCardContainer>
              <StyledListingDetailPhaseCardSection bgAccentColor="REVEAL_VOTE">
                <StyledCardClose>
                  <span onClick={this.swapFlipped}>✖</span>
                </StyledCardClose>
                <FormHeader>Confirm Your Votes. Make Them Count!</FormHeader>
                <FormCopy>
                  Confirm with your secret phrase and earn CVL tokens should the challenge results end in your favor.
                </FormCopy>
              </StyledListingDetailPhaseCardSection>

              <StyledListingDetailPhaseCardSection>
                <StyledPhaseKicker>Challenge ID {this.props.challengeID}</StyledPhaseKicker>
                <RevealVote
                  salt={this.props.salt}
                  voteOption={this.props.voteOption}
                  onInputChange={this.props.onInputChange}
                  transactions={this.props.transactions}
                  modalContentComponents={this.props.modalContentComponents}
                />
              </StyledListingDetailPhaseCardSection>
            </StyledListingDetailPhaseCardContainer>
          </StyledCardBack>
        </StyledCard>
      </StyledCardStage>
    );
  }

  private renderRevealVote = (): JSX.Element => {
    if (!this.props.userHasCommittedVote) {
      return (
        <>
          <FormHeader>You did not participate in this challenge</FormHeader>
          <FormCopy>You did not commit a vote, so there is nothing here for you to reveal</FormCopy>
        </>
      );
    } else if (this.props.userHasRevealedVote) {
      return (
        <>
          <FormHeader>You have revealed your vote</FormHeader>
          <FormCopy>
            Thank you for participating! Please check back after the challenge ends to see if you have earned a reward{" "}
          </FormCopy>
        </>
      );
    } else {
      return (
        <>
          <FormHeader>Confirm Your Votes. Make Them Count!</FormHeader>
          <FormCopy>
            Confirm with your secret phrase and earn CVL tokens should the challenge results end in your favor.
          </FormCopy>
          <StyledVisibleOnDesktop>
            <FullWidthButton size={buttonSizes.MEDIUM} onClick={this.swapFlipped}>
              Reveal My Vote
            </FullWidthButton>
          </StyledVisibleOnDesktop>
          <StyledVisibleOnMobile>
            <FullWidthButton size={buttonSizes.MEDIUM} onClick={this.props.onMobileTransactionClick}>
              Reveal My Vote
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
