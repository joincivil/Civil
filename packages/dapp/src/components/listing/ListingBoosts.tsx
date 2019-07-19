import * as React from "react";
import { ListingTabIntro } from "./styledComponents";
import { BoostFeed } from "@joincivil/civil-sdk";
import { FeatureFlag, LoadingMessage } from "@joincivil/components";
import { urlConstants } from "@joincivil/utils";
import { ComingSoonText } from "../Boosts/BoostStyledComponents";
import { Query } from "react-apollo";
import gql from "graphql-tag";

export interface ListingBoostsProps {
  listingAddress: string;
}

const CHANNEL_QUERY = gql`
  query Channel($contractAddress: String!) {
    channelsGetByNewsroomAddress(contractAddress: $contractAddress) {
      id
    }
  }
`;

class ListingBoosts extends React.Component<ListingBoostsProps> {
  public render(): JSX.Element {
    const contractAddress = this.props.listingAddress;

    return (
      <FeatureFlag feature={"boosts-mvp"} replacement={<ComingSoonText />}>
        <ListingTabIntro>
          Newsrooms around the world need your help to fund and start new projects. These Newsrooms are setting up
          Boosts to help in get the word out with what they want to do and let their supporters and fans, like you, help
          them do it. Support these newsrooms by funding their Boosts to help hit their goals. Good reporting costs
          money, and the Civil community is making it happen.{" "}
          <a href={urlConstants.FAQ_BOOSTS} target="_blank">
            Learn More &gt;
          </a>
        </ListingTabIntro>
        <Query query={CHANNEL_QUERY} variables={{ contractAddress }}>
          {({ loading: channelLoading, error: channelError, data: channelData }) => {
            if (channelLoading) {
              return <LoadingMessage>Loading Boosts</LoadingMessage>;
            } else if (channelError || !channelData || !channelData.channelsGetByNewsroomAddress) {
              console.error("error loading channel data. error:", channelError, "data:", channelData);
              return "Error loading Boosts.";
            }

            const search = { postType: "boost", channelID: channelData.channelsGetByNewsroomAddress.id };

            return <BoostFeed search={search} />;
          }}
        </Query>
      </FeatureFlag>
    );
  }
}

export default ListingBoosts;
