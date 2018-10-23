import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { State } from "../../redux/reducers";
import ListingListItemApolloContainerComponent from "./ListingListItemApolloContainer";
import ListingListItemReduxContainer from "./ListingListItemReduxContainer";

export interface ListingListItemContainerOwnProps {
  listingAddress: string;
  even: boolean;
  ListingItemComponent?: any;
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
      return (
        <ListingListItemApolloContainerComponent
          listingAddress={listingAddress}
          even={this.props.even}
          ListingItemComponent={this.props.ListingItemComponent}
        />
      );
    } else {
      return (
        <ListingListItemReduxContainer
          listingAddress={listingAddress}
          even={this.props.even}
          ListingItemComponent={this.props.ListingItemComponent}
        />
      );
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
