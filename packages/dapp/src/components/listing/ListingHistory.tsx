import * as React from "react";
import ListingEvent from "./ListingEvent";
import { ListingTabHeading } from "./styledComponents";

import { Query } from "react-apollo";
import gql from "graphql-tag";

export interface ListingHistoryProps {
  listingAddress: string;
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

class ListingHistory extends React.Component<ListingHistoryProps, ListingHistoryState> {
  constructor(props: ListingHistoryProps) {
    super(props);
    this.state = {
      error: undefined,
    };
  }

  public render(): JSX.Element {
    return (
      <>
        <ListingTabHeading>Listing History</ListingTabHeading>
        {this.renderGraphQLHistory()}
      </>
    );
  }

  public renderGraphQLHistory(): JSX.Element {
    return (
      <Query query={LISTING_QUERY} variables={{ addr: this.props.listingAddress }}>
        {({ loading, error, data }: any): JSX.Element => {
          if (loading) {
            return <p>Loading...</p>;
          }
          if (error) {
            return <p>Error :(</p>;
          }

          return data.governanceEvents
            .slice()
            .reverse()
            .map((event: any, i: number) => {
              return (
                <ListingEvent key={i} event={this.transformGraphQlEvent(event)} listing={this.props.listingAddress} />
              );
            });
        }}
      </Query>
    );
  }

  public transformGraphQlEvent = (event: any): any => {
    const args = {};
    event.metadata.forEach((data: any) => {
      const key = data.key.charAt(0).toLowerCase() + data.key.substring(1);
      args[key] = data.value;
    });
    const date = new Date(event.creationDate).getTime() / 1000;
    return {
      event: "_" + event.governanceEventType,
      timestamp: date * 1000,
      args,
    };
  };
}

export default ListingHistory;
