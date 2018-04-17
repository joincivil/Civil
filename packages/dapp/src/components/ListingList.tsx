import * as React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { List } from "immutable";
const StyledDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%
  color: black;
`;

export interface ListingListProps {
  listings: List<string>;
}

class ListingList extends React.Component<ListingListProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <StyledDiv>
        {this.props.listings.map(l => {
          const listing = "/Listing/" + l;
          return (
            <Link key={listing} to={listing}>
              {listing}
            </Link>
          );
        })}
      </StyledDiv>
    );
  }
}

export default ListingList;
