import * as React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { State } from "../../reducers";
import { ListingWrapper, NewsroomWrapper } from "@joincivil/core";
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
  padding: 15px;
  background-color: ${(props: ListingListItemDivProps): string => (props.even ? "#F4F6FF" : "#FFFFFF")};
`;

export interface ListingListItemOwnProps {
  listingAddress: string;
  even: boolean;
}

export interface ListingListItemReduxProps {
  newsroom: NewsroomWrapper | undefined;
  listing: ListingWrapper | undefined;
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
        <ListingListItemStatus listing={this.props.listing!} />
        <ListingListItemAction listing={this.props.listing!} />
      </StyledDiv>
    );
  }
}

const mapStateToProps = (
  state: State,
  ownProps: ListingListItemOwnProps,
): ListingListItemReduxProps & ListingListItemOwnProps => {
  const { newsrooms, listings } = state;

  return {
    newsroom: newsrooms.get(ownProps.listingAddress),
    listing: listings.get(ownProps.listingAddress),
    ...ownProps,
  };
};

export default connect(mapStateToProps)(ListingListItem);
