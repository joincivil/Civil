import * as React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import { ErrorIcon } from "./icons";
import { LoadingMessage } from "./LoadingMessage";

export interface ChannelData {
  id: string;
  currentUserIsAdmin: boolean;
  isStripeConnected: boolean;
}

export interface WithNewsroomChannelOuterProps {
  newsroomAddress: string;
}

export interface WithNewsroomChannelInjectedProps {
  newsroomAddress: string;
  channelData: ChannelData;
}

export const CHANNEL_BY_NEWSROOM_QUERY = gql`
  query Channel($contractAddress: String!) {
    channelsGetByNewsroomAddress(contractAddress: $contractAddress) {
      id
      currentUserIsAdmin
      isStripeConnected
    }
  }
`;

/** Usage: The component returned by this HOC will require the `newsroomAddress` prop and will pass `channelData` to the wrapped component, or instead will show loading or error states as necessary. */
export const withNewsroomChannel = <TOriginalProps extends {}>(
  WrappedComponent: React.ComponentType<TOriginalProps & WithNewsroomChannelInjectedProps>,
) => {
  return class ComponentWithNewsroomChannel extends React.Component<WithNewsroomChannelOuterProps & TOriginalProps> {
    public render(): JSX.Element {
      console.log("rendering HOC", this.props.newsroomAddress);
      return (
        <Query query={CHANNEL_BY_NEWSROOM_QUERY} variables={{ contractAddress: this.props.newsroomAddress }}>
          {({ loading, error, data }) => {
            if (loading) {
              return <LoadingMessage>Connecting to Stripe</LoadingMessage>;
            } else if (error || !data || !data.channelsGetByNewsroomAddress) {
              console.error(
                "error loading channel data for",
                this.props.newsroomAddress,
                " error:",
                error,
                "data:",
                data,
              );
              return (
                <>
                  <ErrorIcon width={16} height={16} /> Sorry, there was an error loading your newsroom's Stripe account
                  details. Please try again later.
                </>
              );
            }

            return <WrappedComponent channelData={data.channelsGetByNewsroomAddress} {...this.props} />;
          }}
        </Query>
      );
    }
  };
};
