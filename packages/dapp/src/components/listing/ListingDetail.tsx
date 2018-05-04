import * as React from "react";
import styled from "styled-components";
import { approveForChallenge, challengeListing, grantAppeal, updateStatus } from "../../apis/civilTCR";
import {
  canListingBeChallenged,
  canBeWhitelisted,
  canRequestAppeal,
  EthAddress,
  isAwaitingAppealJudgment,
  isChallengeInCommitStage,
  isChallengeInRevealStage,
  ListingWrapper,
  TwoStepEthTransaction,
} from "@joincivil/core";
import { DepositTokens } from "./OwnerListingViews";
import ChallengeDetail from "./ChallengeDetail";
import TransactionButton from "../utility/TransactionButton";

const StyledDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%
  color: black;
`;

export interface ListingDetailProps {
  listing: ListingWrapper;
  userAccount?: EthAddress;
}

class ListingDetail extends React.Component<ListingDetailProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    const challenge = this.props.listing.data.challenge;
    const canBeChallenged = canListingBeChallenged(this.props.listing.data);
    const canWhitelist = canBeWhitelisted(this.props.listing.data);
    const canResolveChallenge =
      challenge &&
      !isChallengeInCommitStage(challenge) &&
      !isChallengeInRevealStage(challenge) &&
      !canRequestAppeal(challenge) &&
      !challenge.appeal;
    const isOwnerViewingListing = this.props.listing.data.owner === this.props.userAccount;
    return (
      <StyledDiv>
        {this.props.listing.data && (
          <>
            Is Whitelisted: {this.props.listing.data.isWhitelisted}
            <br />
            Owner: {this.props.listing.data.owner}
            <br />
            Unstaked Deposit: {this.props.listing.data.unstakedDeposit.toString()}
            <br />
            {isOwnerViewingListing && this.renderOwnerListingActionsView()}
            {canBeChallenged && this.renderCanBeChallenged()}
            {isAwaitingAppealJudgment(this.props.listing.data) && this.renderGrantAppeal()}
            {canWhitelist && this.renderCanWhitelist()}
            {canResolveChallenge && this.renderCanResolve()}
            <br />
            {this.props.listing.data.challenge && (
              <ChallengeDetail
                challengeID={this.props.listing.data.challengeID}
                challenge={this.props.listing.data.challenge}
                listingAddress={this.props.listing.address}
              />
            )}
          </>
        )}
      </StyledDiv>
    );
  }

  private renderCanWhitelist = (): JSX.Element => {
    return <TransactionButton transactions={[{ transaction: this.update }]}>Whitelist Application</TransactionButton>;
  };

  private renderGrantAppeal = (): JSX.Element => {
    // @TODO: Only render this JSX element if the user is in the JEC multisig
    return <TransactionButton transactions={[{ transaction: this.grantAppeal }]}>Grant Appeal</TransactionButton>;
  };

  private renderOwnerListingActionsView = (): JSX.Element => {
    return (
      <>
        <DepositTokens listingAddress={this.props.listing.address} />
      </>
    );
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
}

export default ListingDetail;
