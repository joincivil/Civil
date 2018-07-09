import * as React from "react";
import { List } from "immutable";
import { State } from "../../reducers";
import ListingEvent from "./ListingEvent";
import { ViewModule, ViewModuleHeader } from "../utility/ViewModules";
import { connect, DispatchProp } from "react-redux";
import { setupListingHistorySubscription } from "../../actionCreators/listings";

export interface ListingHistoryProps {
  listing: string;
}

export interface ListingHistoryReduxProps {
  listingHistory: List<any>;
  listing: string;
}

export interface ListingHistoryState {
  error: undefined | string;
}

class ListingHistory extends React.Component<DispatchProp<any> & ListingHistoryReduxProps, ListingHistoryState> {
  constructor(props: DispatchProp<any> & ListingHistoryReduxProps) {
    super(props);
    this.state = {
      error: undefined,
    };
  }

  public async componentDidMount(): Promise<void> {
    this.props.dispatch!(setupListingHistorySubscription(this.props.listing));
  }

  public render(): JSX.Element {
    return (
      <ViewModule>
        <ViewModuleHeader>Listing History</ViewModuleHeader>
        {this.props.listingHistory.map((e, i) => {
          return <ListingEvent key={i} event={e} listing={this.props.listing} />;
        })}
      </ViewModule>
    );
  }
}

const mapToStateToProps = (state: State, ownProps: ListingHistoryProps): ListingHistoryReduxProps => {
  const { histories } = state.networkDependent;
  return {
    ...ownProps,
    listingHistory: histories.get(ownProps.listing) || List(),
  };
};

export default connect(mapToStateToProps)(ListingHistory);
