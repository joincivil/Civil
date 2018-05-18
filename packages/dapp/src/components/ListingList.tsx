import * as React from "react";
import styled from "styled-components";
import { Set } from "immutable";
import ListingListItem from "./ListingListItem";

const StyledUl = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%
  color: black;
`;

export interface ListingListOwnProps {
  listings: Set<string>;
}

class ListingList extends React.Component<ListingListOwnProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <StyledUl>
        {this.props.listings.map(l => {
          return (
            <li key={l}>
              <ListingListItem listingAddress={l!} />
            </li>
          );
        })}
      </StyledUl>
    );
  }
}

export default ListingList;
