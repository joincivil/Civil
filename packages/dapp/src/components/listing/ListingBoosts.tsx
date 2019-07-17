import * as React from "react";
import { ListingTabIntro } from "./styledComponents";
import { BoostFeed } from "@joincivil/civil-sdk";
import { FeatureFlag } from "@joincivil/components";
import { urlConstants } from "@joincivil/utils";
import { ComingSoonText } from "../Boosts/BoostStyledComponents";

export interface ListingBoostsProps {
  listingAddress: string;
}

class ListingBoosts extends React.Component<ListingBoostsProps> {
  public render(): JSX.Element {
    const search = { postType: "boost", channelID: this.props.listingAddress };

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
        <BoostFeed search={search} />
      </FeatureFlag>
    );
  }
}

export default ListingBoosts;
