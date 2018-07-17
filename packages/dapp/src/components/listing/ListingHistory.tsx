import { List } from "immutable";
import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { setupListingHistorySubscription } from "../../actionCreators/listings";
import { State } from "../../reducers";
import ListingEvent from "./ListingEvent";
import { ListingTabHeading } from "./styledComponents";

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
    this.props.dispatch!(await setupListingHistorySubscription(this.props.listing));
  }

  public render(): JSX.Element {
    return (
      <>
        <ListingTabHeading>Listing History</ListingTabHeading>
        {this.props.listingHistory.map((e, i) => {
          return <ListingEvent key={i} event={e} listing={this.props.listing} />;
        })}
      </>
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
