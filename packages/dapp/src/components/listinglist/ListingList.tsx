import * as React from "react";
import { Set } from "immutable";
import { ListingListItem } from "./ListingListItem";
import { StyledListingSummaryList } from "@joincivil/components";

export interface ListingListOwnProps {
  listings?: Set<string>;
  challenges?: Set<string>;
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
            return <ListingListItem key={l} listingAddress={l!} even={index % 2 === 0} />;
          })}
      </StyledListingSummaryList>
    );
  }
}

export default ListingList;
