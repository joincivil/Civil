import * as React from "react";
import { Set } from "immutable";
import ListingListItem from "./ListingListItem";
import { StyledListingSummaryList } from "@joincivil/components";
import { NewsroomListing } from "@joincivil/core";

export interface ListingListOwnProps {
  ListingItemComponent?: any;
  listings?: Set<NewsroomListing>;
}

// TODO(jon): Add support for various sorting comparator functions (alpha descending?)
const sortNewsroomByAlphaNameAscending = (a: NewsroomListing, b: NewsroomListing): number => {
  const newsroomA = a!.newsroom;
  const newsroomB = b!.newsroom;
  const newsroomAName = newsroomA && newsroomA.data && newsroomA.data.name && newsroomA.data.name.toLowerCase();
  const newsroomBName = newsroomB && newsroomB.data && newsroomB.data.name && newsroomB.data.name.toLowerCase();

  if (newsroomAName && newsroomBName) {
    if (newsroomAName < newsroomBName) {
      return -1;
    } else if (newsroomAName > newsroomBName) {
      return 1;
    }
  }
  return 0;
};

class ListingList extends React.Component<ListingListOwnProps> {
  public render(): JSX.Element {
    let index = 0;
    return (
      <StyledListingSummaryList>
        {this.props.listings &&
          this.props.listings.sort(sortNewsroomByAlphaNameAscending).map(l => {
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
