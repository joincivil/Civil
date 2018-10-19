import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { State } from "../../reducers";
import ListingListItemApolloContainerComponent from "./ListingListItemApolloContainer";
import ListingListItemReduxContainer from "./ListingListItemReduxContainer";

export interface ListingListItemContainerOwnProps {
  listingAddress: string;
  even: boolean;
}

export interface ListingListItemContainerReduxProps {
  useGraphQL: boolean;
}

class ListingListItemContainerComponent extends React.Component<
  ListingListItemContainerReduxProps & ListingListItemContainerOwnProps & DispatchProp<any>
> {
  public render(): JSX.Element {
    const listingAddress = this.props.listingAddress;
    if (this.props.useGraphQL) {
      return <ListingListItemApolloContainerComponent listingAddress={listingAddress} even={this.props.even} />;
    } else {
      return <ListingListItemReduxContainer listingAddress={listingAddress} even={this.props.even} />;
    }
  }
}

const mapStateToProps = (
  state: State,
  ownProps: ListingListItemContainerOwnProps,
): ListingListItemContainerReduxProps & ListingListItemContainerOwnProps => {
  return {
    ...ownProps,
    useGraphQL: state.useGraphQL,
  };
};

export const ListingListItemContainer = connect(mapStateToProps)(ListingListItemContainerComponent);
