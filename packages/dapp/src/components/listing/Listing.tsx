import * as React from "react";

import ListingRedux from "./ListingRedux";
import ListingApollo from "./ListingApollo";

export interface ListingPageProps {
  match: any;
}
export interface ListingPageState {
  useGraphQl: boolean;
}

export default class ListingPageComponent extends React.Component<ListingPageProps, ListingPageState> {
  constructor(props: ListingPageProps) {
    super(props);
    this.state = {
      useGraphQl: true,
    };
  }
  public render(): JSX.Element {
    const listingAddress = this.props.match.params.listing;
    if (this.state.useGraphQl) {
      return <ListingApollo listingAddress={listingAddress} />;
    } else {
      return <ListingRedux listingAddress={listingAddress} />;
    }
  }
}
