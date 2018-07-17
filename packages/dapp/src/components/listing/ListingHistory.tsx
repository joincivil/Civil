import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { List } from "immutable";
import { Heading } from "@joincivil/components";
import { State } from "../../reducers";
import ListingEvent from "./ListingEvent";
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

const ListingHistoryHeading = Heading.withComponent("div").extend`
  font-size: 32px;
  line-height: 34px;
  margin: 40px 0;
`;

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
      <>
        <ListingHistoryHeading>Listing History</ListingHistoryHeading>
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
