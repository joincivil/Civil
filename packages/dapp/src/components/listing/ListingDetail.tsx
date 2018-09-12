import * as React from "react";
import { EthAddress, ListingWrapper, NewsroomWrapper } from "@joincivil/core";
import { DepositTokens, ExitListing, WithdrawTokens } from "./OwnerListingViews";
import { ViewModule, ViewModuleHeader } from "../utility/ViewModules";
import { getFormattedTokenBalance } from "@joincivil/utils";
import styled from "styled-components";
import { Button, buttonSizes, colors, fonts } from "@joincivil/components";

const ListingDetailOuter = styled.div`
  background: ${colors.primary.BLACK};
  display: flex;
  justify-content: center;
`;

const ListingDetailHeader = styled.div`
  color: ${colors.basic.WHITE};
  padding: 78px 0 62px;
`;

const ListingDetailNewsroomName = styled.h1`
  font: 200 48px/40px ${fonts.SERIF};
  letter-spacing: -0.19px;
  margin: 0 0 18px;
`;

const ListingDetailNewsroomDek = styled.p`
  font: normal 21px/35px ${fonts.SANS_SERIF};
  margin: 0 0 35px;
`;

const GridRow = styled.div`
  display: flex;
  width: 1200px;
`;
const LeftShark = styled.div`
  width: 695px;
`;
const RightShark = styled.div`
  margin-left: 15px;
  width: 485px;
`;

export interface ListingDetailProps {
  newsroom: NewsroomWrapper;
  listing: ListingWrapper;
  userAccount?: EthAddress;
}

class ListingDetail extends React.Component<ListingDetailProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    // const isOwnerViewingListing = this.props.listing.data.owner === this.props.userAccount;
    return (
      <ListingDetailOuter>
        {this.props.listing.data && (
          <ListingDetailHeader>
            <GridRow>
              <LeftShark>
                <ListingDetailNewsroomName>{this.props.newsroom.data.name}</ListingDetailNewsroomName>
                <ListingDetailNewsroomDek>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. ullamco laboris nisi ut
                  aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                  officia deserunt mollit anim id.
                </ListingDetailNewsroomDek>
                <Button size={buttonSizes.MEDIUM}>Support Our Work</Button>
              </LeftShark>

              <RightShark>
                <dl>
                  <dt>Owner</dt>
                  <dd>{this.props.listing.data.owner}</dd>

                  <dt>Unstaked Deposit</dt>
                  <dd>{getFormattedTokenBalance(this.props.listing.data.unstakedDeposit)}</dd>
                </dl>
              </RightShark>
            </GridRow>
          </ListingDetailHeader>
        )}
      </ListingDetailOuter>
    );
  }

  /*
  private renderOwnerListingActionsView = (): JSX.Element => {
    const canExitListing = this.props.listing.data.isWhitelisted && !this.props.listing.data.challenge;
    return (
      <ViewModule>
        <ViewModuleHeader>Owner Actions</ViewModuleHeader>
        <DepositTokens listing={this.props.listing} listingAddress={this.props.listing.address} />
        <WithdrawTokens listing={this.props.listing} listingAddress={this.props.listing.address} />
        {canExitListing && <ExitListing listingAddress={this.props.listing.address} listing={this.props.listing} />}
      </ViewModule>
    );
  };
  //*/
}

export default ListingDetail;
