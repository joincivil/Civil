import * as React from "react";
import styled from "styled-components";
import { Query } from "react-apollo";
import { Set } from "immutable";
import { EthAddress } from "@joincivil/core";
import { LoadingMessage } from "@joincivil/components";
import gql from "graphql-tag";

export const newsroomChannelAdminQuery = gql`
  query {
    currentUser {
      uid
      channels {
        role
        channel {
          id
          channelType
          newsroom {
            contractAddress
            name
            charter {
              logoUrl
            }
          }
        }
      }
    }
  }
`;

export interface WithNewsroomChannelAdminListProps {
  channelType?: string;
  children(props: { newsroomAddresses: Set<EthAddress> }): any;
}

export function newsroomChannelsFromQueryData(data?: any): EthAddress[] {
  if (data && data.currentUser && data.currentUser.channels && data.currentUser.channels.filter) {
    return data.currentUser.channels
      .filter(
        (memberChannel: any) => memberChannel.role === "admin" && memberChannel.channel.channelType === "newsroom",
      )
      .map((memberChannel: any) => memberChannel.channel.newsroom.contractAddress);
  } else {
    return [];
  }
}

export default (props: WithNewsroomChannelAdminListProps) => {
  return (
    <Query query={newsroomChannelAdminQuery}>
      {({ error, loading, data }) => {
        if (loading) {
          return <LoadingMessage />;
        }
        if (error) {
          console.error("Error loading current user channels:", error);
        }

        const newsroomAddresses = newsroomChannelsFromQueryData(data);
        return props.children({ newsroomAddresses: Set(newsroomAddresses) });
      }}
    </Query>
  );
};
