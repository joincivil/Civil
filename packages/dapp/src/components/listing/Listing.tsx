import * as React from "react";
import styled from "styled-components";

import ListingHistory from "./ListingHistory";
import ListingDetail from "./ListingDetail";
import { EthAddress, isInApplicationPhase, ListingWrapper } from "@joincivil/core";
import CountdownTimer from "../utility/CountdownTimer";
import { State } from "../../reducers";
import { connect, DispatchProp } from "react-redux";

const StyledDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%
  color: black;
`;

export interface ListingPageProps {
  match: any;
}

export interface ListingReduxProps {
  listing: ListingWrapper | undefined;
  userAccount?: EthAddress;
}

class ListingPage extends React.Component<ListingReduxProps & DispatchProp<any> & ListingPageProps> {
  public render(): JSX.Element {
    const listing = this.props.listing;
    let appExists = false;
    let isInApplication = false;
    if (listing) {
      appExists = !listing.data.appExpiry.isZero();
      isInApplication = isInApplicationPhase(listing.data);
    }
    return (
      <StyledDiv>
        {isInApplication && this.renderApplicationPhase()}
        {appExists && <ListingDetail userAccount={this.props.userAccount} listing={this.props.listing!} />}
        {!appExists && this.renderListingNotFound()}
        <ListingHistory match={this.props.match} />
      </StyledDiv>
    );
  }

  private renderApplicationPhase(): JSX.Element {
    return (
      <>
        APPLICATION IN PROGRESS. ends in... <CountdownTimer endTime={this.props.listing!.data.appExpiry.toNumber()} />
      </>
    );
  }

  private renderListingNotFound(): JSX.Element {
    return <>NOT FOUND</>;
  }
}

const mapToStateToProps = (state: State, ownProps: ListingPageProps): ListingReduxProps => {
  const { listings, user } = state;
  return {
    listing: listings.get(ownProps.match.params.listing),
    userAccount: user.account,
  };
};

export default connect(mapToStateToProps)(ListingPage);
