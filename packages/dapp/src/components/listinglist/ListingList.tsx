import * as React from "react";
import styled from "styled-components";
import { Set } from "immutable";
import ListingListItem from "./ListingListItem";

const StyledUl = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
  width: 100%
  color: black;
  align-items: center;
`;

const StyledLI = styled.li`
  width: 80%;
`;

export interface ListingListOwnProps {
  listings: Set<string>;
}

class ListingList extends React.Component<ListingListOwnProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    let index = 0;
    return (
      <StyledUl>
        {this.props.listings.map(l => {
          index++;
          return (
            <StyledLI key={l}>
              <ListingListItem listingAddress={l!} even={index % 2 === 0} />
            </StyledLI>
          );
        })}
      </StyledUl>
    );
  }
}

export default ListingList;
