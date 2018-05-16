import * as React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { State } from "../reducers";
import { ListingWrapper, NewsroomWrapper } from "@joincivil/core";

export interface ListingListItemOwnProps {
  listingAddress: string;
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
    let address = "";
    if (this.props.listing) {
      address = this.props.listing.address;
    }
    let name = "";
    if (this.props.newsroom && this.props.newsroom.data) {
      name = this.props.newsroom.data.name;
    }
    const link = "/listing/" + address;
    return (
      <Link to={link}>{name} - {address}</Link>
    );
  }
}

const mapStateToProps = (state: State, ownProps: ListingListItemOwnProps): ListingListItemReduxProps & ListingListItemOwnProps => {
  const {
    newsrooms,
    listings
  } = state;

  return {
    newsroom: newsrooms.get(ownProps.listingAddress),
    listing: listings.get(ownProps.listingAddress),
    listingAddress: ownProps.listingAddress!
  };
};

export default connect(mapStateToProps)(ListingListItem);
