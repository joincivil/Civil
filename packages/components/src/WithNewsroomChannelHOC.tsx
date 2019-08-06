import * as React from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";

import { ErrorIcon } from "./icons";
import { LoadingMessage } from "./LoadingMessage";

export interface NewsroomChannelData {
  id: string;
  currentUserIsAdmin: boolean;
  isStripeConnected: boolean;
}

export interface WithNewsroomChannelOuterProps {
  newsroomAddress: string;
}

export interface NewsroomChannelInjectedProps {
  newsroomAddress: string;
  channelData: NewsroomChannelData;
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
export const CREATE_NEWSROOM_CHANNEL_MUTATION = gql`
  mutation($newsroomContractAddress: String!) {
    channelsCreateNewsroomChannel(newsroomContractAddress: $newsroomContractAddress) {
      id
      currentUserIsAdmin
    }
  }
`;

/** Usage: The component returned by this HOC will require the `newsroomAddress` prop and will pass `channelData` to the wrapped component, or instead will show loading or error states as necessary. If the newsroom channel does not yet exist, it will attempt to create it. */
export const withNewsroomChannel = <TOriginalProps extends {}>(
  WrappedComponent: React.ComponentType<TOriginalProps & NewsroomChannelInjectedProps>,
) => {
  return class ComponentWithNewsroomChannel extends React.Component<WithNewsroomChannelOuterProps & TOriginalProps> {
    public render(): JSX.Element {
      return (
        <Query query={CHANNEL_BY_NEWSROOM_QUERY} variables={{ contractAddress: this.props.newsroomAddress }}>
          {({ loading, error, data }) => {
            if (loading) {
              return <LoadingMessage>Loading</LoadingMessage>;
            } else if (error && error.message.indexOf("record not found") !== -1) {
              return this.renderNoChannel();
            } else if (error || !data || !data.channelsGetByNewsroomAddress) {
              console.error(
                "error loading channel data for",
                this.props.newsroomAddress,
                " error:",
                error,
                "data:",
                data,
              );
              return this.renderError(
                "Sorry, there was an error loading your newsroom information. Please try again later.",
              );
            }

            return <WrappedComponent channelData={data.channelsGetByNewsroomAddress} {...this.props} />;
          }}
        </Query>
      );
    }

    public renderNoChannel(): JSX.Element {
      return (
        <Mutation
          mutation={CREATE_NEWSROOM_CHANNEL_MUTATION}
          variables={{ newsroomContractAddress: this.props.newsroomAddress }}
          refetchQueries={[
            { query: CHANNEL_BY_NEWSROOM_QUERY, variables: { contractAddress: this.props.newsroomAddress } },
          ]}
        >
          {(createChannel, { data, error, called }) => {
            if (!called && !error) {
              console.warn("Channel doesn't exist for newsroom", this.props.newsroomAddress, "attempting to create...");
              createChannel().catch(() => {});
            }
            if (error || !data || !data.channelsCreateNewsroomChannel) {
              console.error("Error creating new channel for newsroom with channelsCreateNewsroomChannel", error, data);
              return this.renderError(
                "Sorry, there was an error initializing your newsroom information. Please try again later.",
              );
            }
            if (!data.channelsCreateNewsroomChannel.currentUserIsAdmin) {
              console.error(
                "Error using channelsCreateNewsroomChannel, created channel doesn't have user as admin",
                data,
              );
              return this.renderError(
                "Sorry, there was an error assigning admin rights to your newsroom. Please try again later.",
              );
            }

            return <LoadingMessage>Loading</LoadingMessage>;
          }}
        </Mutation>
      );
    }

    public renderError(message: string): JSX.Element {
      return (
        <>
          <ErrorIcon width={16} height={16} /> {message}
        </>
      );
    }
  };
};
