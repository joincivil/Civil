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
      try {
        // TODO(jon): This is a temporary patch to handle the older charter format. It's needed while we're in transition to the newer schema and should be updated once the dapp is updated to properly handle the new charter
        newsroomDescription = (this.props.newsroom.data.charter.content as any).desc;
      } catch (ex) {
        console.error("charter not formatted correctly");
      }
    }

    const props: ListingDetailHeaderProps = {
      newsroomName: this.props.newsroom.data.name,
      newsroomDescription,
      owner: this.props.listing.data.owner,
      registryURL: "/registry",
      unstakedDeposit: getFormattedTokenBalance(this.props.listing.data.unstakedDeposit),
      ...this.props.listingPhaseState,
    };

    return <>{this.props.listing.data && <ListingDetailHeader {...props} />}</>;
  }
}

export default ListingHeader;
