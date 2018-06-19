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
import {
  TransactionButton,
  InApplicationCard,
  // ChallengeCommitVoteCard,
  // ChallengeRevealVoteCard,
  // ChallengeRequestAppealCard,
  // ChallengeResolveCard,
  // AppealAwaitingDecisionCard,
  // AppealDecisionCard,
  // AppealChallengeCommitVoteCard,
  // AppealChallengeRevealVoteCard,
  WhitelistedCard,
  RejectedCard,
} from "@joincivil/components";

export interface ListingPhaseActionsProps {
  listing: ListingWrapper;
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
        {!isWhitelisted && !isInApplication && this.renderRejected()}
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
                parameters={this.props.parameters}
                govtParameters={this.props.govtParameters}
              />
            )}
          </>
        )}
      </>
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

  private renderCanResolve(): JSX.Element {
    const transactions = [{ transaction: this.resolve }];
    return (
      <ChallengeResolve
        listingAddress={this.props.listing.address}
        challengeID={this.props.listing.data.challengeID}
        transactions={transactions}
        parameters={this.props.parameters}
        govtParameters={this.props.govtParameters}
      />
    );
  }

  private renderApplicationWhitelisted(): JSX.Element {
    const transactions = [{ transaction: approveForChallenge }, { transaction: this.challenge }];
    return <WhitelistedCard transactions={transactions} />;
  }

  private renderRejected(): JSX.Element {
    return (
      <RejectedCard
        totalVotes={"100000"}
        votesFor={"27000"}
        votesAgainst={"73000"}
        percentFor={"27"}
        percentAgainst={"73"}
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
