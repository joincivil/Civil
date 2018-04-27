import * as React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { List } from "immutable";
import { ListingWrapper } from "@joincivil/core";

const StyledUl = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  width: 100%
  color: black;
`;

export interface ListingListProps {
  listings: List<ListingWrapper>;
}

class ListingList extends React.Component<ListingListProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <StyledUl>
        {this.props.listings.map(l => {
          const listing = "/listing/" + l!.address;
          return (
            <li key={l!.address}>
              <Link to={listing}>{l!.address}</Link>
            </li>
          );
        })}
      </StyledUl>
    );
  }
}

export default ListingList;
