import * as React from "react";
import { ListingDetailHeader, ListingDetailHeaderProps } from "@joincivil/components";
import { EthAddress, ListingWrapper, NewsroomWrapper } from "@joincivil/core";
import { getFormattedTokenBalance } from "@joincivil/utils";

export interface ListingDetailProps {
  newsroom: NewsroomWrapper;
  listing: ListingWrapper;
  userAccount?: EthAddress;
  listingPhaseState: any;
}

class ListingDetail extends React.Component<ListingDetailProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    let newsroomDescription =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id.";
    if (this.props.newsroom.data.charter) {
      newsroomDescription = JSON.parse(this.props.newsroom.data.charter.content.toString()).desc;
    }

    const props: ListingDetailHeaderProps = {
      newsroomName: this.props.newsroom.data.name,
      newsroomDescription,
      owner: this.props.listing.data.owner,
      unstakedDeposit: getFormattedTokenBalance(this.props.listing.data.unstakedDeposit),
      ...this.props.listingPhaseState,
    };

    return <>{this.props.listing.data && <ListingDetailHeader {...props} />}</>;
  }
}

export default ListingDetail;
