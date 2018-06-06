import * as React from "react";
import { approveForChallenge, challengeListing, grantAppeal, updateStatus } from "../../apis/civilTCR";
import {
  canListingBeChallenged,
  canBeWhitelisted,
  canResolveChallenge,
  isAwaitingAppealJudgment,
  isInApplicationPhase,
  ListingWrapper,
  TwoStepEthTransaction,
} from "@joincivil/core";
import ChallengeDetailContainer from "./ChallengeDetail";
import { TransactionButton } from "@joincivil/components";
import { ViewModule, ViewModuleHeader } from "../utility/ViewModules";
import CountdownTimer from "../utility/CountdownTimer";

export interface ListingPhaseActionsProps {
  listing: ListingWrapper;
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
    const canBeChallenged = canListingBeChallenged(this.props.listing.data);
    const canWhitelist = canBeWhitelisted(this.props.listing.data);
    const canResolve = canResolveChallenge(challenge!);
    return (
      <ViewModule>
        <ViewModuleHeader>Application Phase</ViewModuleHeader>

        {isInApplication && this.renderApplicationPhase()}
        {this.props.listing.data && (
          <>
            {canBeChallenged && this.renderCanBeChallenged()}
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
      </ViewModule>
    );
  }

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

  private renderCanBeChallenged = (): JSX.Element => {
    return (
      <TransactionButton transactions={[{ transaction: approveForChallenge }, { transaction: this.challenge }]}>
        Challenge Application
      </TransactionButton>
    );
  };

  private renderCanResolve(): JSX.Element {
    return <TransactionButton transactions={[{ transaction: this.resolve }]}>Resolve Challenge</TransactionButton>;
  }
  private resolve = async (): Promise<TwoStepEthTransaction<any>> => {
    return updateStatus(this.props.listing.address);
  };

  private challenge = async (): Promise<TwoStepEthTransaction<any>> => {
    return challengeListing(this.props.listing.address);
  };
  private grantAppeal = async (): Promise<TwoStepEthTransaction<any>> => {
    return grantAppeal(this.props.listing.address);
  };
  private renderApplicationPhase(): JSX.Element {
    return (
      <>
        APPLICATION IN PROGRESS. ends in... <CountdownTimer endTime={this.props.listing!.data.appExpiry.toNumber()} />
      </>
    );
  }
}

export default ListingPhaseActions;
