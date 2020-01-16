import * as React from "react";
import { ListingTabIntro } from "./styledComponents";
import { BoostFeed } from "@joincivil/sdk";
import { FeatureFlag, LoadingMessage, DisclosureArrowIcon } from "@joincivil/components";
import { urlConstants } from "@joincivil/utils";
import { ComingSoonText } from "../Boosts/BoostStyledComponents";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { NewsroomWrapper } from "@joincivil/typescript-types";

export interface ListingBoostsProps {
  listingAddress: string;
  newsroom?: NewsroomWrapper;
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
    console.log("this.props.listingAddress: ", this.props.listingAddress);
    const contractAddress = this.props.listingAddress;

    return (
      <FeatureFlag feature={"boosts-mvp"} replacement={<ComingSoonText />}>
        <ListingTabIntro>
          Newsrooms around the world need your help to fund and start new projects. These Newsrooms are setting up
          Project Boosts to help get the word out with what they want to do and let their supporters and fans, like you,
          help them do it. Support these newsrooms by funding their Project Boosts to help hit their goals. Good
          reporting costs money, and the Civil community is making it happen.{" "}
          <a href={urlConstants.FAQ_BOOSTS} target="_blank">
            Learn More <DisclosureArrowIcon />
          </a>
        </ListingTabIntro>
        <Query query={CHANNEL_QUERY} variables={{ contractAddress }}>
          {({ loading: channelLoading, error: channelError, data: channelData }) => {
            if (channelLoading) {
              return <LoadingMessage>Loading Project Boosts</LoadingMessage>;
            } else if (channelError || !channelData || !channelData.channelsGetByNewsroomAddress) {
              console.error("error loading channel data. error:", channelError, "data:", channelData);
              if (this.props.newsroom) {
                console.log("newsroom yes. 1.");
                return (
                  <>
                    {this.props.newsroom.data.name} has not created any Project Boosts.{" "}
                    <a href="/boosts">
                      View all Boosts <DisclosureArrowIcon />
                    </a>
                  </>
                );
              }
              console.log("newsroom no. 2.");
              return (
                <>
                  There are no Project Boosts associated with this newsroom.{" "}
                  <a href="/boosts">
                    View all Boosts <DisclosureArrowIcon />
                  </a>
                </>
              );
            }
            console.log("channelData.channelsGetByNewsroomAddress.id: ", channelData.channelsGetByNewsroomAddress.id);
            return <BoostFeed channelID={channelData.channelsGetByNewsroomAddress.id} />;
          }}
        </Query>
      </FeatureFlag>
    );
  }
}

export default ListingBoosts;
