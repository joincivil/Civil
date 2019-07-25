import * as React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Query } from "react-apollo";
import { colors, Button, buttonSizes } from "@joincivil/components";
import gql from "graphql-tag";

const channelMemberQuery = gql`
  query {
    currentUser {
      uid
      channels {
        role
        channel {
          id
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

const ChannelListItem = styled.div`
  padding: 5px 10px;
  display: flex;
  flex-direction: row;
  a:first-child {
    flex-grow: 1;
    color: ${colors.accent.CIVIL_GRAY_1};
    font-size: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  a > img {
    height: 30px;
    width: 30px;
    margin: 4px;
  }
`;

export const ChannelAdminList = (props: any) => {
  if (props.channels && props.channels.length === 0) {
    return null;
  }
  return (
    <Query query={channelMemberQuery}>
      {({ error, loading, data }) => {
        if (error) {
          return <div>error...</div>;
        }
        if (loading) {
          return <></>;
        }
        return data.currentUser.channels.map((channelMember: any) => {
          const link = `/admin/${channelMember.channel.id}`;
          const newsroom = channelMember.channel.newsroom;
          return (
            <ChannelListItem key={channelMember.channel.id}>
              <Link to={link}>
                <img src={channelMember.channel.newsroom.charter.logoUrl} />
                {newsroom.name}
              </Link>
              <Button to={link} size={buttonSizes.SMALL}>
                Manage
              </Button>
            </ChannelListItem>
          );
        });
      }}
    </Query>
  );
};
