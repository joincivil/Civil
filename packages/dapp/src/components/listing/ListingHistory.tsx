import { List } from "immutable";
import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { State } from "../../reducers";
import { getListingHistory } from "../../selectors";
import ListingEvent from "./ListingEvent";
import { ListingTabHeading } from "./styledComponents";
import gql from "graphql-tag";
import { Query } from "react-apollo";

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

interface Data {
  governanceEvents: {
    governanceEventType: string;
    creationData: string;
    metadata: MetaData[];
  } | null;
}

interface MetaData {
  key: string;
  value: string;
}

interface Variables {
  addr: string;
}

class MyQuery extends Query<Data, Variables> {}

const Thingy = (addr: string) => {
  return (
    <MyQuery query={LISTING_QUERY} variables={{ addr }}>
      {(thingy: any): JSX.Element => {
        if (thingy.loading) {
          return <span />;
        } else if (thingy.error) {
          return <span />;
        }
        thingy.data.governanceEvents.map((event: any) => {
          console.log("event: ", event);
        });
        return <>waddup</>;
      }}
    </MyQuery>
  );
};

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
        <Query query={LISTING_QUERY} variables={{ addr: this.props.listingAddress }}>
          {({ loading, error, data }: { loading: any; error: any; data: any }) => {
            if (loading) {
              return;
            } else if (error) {
              return;
            }
            data.governanceEvents.map((event: any) => {
              console.log("event: ", event);
            });
            return <>waddup</>;
          }}
          {/*this.props.listingHistory.map((e, i) => {
            return <ListingEvent key={i} event={e} listing={this.props.listingAddress} />;
          })*/}
        </Query>
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
