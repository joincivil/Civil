import * as React from "react";
import { compose } from "redux";
import { updateStatus } from "../../apis/civilTCR";
import { ListingWrapper, TwoStepEthTransaction } from "@joincivil/core";
import ChallengeDetailContainer from "./ChallengeDetail";
import { ChallengeResolve } from "./ChallengeResolve";
import {
  InApplicationCard,
  InApplicationResolveCard,
  RejectedCard as RejectedCardComponent,
  LoadingIndicator,
  ModalHeading,
  ModalContent,
  ModalOrderedList,
  ModalListItem,
  ModalListItemTypes,
} from "@joincivil/components";
import { ListingContainerProps, connectLatestChallengeSucceededResults } from "../utility/HigherOrderComponents";
import WhitelistedDetail from "./WhitelistedDetail";

export interface ListingPhaseActionsProps {
  listing: ListingWrapper;
  expiry?: number;
  parameters: any;
  govtParameters: any;
  constitutionURI?: string;
  listingPhaseState: any;
}

export interface ListingPhaseActionsState {
  isChallengeModalOpen?: boolean;
  challengeStatement?: any;
  challengeSummaryStatement?: string;
}

enum ModalContentEventNames {
  IN_PROGRESS_APPROVE_FOR_CHALLENGE = "IN_PROGRESS:APPROVE_FOR_CHALLENGE",
  IN_PROGRESS_SUBMIT_CHALLENGE = "IN_PROGRESS:SUBMIT_CHALLENGE",
  IN_PROGRESS_UPDATE_LISTING = "IN_PROGRESS:UPDATE_LISTING",
}

class ListingPhaseActions extends React.Component<ListingPhaseActionsProps, ListingPhaseActionsState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isChallengeModalOpen: false,
    };
  }

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
    const updateProgressModal = this.renderUpdateProgressModal();
    const modalContentComponents = {
      [ModalContentEventNames.IN_PROGRESS_UPDATE_LISTING]: updateProgressModal,
    };
    const transactions = [
      {
        transaction: this.update,
        progressEventName: ModalContentEventNames.IN_PROGRESS_UPDATE_LISTING,
      },
    ];

    return <InApplicationResolveCard modalContentComponents={modalContentComponents} transactions={transactions} />;
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

  private renderUpdateProgressModal(): JSX.Element {
    return (
      <>
        <LoadingIndicator height={100} />
        <ModalHeading>Transaction in progress</ModalHeading>
        <ModalOrderedList>
          <ModalListItem type={ModalListItemTypes.STRONG}>Approving the listing</ModalListItem>
        </ModalOrderedList>
        <ModalContent>This can take 1-3 minutes. Please don't close the tab.</ModalContent>
        <ModalContent>How about taking a little breather and standing for a bit? Maybe even stretching?</ModalContent>
      </>
    );
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

  // Transactions
  private update = async (): Promise<TwoStepEthTransaction<any>> => {
    return updateStatus(this.props.listing.address);
  };
}

export default ListingPhaseActions;
