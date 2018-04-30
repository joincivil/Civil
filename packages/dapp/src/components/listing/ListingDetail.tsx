import * as React from "react";
import styled from "styled-components";
import { approveForChallenge, challengeListing, grantAppeal, updateListing } from "../../apis/civilTCR";
import { canListingBeChallenged, canBeWhitelisted, isAwaitingAppealJudgment, ListingWrapper, TwoStepEthTransaction } from "@joincivil/core";
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
}

class ListingDetail extends React.Component<ListingDetailProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    const canBeChallenged = canListingBeChallenged(this.props.listing.data);
    const canWhitelist = canBeWhitelisted(this.props.listing.data);
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
            {canBeChallenged && this.renderCanBeChallenged()}
            {isAwaitingAppealJudgment(this.props.listing.data) && this.props.listing.data.challenge!.appeal && this.renderGrantAppeal()}
            {canWhitelist && this.renderCanWhitelist()}
            <br />
            {this.props.listing.data.challenge && (
              <>
                <ChallengeDetail
                  challengeID={this.props.listing.data.challengeID}
                  challenge={this.props.listing.data.challenge}
                  listingAddress={this.props.listing.address}
                />
              </>
            )}
          </>
        )}
      </StyledDiv>
    );
  }

  private renderCanWhitelist = (): JSX.Element => {
    return <TransactionButton firstTransaction={this.update}>Whitelist Application</TransactionButton>;
  };

  private renderGrantAppeal = (): JSX.Element => {
    return <TransactionButton firstTransaction={this.grantAppeal}>Grant Appeal</TransactionButton>;
  };

  private update = async (): Promise<TwoStepEthTransaction<any>> => {
    return updateListing(this.props.listing.address);
  };

  private renderCanBeChallenged = (): JSX.Element => {
    return (
      <TransactionButton firstTransaction={approveForChallenge} secondTransaction={this.challenge}>
        Challenge Application
      </TransactionButton>
    );
  };

  private challenge = async (): Promise<TwoStepEthTransaction<any>> => {
    return challengeListing(this.props.listing.address);
  };
  private grantAppeal = async (): Promise<TwoStepEthTransaction<any>> => {
    return grantAppeal(this.props.listing.address);
  };
}

export default ListingDetail;
