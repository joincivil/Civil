import * as React from "react";
import { ListingDetailHeader, ListingDetailHeaderProps } from "@joincivil/components";
import { EthAddress, ListingWrapper, NewsroomWrapper } from "@joincivil/core";
import { getFormattedTokenBalance } from "@joincivil/utils";

export interface ListingHeaderProps {
  newsroom: NewsroomWrapper;
  listing: ListingWrapper;
  userAccount?: EthAddress;
  listingPhaseState: any;
}

class ListingHeader extends React.Component<ListingHeaderProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    let newsroomDescription = "";
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
