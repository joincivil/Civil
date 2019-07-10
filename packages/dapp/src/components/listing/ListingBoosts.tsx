import * as React from "react";
import { connect } from "react-redux";
import { State } from "../../redux/reducers";
import { ListingTabIntro } from "./styledComponents";
import { BoostFeed } from "@joincivil/civil-sdk";

export interface ListingBoostsProps {
  listingAddress: string;
}

class ListingBoosts extends React.Component<ListingBoostsProps> {
  public render(): JSX.Element {
    const search = { postType: "boost", channelID: this.props.listingAddress };

    return (
      <>
        <ListingTabIntro>
          Boosts are mini-fundraisers. Newsrooms can use them to let their audience know about what they would like to
          do, and let their fans help them do it. The best boosts are smallish and short-term, with a concrete
          description of what the newsroom wants to accomplish, what the costs are, and exactly what the outcome will
          be. Good reporting costs money, and the Civil community wants to help make it happen.
        </ListingTabIntro>
        <BoostFeed search={search} />
      </>
    );
  }
}

const mapToStateToProps = (state: State, ownProps: ListingBoostsProps) => {
  return {
    ...ownProps,
  };
};

export default connect(mapToStateToProps)(ListingBoosts);
