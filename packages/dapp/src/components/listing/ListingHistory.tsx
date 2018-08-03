import { List } from "immutable";
import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { State } from "../../reducers";
import { getListingHistory } from "../../selectors";
import ListingEvent from "./ListingEvent";
import { ListingTabHeading } from "./styledComponents";

export interface ListingHistoryProps {
  listingAddress: string;
}

export interface ListingHistoryReduxProps extends ListingHistoryProps {
  listingHistory: List<any>;
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

  public render(): JSX.Element {
    return (
      <>
        <ListingTabHeading>Listing History</ListingTabHeading>
        {this.props.listingHistory.map((e, i) => {
          return <ListingEvent key={i} event={e} listing={this.props.listingAddress} />;
        })}
      </>
    );
  }
}

const mapToStateToProps = (state: State, ownProps: ListingHistoryProps): ListingHistoryReduxProps => {
  return {
    ...ownProps,
    listingHistory: getListingHistory(state, ownProps),
  };
};

export default connect(mapToStateToProps)(ListingHistory);
