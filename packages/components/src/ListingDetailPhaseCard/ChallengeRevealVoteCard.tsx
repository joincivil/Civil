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
  RevealVoteCallToActionHeaderText,
  RevealVoteCallToActionCopyText,
  RevealVoteDidNotCommitHeaderText,
  RevealVoteDidNotCommitCopyText,
  RevealVoteDoneHeaderText,
  RevealVoteDoneCopyText,
  RevealVoteButtonText,
  RevealVoteCalloutCopyText,
} from "./textComponents";
import { TwoPhaseProgressBarCountdownTimer } from "../PhaseCountdown/";
import { buttonSizes } from "../Button";
import { ChallengePhaseDetail } from "./ChallengePhaseDetail";
import NeedHelp from "./NeedHelp";
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
                <FormHeader>Confirm Your Secret Vote for Challenge #{this.props.challengeID}</FormHeader>
                <FormCopy>
                  <RevealVoteCalloutCopyText votingSmartContractFaqURL={this.props.votingSmartContractFaqURL} />
                </FormCopy>
              </StyledListingDetailPhaseCardSection>

              <StyledListingDetailPhaseCardSection>
                <RevealVote
                  salt={this.props.salt}
                  voteOption={this.props.voteOption}
                  onInputChange={this.props.onInputChange}
                  transactions={this.props.transactions}
                  votingSmartContractFaqURL={this.props.votingSmartContractFaqURL}
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
