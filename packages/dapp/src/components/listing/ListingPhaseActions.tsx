import * as React from "react";
import { compose } from "redux";
import { ListingWrapper } from "@joincivil/core";
import ChallengeDetailContainer from "./ChallengeDetail";
import { ChallengeResolve } from "./ChallengeResolve";
import {
  InApplicationCard,
  RejectedCard as RejectedCardComponent,
} from "@joincivil/components";
import { ListingContainerProps, connectLatestChallengeSucceededResults } from "../utility/HigherOrderComponents";
import ApplicationUpdateStatus from "./ApplicationUpdateStatus";
import WhitelistedDetail from "./WhitelistedDetail";

export interface ListingPhaseActionsProps {
  listing: ListingWrapper;
  expiry?: number;
  parameters: any;
  govtParameters: any;
  constitutionURI?: string;
  listingPhaseState: any;
}

class ListingPhaseActions extends React.Component<ListingPhaseActionsProps> {
  public render(): JSX.Element {
    const listing = this.props.listing;
    const {
      isInApplication,
      isWhitelisted,
      isRejected,
      canBeWhitelisted,
      canResolveChallenge,
    } = this.props.listingPhaseState;
    const challenge = this.props.listing.data.challenge;
    return (
      <>
        {isWhitelisted && (!challenge || challenge.resolved) && this.renderApplicationWhitelisted()}
        {isRejected && (!challenge || challenge.resolved) && this.renderRejected()}
        {isInApplication && this.renderApplicationPhase()}
        {listing.data && (
          <>
            {canBeWhitelisted && this.renderCanWhitelist()}
            {canResolveChallenge && this.renderCanResolve()}

            {listing.data.challenge &&
              !listing.data.challenge.resolved &&
              !canResolveChallenge && (
                <ChallengeDetailContainer
                  challengeID={this.props.listing.data.challengeID}
                  listingAddress={this.props.listing.address}
                  challengeData={{
                    listingAddress: this.props.listing.address,
                    challengeID: this.props.listing.data.challengeID,
                    challenge: this.props.listing.data.challenge!,
                  }}
                />
              )}
          </>
        )}
      </>
    );
  }

  private renderCanWhitelist = (): JSX.Element => {
    return <ApplicationUpdateStatus listingAddress={this.props.listing!.address} />
  };

  private renderCanResolve(): JSX.Element {
    return (
      <ChallengeResolve listingAddress={this.props.listing.address} challengeID={this.props.listing.data.challengeID} />
    );
  }

  private renderApplicationWhitelisted(): JSX.Element {
    return (
      <>
        <WhitelistedDetail listingAddress={this.props.listing.address} constitutionURI={this.props.constitutionURI} />
      </>
    );
  }

  private renderRejected(): JSX.Element {
    const RejectedCard = compose<React.ComponentClass<ListingContainerProps & {}>>(
      connectLatestChallengeSucceededResults,
    )(RejectedCardComponent);

    return <RejectedCard listingAddress={this.props.listing.address} />;
  }

  private renderApplicationPhase(): JSX.Element | null {
    const endTime = this.props.listing!.data.appExpiry.toNumber();
    const phaseLength = this.props.parameters.applyStageLen;
    if (!endTime || !phaseLength) {
      return null;
    }
    const submitChallengeURI = `/listing/${this.props.listing.address}/submit-challenge`;

    return (
      <>
        <InApplicationCard
          endTime={endTime}
          phaseLength={phaseLength}
          submitChallengeURI={submitChallengeURI}
          constitutionURI={this.props.constitutionURI}
        />
      </>
    );
  }
}

export default ListingPhaseActions;
