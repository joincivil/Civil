import * as React from "react";
import styled from "styled-components";
import { Query } from "react-apollo";
import { Set } from "immutable";
import { EthAddress } from "@joincivil/core";
import { LoadingMessage } from "@joincivil/components";
import gql from "graphql-tag";
import { LISTING_FRAGMENT } from "../../../helpers/queryTransformations";

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
          listing {
            ...ListingFragment
          }
        }
      }
    }
  }
  ${LISTING_FRAGMENT}
`;

export interface WithNewsroomChannelAdminListProps {
  channelType?: string;
  children(props: { newsrooms: Set<any> }): any;
}

export function newsroomChannelsFromQueryData(data?: any): any[] {
  if (data && data.currentUser && data.currentUser.channels && data.currentUser.channels.filter) {
    return data.currentUser.channels
      .filter(
        (memberChannel: any) => memberChannel.role === "admin" && memberChannel.channel.channelType === "newsroom",
      )
      .map((memberChannel: any) => memberChannel.channel);
  } else {
    return [];
  }
}

export default (props: WithNewsroomChannelAdminListProps) => {
  return (
    <Query query={newsroomChannelAdminQuery}>
      {({ loading, error, data }) => {
        if (loading) {
          return <LoadingMessage />;
        }
        if (error) {
          console.error("Error loading current user channels:", error);
        }

        const newsrooms = newsroomChannelsFromQueryData(data);
        return props.children({ newsrooms: Set(newsrooms) });
      }}
    </Query>
  );
};
