import * as React from "react";
import styled from "styled-components";
import {
  ListingWrapper,
  isInApplicationPhase,
  canBeWhitelisted,
  canChallengeBeResolved,
  isInChallengedCommitVotePhase,
  isInChallengedRevealVotePhase,
  isListingAwaitingAppealChallenge,
  isAwaitingAppealRequest,
  isAwaitingAppealJudgment,
  isInAppealChallengeCommitPhase,
  isInAppealChallengeRevealPhase,
  canListingAppealBeResolved,
  canListingAppealChallengeBeResolved,
  WrappedChallengeData,
  UserChallengeData,
} from "@joincivil/core";
import { SectionHeader } from "./ListItemStyle";
import CountdownTimer from "../utility/CountdownTimer";

const StyledDiv = styled.div`
  width: 18%;
  padding: 5px;
`;

export interface ListingListItemStatusProps {
  listing: ListingWrapper;
  challenge?: WrappedChallengeData;
  userChallengeData?: UserChallengeData;
  userAppealChallengeData?: UserChallengeData;
}

class ListingListItemStatus extends React.Component<ListingListItemStatusProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <StyledDiv>
        <SectionHeader>STATUS</SectionHeader>
        <br />
        {this.renderStatus()}
        {this.renderUserChallengeActions()}
        {this.renderUserAppealChallengeActions()}
      </StyledDiv>
    );
  }

  private renderStatus = (): JSX.Element => {
    if (this.props.challenge && this.props.challenge.challenge.resolved) {
      return this.renderResolvedChallenge();
    } else if (this.props.listing) {
      const listingData = this.props.listing.data;
      if (isInApplicationPhase(listingData)) {
        return this.renderApplicationStatus();
      } else if (canBeWhitelisted(listingData)) {
        return this.renderCanWhitelist();
      } else if (isInChallengedCommitVotePhase(listingData)) {
        return this.renderChallengeCommitPhase();
      } else if (isInChallengedRevealVotePhase(listingData)) {
        return this.renderChallengeRevealPhase();
      } else if (isAwaitingAppealRequest(listingData)) {
        return this.renderAwaitingAppealRequest();
      } else if (canChallengeBeResolved(listingData)) {
        return this.renderChallengeCanBeResolved();
      } else if (isAwaitingAppealJudgment(listingData)) {
        return this.renderAwaitingAppealJudgement();
      } else if (isListingAwaitingAppealChallenge(listingData)) {
        return this.renderAwaitingAppealChallenge();
      } else if (canListingAppealBeResolved(listingData)) {
        return this.renderAppealCanBeResolved();
      } else if (isInAppealChallengeCommitPhase(listingData)) {
        return this.renderAppealChallengeCommitPhase();
      } else if (isInAppealChallengeRevealPhase(listingData)) {
        return this.renderAppealChallengeRevealPhase();
      } else if (canListingAppealChallengeBeResolved(listingData)) {
        return this.renderAppealChallengeCanBeResolved();
      }
    }
    return <>none</>;
  };

  private renderUserChallengeActions = (): JSX.Element => {
    const challenge = this.props.userChallengeData;
    if (challenge) {
      return (
        <>
          <br />
          {challenge.didUserCommit && (
            <>
              USER DID COMMIT<br />
            </>
          )}
          {challenge.didUserReveal && (
            <>
              USER DID REVEAL<br />
            </>
          )}
        </>
      );
    }
    return <></>;
  };

  private renderUserAppealChallengeActions = (): JSX.Element => {
    const challenge = this.props.userAppealChallengeData;
    if (challenge) {
      return (
        <>
          <br />
          {challenge.didUserCommit && (
            <>
              USER DID COMMIT ON APPEAL CHALLENGE<br />
            </>
          )}
          {challenge.didUserReveal && (
            <>
              USER DID REVEAL ON APPEAL CHALLENGE<br />
            </>
          )}
        </>
      );
    }
    return <></>;
  };

  private renderResolvedChallenge = (): JSX.Element => {
    return <>CHALLENGE RESOLVED</>;
  };

  private renderApplicationStatus = (): JSX.Element => {
    return (
      <>
        APPLYING - <CountdownTimer endTime={this.props.listing!.data.appExpiry.toNumber()} />
      </>
    );
  };

  private renderCanWhitelist = (): JSX.Element => {
    return <>READY TO WHITELIST</>;
  };
  private renderChallengeCanBeResolved = (): JSX.Element => {
    return <>READY TO RESOLVE CHALLENGE</>;
  };
  private renderAppealCanBeResolved = (): JSX.Element => {
    return <>READY TO RESOLVE APPEAL</>;
  };
  private renderAppealChallengeCanBeResolved = (): JSX.Element => {
    return <>READY TO RESOLVE APPEAL CHALLENGE</>;
  };
  private renderChallengeCommitPhase = (): JSX.Element => {
    return (
      <>
        CHALLENGE ACCEPTING VOTES -{" "}
        <CountdownTimer endTime={this.props.listing!.data.challenge!.poll.commitEndDate.toNumber()} />
      </>
    );
  };
  private renderAppealChallengeCommitPhase = (): JSX.Element => {
    return (
      <>
        APPEAL CHALLENGE ACCEPTING VOTES -{" "}
        <CountdownTimer
          endTime={this.props.listing!.data.challenge!.appeal!.appealChallenge!.poll.commitEndDate.toNumber()}
        />
      </>
    );
  };
  private renderChallengeRevealPhase = (): JSX.Element => {
    return (
      <>
        CHALLENGE REVEALING VOTES -{" "}
        <CountdownTimer endTime={this.props.listing!.data.challenge!.poll.revealEndDate.toNumber()} />
      </>
    );
  };
  private renderAppealChallengeRevealPhase = (): JSX.Element => {
    return (
      <>
        CHALLENGE REVEALING VOTES -{" "}
        <CountdownTimer endTime={this.props.listing!.data.challenge!.poll.revealEndDate.toNumber()} />
      </>
    );
  };
  private renderAwaitingAppealRequest = (): JSX.Element => {
    return (
      <>
        APPEAL CAN BE REQUESTED -{" "}
        <CountdownTimer endTime={this.props.listing!.data.challenge!.requestAppealExpiry.toNumber()} />
      </>
    );
  };
  private renderAwaitingAppealJudgement = (): JSX.Element => {
    return (
      <>
        APPEAL BEING CONSIDERED BY COUNCIL -{" "}
        <CountdownTimer endTime={this.props.listing!.data.challenge!.appeal!.appealPhaseExpiry.toNumber()} />
      </>
    );
  };
  private renderAwaitingAppealChallenge = (): JSX.Element => {
    return (
      <>
        APPEAL RESULT CAN BE CHALLENGED -{" "}
        <CountdownTimer endTime={this.props.listing!.data.challenge!.appeal!.appealPhaseExpiry.toNumber()} />
      </>
    );
  };
}

export default ListingListItemStatus;
