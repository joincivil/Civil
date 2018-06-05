import * as React from "react";
import { List } from "immutable";
import { Subscription } from "rxjs";
import { State } from "../../reducers";
import ListingEvent from "./ListingEvent";
import { getTCR } from "../../helpers/civilInstance";
import { ViewModule, ViewModuleHeader } from "../utility/ViewModules";
import { connect, DispatchProp } from "react-redux";
import { addHistoryEvent } from "../../actionCreators/listings";

export interface ListingHistoryProps {
  listing: string;
}

export interface ListingHistoryReduxProps {
  listingHistory: List<any>;
  listing: string;
}

export interface ListingHistoryState {
  error: undefined | string;
  compositeSubscription: Subscription;
}

class ListingHistory extends React.Component<DispatchProp<any> & ListingHistoryReduxProps, ListingHistoryState> {
  constructor(props: DispatchProp<any> & ListingHistoryReduxProps) {
    super(props);
    this.state = {
      compositeSubscription: new Subscription(),
      error: undefined,
    };
  }

  public async componentDidMount(): Promise<void> {
    return this.initHistory();
  }

  public componentWillUnmount(): void {
    this.state.compositeSubscription.unsubscribe();
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

  private handleSubscriptionReturn = async (event: any) => {
    const timestamp = await event.timestamp();
    this.props.dispatch!(addHistoryEvent(this.props.listing, { ...event, timestamp }));
  };

  // TODO(nickreynolds): move this all into redux
  private initHistory = async () => {
    const tcr = getTCR();

    if (tcr) {
      const listingHelper = tcr.getListing(this.props.listing);
      const lastBlock = this.props.listingHistory.size ? this.props.listingHistory.last().blockNumber : 0;
      const subscription = listingHelper
        .compositeObservables(lastBlock + 1) // +1 so that you dont get the last event again
        .subscribe(this.handleSubscriptionReturn);
      this.setState({ compositeSubscription: subscription });
    }
  };
}

const mapToStateToProps = (state: State, ownProps: ListingHistoryProps): ListingHistoryReduxProps => {
  const { histories } = state;
  return {
    ...ownProps,
    listingHistory: histories.get(ownProps.listing) || List(),
  };
};

export default connect(mapToStateToProps)(ListingHistory);
