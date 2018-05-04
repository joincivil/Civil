import * as React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Set } from "immutable";

const StyledUl = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%
  color: black;
`;

export interface ListingListProps {
  listings: Set<string>;
}

class ListingList extends React.Component<ListingListProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <StyledUl>
        {this.props.listings.map(l => {
          const listing = "/listing/" + l;
          return (
            <li key={l}>
              <Link to={listing}>{l}</Link>
            </li>
          );
        })}
      </StyledUl>
    );
  }
}

export default ListingList;
