import * as React from "react";
import { compose } from "redux";
import { approveForChallenge, challengeListing, updateStatus } from "../../apis/civilTCR";
import { ListingWrapper, TwoStepEthTransaction } from "@joincivil/core";
import ChallengeDetailContainer from "./ChallengeDetail";
import { ChallengeResolve } from "./ChallengeResolve";
import {
  InApplicationCard,
  InApplicationResolveCard,
  WhitelistedCard,
  RejectedCard as RejectedCardComponent,
  LoadingIndicator,
  ModalHeading,
  ModalContent,
  ModalOrderedList,
  ModalListItem,
  ModalListItemTypes,
  SubmitChallengeModal,
  SubmitChallengeModalProps,
} from "@joincivil/components";
import { getFormattedTokenBalance } from "@joincivil/utils";
import { getCivil } from "../../helpers/civilInstance";
import { ListingContainerProps, connectLatestChallengeSucceededResults } from "../utility/HigherOrderComponents";

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
        {isWhitelisted && !challenge && this.renderApplicationWhitelisted()}
        {isRejected && this.renderRejected()}
        {isInApplication && this.renderApplicationPhase()}
        {listing.data && (
          <>
            {canBeWhitelisted && this.renderCanWhitelist()}
            {canResolveChallenge && this.renderCanResolve()}

            {listing.data.challenge && (
              <ChallengeDetailContainer
                challengeID={this.props.listing.data.challengeID}
                listingAddress={this.props.listing.address}
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
    // @TODO(jon): Get the Whitelisted event for this listing and display that event's date
    // in the card
    return (
      <>
        <WhitelistedCard handleSubmitChallenge={this.handleSubmitChallenge} />
        {this.renderSubmitChallengeModal()}
      </>
    );
  }

  private renderSubmitChallengeModal(): JSX.Element {
    if (!this.props.parameters) {
      return <></>;
    }

    const civil = getCivil();
    const approveForChallengeProgressModal = this.renderApproveForChallengeProgressModal();
    const submitChallengeProgressModal = this.renderSubmitChallengeProgressModal();
    const modalContentComponents = {
      [ModalContentEventNames.IN_PROGRESS_APPROVE_FOR_CHALLENGE]: approveForChallengeProgressModal,
      [ModalContentEventNames.IN_PROGRESS_SUBMIT_CHALLENGE]: submitChallengeProgressModal,
    };
    const transactions = [
      {
        transaction: approveForChallenge,
        progressEventName: ModalContentEventNames.IN_PROGRESS_APPROVE_FOR_CHALLENGE,
      },
      {
        transaction: this.challenge,
        progressEventName: ModalContentEventNames.IN_PROGRESS_SUBMIT_CHALLENGE,
      },
    ];
    const constitutionURI = this.props.constitutionURI || "#";
    const minDeposit = getFormattedTokenBalance(civil.toBigNumber(this.props.parameters.minDeposit), true);
    const dispensationPct = `${this.props.parameters.dispensationPct}%`;
    const props: SubmitChallengeModalProps = {
      open: this.state.isChallengeModalOpen,
      constitutionURI,
      minDeposit,
      dispensationPct,
      modalContentComponents,
      transactions,
      updateStatementValue: this.updateChallengeStatement,
      updateStatementSummaryValue: this.updateChallengeSummaryStatement,
      postExecuteTransactions: this.closeSubmitChallengeModal,
      handleClose: this.closeSubmitChallengeModal,
    };
    return <SubmitChallengeModal {...props} />;
  }

  private renderRejected(): JSX.Element {
    const RejectedCard = compose<React.ComponentClass<ListingContainerProps & {}>>(
      connectLatestChallengeSucceededResults,
    )(RejectedCardComponent);

    return <RejectedCard listingAddress={this.props.listing.address} />;
  }

  private renderApproveForChallengeProgressModal(): JSX.Element {
    return (
      <>
        <LoadingIndicator height={100} />
        <ModalHeading>Transactions in progress</ModalHeading>
        <ModalOrderedList>
          <ModalListItem type={ModalListItemTypes.STRONG}>Approving For Challenge</ModalListItem>
          <ModalListItem type={ModalListItemTypes.FADED}>Submitting Challenge</ModalListItem>
        </ModalOrderedList>
        <ModalContent>This can take 1-3 minutes. Please don't close the tab.</ModalContent>
        <ModalContent>How about taking a little breather and standing for a bit? Maybe even stretching?</ModalContent>
      </>
    );
  }

  private renderSubmitChallengeProgressModal(): JSX.Element {
    return (
      <>
        <LoadingIndicator height={100} />
        <ModalHeading>Transactions in progress</ModalHeading>
        <ModalOrderedList>
          <ModalListItem>Approving For Challenge</ModalListItem>
          <ModalListItem type={ModalListItemTypes.STRONG}>Submitting Challenge</ModalListItem>
        </ModalOrderedList>
        <ModalContent>This can take 1-3 minutes. Please don't close the tab.</ModalContent>
        <ModalContent>How about taking a little breather and standing for a bit? Maybe even stretching?</ModalContent>
      </>
    );
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

    return (
      <>
        <InApplicationCard
          endTime={endTime}
          phaseLength={phaseLength}
          handleSubmitChallenge={this.handleSubmitChallenge}
        />
        {this.renderSubmitChallengeModal()}
      </>
    );
  }

  private closeSubmitChallengeModal = () => {
    this.setState({ isChallengeModalOpen: false });
  };

  private handleSubmitChallenge = () => {
    this.setState({ isChallengeModalOpen: true });
  };

  private updateChallengeStatement = (value: any) => {
    this.setState(() => ({ challengeStatement: value }));
  };

  private updateChallengeSummaryStatement = (value: any) => {
    this.setState(() => ({ challengeSummaryStatement: value }));
  };

  // Transactions
  private challenge = async (): Promise<TwoStepEthTransaction<any>> => {
    const statement = this.state.challengeStatement.toString("html");
    const summary = this.state.challengeSummaryStatement;
    const jsonToSave = { statement, summary };
    return challengeListing(this.props.listing.address, JSON.stringify(jsonToSave));
  };

  private update = async (): Promise<TwoStepEthTransaction<any>> => {
    return updateStatus(this.props.listing.address);
  };
}

export default ListingPhaseActions;
