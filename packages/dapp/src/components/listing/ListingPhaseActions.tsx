import * as React from "react";
import { approveForChallenge, challengeListing, grantAppeal, updateStatus } from "../../apis/civilTCR";
import {
  // canListingBeChallenged,
  canBeWhitelisted,
  canResolveChallenge,
  isAwaitingAppealJudgment,
  isInApplicationPhase,
  ListingWrapper,
  TwoStepEthTransaction,
} from "@joincivil/core";
import ChallengeDetailContainer, { ChallengeResolve } from "./ChallengeDetail";
import { TransactionButton, InApplicationCard, WhitelistedCard, RejectedCard } from "@joincivil/components";

export interface ListingPhaseActionsProps {
  listing: ListingWrapper;
  expiry?: number;
  parameters: any;
  govtParameters: any;
}

class ListingPhaseActions extends React.Component<ListingPhaseActionsProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    const listing = this.props.listing;
    let isInApplication = false;
    if (listing) {
      isInApplication = isInApplicationPhase(listing!.data);
    }
    const challenge = this.props.listing.data.challenge;
    // const canBeChallenged = canListingBeChallenged(this.props.listing.data);
    const isWhitelisted = listing!.data.isWhitelisted;
    const canWhitelist = canBeWhitelisted(this.props.listing.data);
    const canResolve = canResolveChallenge(challenge!);
    return (
      <>
        {isWhitelisted && !challenge && this.renderApplicationWhitelisted()}
        {!isWhitelisted && !isInApplication && !challenge && this.renderRejected()}
        {isInApplication && this.renderApplicationPhase()}
        {this.props.listing.data && (
          <>
            {isAwaitingAppealJudgment(this.props.listing.data) && this.renderGrantAppeal()}
            {canWhitelist && this.renderCanWhitelist()}
            {canResolve && this.renderCanResolve()}

            {this.props.listing.data.challenge && (
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

  // @TODO(jon): We don't have a card for this phase yet (Application phase ended w/ no challenges), so create one and implement here.
  private renderCanWhitelist = (): JSX.Element => {
    return <TransactionButton transactions={[{ transaction: this.update }]}>Whitelist Application</TransactionButton>;
  };

  private renderGrantAppeal = (): JSX.Element => {
    // @TODO: Only render this JSX element if the user is in the JEC multisig
    return <TransactionButton transactions={[{ transaction: this.grantAppeal }]}>Grant Appeal</TransactionButton>;
  };

  private update = async (): Promise<TwoStepEthTransaction<any>> => {
    return updateStatus(this.props.listing.address);
  };

  private renderCanResolve(): JSX.Element {
    const transactions = [{ transaction: this.resolve }];
    return (
      <ChallengeResolve
        listingAddress={this.props.listing.address}
        challengeID={this.props.listing.data.challengeID}
        transactions={transactions}
      />
    );
  }

  private renderApplicationWhitelisted(): JSX.Element {
    // @TODO(jon): Get the Whitelisted event for this listing and display that event's date
    // in the card
    const transactions = [{ transaction: approveForChallenge }, { transaction: this.challenge }];
    return <WhitelistedCard transactions={transactions} />;
  }

  private renderRejected(): JSX.Element {
    // @TODO(jon): Get the Rejected DateTime and Challenge Results for the challenge
    // that resulted in the listing being rejected to display for this card. We should
    // probably create a Container component that fetches that data and stores it in Redux,
    // and then the container should render this RejectedCard.
    // For now, these are hard-coded values so the card renders in the UI when the listing
    // state is Rejected
    return (
      <RejectedCard
        totalVotes={"100000"}
        votesFor={"73000"}
        votesAgainst={"27000"}
        percentFor={"73"}
        percentAgainst={"27"}
      />
    );
  }

  private renderApplicationPhase(): JSX.Element | null {
    const endTime = this.props.listing!.data.appExpiry.toNumber();
    const phaseLength = this.props.parameters.applyStageLen;
    const transactions = [{ transaction: approveForChallenge }, { transaction: this.challenge }];

    if (!endTime || !phaseLength) {
      return null;
    }

    return <InApplicationCard endTime={endTime} phaseLength={phaseLength} transactions={transactions} />;
  }

  // Transactions
  private resolve = async (): Promise<TwoStepEthTransaction<any>> => {
    return updateStatus(this.props.listing.address);
  };

  private challenge = async (): Promise<TwoStepEthTransaction<any>> => {
    return challengeListing(this.props.listing.address);
  };
  private grantAppeal = async (): Promise<TwoStepEthTransaction<any>> => {
    return grantAppeal(this.props.listing.address);
  };
}

export default ListingPhaseActions;
