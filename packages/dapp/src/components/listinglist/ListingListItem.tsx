import * as React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { State } from "../../reducers";
import { ListingWrapper, NewsroomWrapper, WrappedChallengeData } from "@joincivil/core";
import ListingListItemDescription from "./ListingListItemDescription";
import ListingListItemOwner from "./ListingListItemOwner";
import ListingListItemStatus from "./ListingListItemStatus";
import ListingListItemAction from "./ListingListItemAction";

export interface ListingListItemDivProps {
  even: boolean;
}

const StyledDiv = styled.div`
  display: flex;
  height: 184px;
  width: 100%;
  padding: 15px;
  background-color: ${(props: ListingListItemDivProps): string => (props.even ? "#F4F6FF" : "#FFFFFF")};
`;

export interface ListingListItemOwnProps {
  listingAddress?: string;
  challengeID?: string;
  even: boolean;
}

export interface ListingListItemReduxProps {
  newsroom: NewsroomWrapper | undefined;
  listing: ListingWrapper | undefined;
  challenge?: WrappedChallengeData;
}

class ListingListItem extends React.Component<ListingListItemOwnProps & ListingListItemReduxProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <StyledDiv even={this.props.even}>
        <ListingListItemDescription listing={this.props.listing!} newsroom={this.props.newsroom!} />
        <ListingListItemOwner newsroom={this.props.newsroom!} />
        <ListingListItemStatus listing={this.props.listing!} challenge={this.props.challenge} />
        <ListingListItemAction listing={this.props.listing!} challenge={this.props.challenge} />
      </StyledDiv>
    );
  }
}

const mapStateToProps = (
  state: State,
  ownProps: ListingListItemOwnProps,
): ListingListItemReduxProps & ListingListItemOwnProps => {
  const { newsrooms, listings, challenges } = state;
  let listingAddress = ownProps.listingAddress;
  let challenge;
  if (!listingAddress && ownProps.challengeID) {
    challenge = challenges.get(ownProps.challengeID);
    listingAddress = challenges.get(ownProps.challengeID)!.listingAddress;
  }
  return {
    newsroom: newsrooms.get(listingAddress!),
    listing: listings.get(listingAddress!) ? listings.get(listingAddress!).listing : undefined,
    challenge,
    ...ownProps,
  };
};

export default connect(mapStateToProps)(ListingListItem);
