import * as React from "react";
import { List } from "immutable";

import { connect, DispatchProp } from "react-redux";
import { State } from "../../reducers";
import { getListingHistory } from "../../selectors";
// import ListingEvent from "./ListingEvent";
import { ListingTabHeading } from "./styledComponents";

import { Query } from "react-apollo";
import gql from "graphql-tag";

export interface ListingHistoryProps {
  listingAddress: string;
}

export interface ListingHistoryReduxProps extends ListingHistoryProps {
  listingHistory: List<any>;
}

export interface ListingHistoryState {
  error: undefined | string;
}

const LISTING_QUERY = gql`
  query($addr: String!) {
    governanceEvents(addr: $addr) {
      governanceEventType
      creationDate
      metadata {
        key
        value
      }
    }
  }
`;

export const TestGraphql = (props: any) => (
  <Query query={LISTING_QUERY} variables={{ addr: "0xD51A14a9269E6fED86E95B96B73439226B35C200" }}>
    {(ack: any): JSX.Element => {
      if (ack.loading) {
        return <p>Loading...</p>;
      }
      if (ack.error) {
        return <p>Error :(</p>;
      }

      return ack.data.governanceEvents.map((foo: any) => <div>{JSON.stringify(foo)}</div>);
    }}
  </Query>
);

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
        <TestGraphql />
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
