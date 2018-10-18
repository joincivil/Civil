import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { ListingSummaryComponentProps } from "./types";
import { ListingSummaryComponent } from "./ListingSummary";

export const StyledListingSummaryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
  width: 1200px;
`;

export interface ListingSummaryListProps {
  listings: ListingSummaryComponentProps[];
}

export class ListingSummaryList extends React.Component<ListingSummaryListProps> {
  public render(): JSX.Element {
    const listingViews = this.props.listings.map((listing: any) => (
      <div>
        <ListingSummaryComponent key={listing.address} {...listing} />
      </div>
    ));
    return <StyledListingSummaryList>{listingViews}</StyledListingSummaryList>;
  }
}
