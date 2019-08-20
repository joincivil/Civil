import * as React from "react";
import { ListingSummaryComponentProps } from "./types";
import { ListingSummaryComponent } from "./ListingSummary";
import { StyledListingSummaryList } from "./styledComponents";

export interface ListingSummaryListProps {
  listings: ListingSummaryComponentProps[];
}

export class ListingSummaryList extends React.Component<ListingSummaryListProps> {
  public render(): JSX.Element {
    const listingViews = this.props.listings.map((listing: any) => (
      <div key={listing.listingAddress}>
        <ListingSummaryComponent {...listing} />
      </div>
    ));
    return <StyledListingSummaryList>{listingViews}</StyledListingSummaryList>;
  }
}
