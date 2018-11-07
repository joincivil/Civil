import * as React from "react";
import { Set } from "immutable";
import ListingListItem from "./ListingListItem";
import { StyledListingSummaryList } from "@joincivil/components";
import { NewsroomListing } from "@joincivil/core";

export interface ListingListOwnProps {
  ListingItemComponent?: any;
  listings?: Set<NewsroomListing>;
}

class ListingList extends React.Component<ListingListOwnProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    let index = 0;
    return (
      <StyledListingSummaryList>
        {this.props.listings &&
          this.props.listings.map(l => {
            index++;
            return (
              <ListingListItem
                listingAddress={l!.listing.address}
                key={l!.listing.address}
                newsroom={l!.newsroom}
                listing={l!.listing}
                even={index % 2 === 0}
                ListingItemComponent={this.props.ListingItemComponent}
              />
            );
          })}
      </StyledListingSummaryList>
    );
  }
}

export default ListingList;
