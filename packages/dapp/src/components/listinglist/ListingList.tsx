import * as React from "react";
import { Set } from "immutable";
import { ListingListItem } from "./ListingListItem";
import { StyledListingSummaryList } from "@joincivil/components";

export interface ListingListOwnProps {
  listings?: Set<string>;
}

class ListingList extends React.Component<ListingListOwnProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    let index = 0;
    console.log("listings are: ", this.props.listings);
    return (
      <StyledListingSummaryList>
        {this.props.listings &&
          this.props.listings.map(l => {
            console.log("mapppa listing. l: ", l);
            index++;
            return <ListingListItem key={l} listingAddress={l!} even={index % 2 === 0} />;
          })}
      </StyledListingSummaryList>
    );
  }
}

export default ListingList;
