import * as React from "react";
import styled from "styled-components";
import { Query } from "react-apollo";
import { Set } from "immutable";
import { EthAddress } from "@joincivil/core";
import { LoadingMessage } from "@joincivil/components";
import gql from "graphql-tag";

const newsroomChannelAdminQuery = gql`
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
        let newsroomAddresses = [];
        if (data && data.currentUser && data.currentUser.channels) {
          newsroomAddresses = data.currentUser.channels
            .filter((channelMember: any) => channelMember.channel.channelType === "newsroom")
            .map((channelMember: any) => channelMember.channel.newsroom.contractAddress);
        }

        return props.children({ newsroomAddresses: Set(newsroomAddresses) });
      }}
    </Query>
  );
};
