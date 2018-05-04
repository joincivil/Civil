import * as React from "react";

import ListingHistory from "./ListingHistory";
import ListingDetail from "./ListingDetail";
import ListingPhaseActions from "./ListingPhaseActions";
import { EthAddress, ListingWrapper } from "@joincivil/core";
import { getCivil, getTCR } from "../../helpers/civilInstance";
import { PageView } from "../utility/ViewModules";

export interface ListingPageProps {
  match: any;
}

export interface ListingPageState {
  userAccount?: EthAddress;
  listing: ListingWrapper | undefined;
}

class ListingPage extends React.Component<ListingPageProps, ListingPageState> {
  constructor(props: ListingPageProps) {
    super(props);
    this.state = {
      listing: undefined,
    };
  }

  public async componentDidMount(): Promise<void> {
    return this.initListing();
  }

  public render(): JSX.Element {
    const listing = this.state.listing;
    let appExists = false;
    if (listing) {
      appExists = !listing.data.appExpiry.isZero();
    }
    return (
      <PageView>
        {appExists && <ListingDetail userAccount={this.state.userAccount} listing={this.state.listing!} />}
        {appExists && <ListingPhaseActions listing={this.state.listing!} />}
        {!appExists && this.renderListingNotFound()}
        <ListingHistory match={this.props.match} />
      </PageView>
    );
  }

  private renderListingNotFound(): JSX.Element {
    return <>NOT FOUND</>;
  }

  // TODO(nickreynolds): move this all into redux
  private initListing = async () => {
    const civil = getCivil();
    const tcr = getTCR();

    if (tcr) {
      const listingHelper = tcr.getListing(this.props.match.params.listing);
      const listing = await listingHelper.getListingWrapper();
      this.setState({ listing });
    }

    if (civil) {
      const userAccount = civil.userAccount;
      this.setState({ userAccount });
    }
  };
}

export default ListingPage;
