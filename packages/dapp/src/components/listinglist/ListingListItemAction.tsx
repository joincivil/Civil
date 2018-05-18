import * as React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { ListingWrapper } from "@joincivil/core";
import { SectionHeader } from "./ListItemStyle";

const StyledDiv = styled.div`
  height: 100px;
  width: 18%;
  padding: 5px;
`;

export interface ListingListItemOwnerProps {
  listing: ListingWrapper;
}

class ListingListItemAction extends React.Component<ListingListItemOwnerProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    let address = "";
    if (this.props.listing && this.props.listing.data) {
      address = this.props.listing.address;
    }
    const link = "/listing/" + address;
    return (
      <StyledDiv>
        <SectionHeader>ACTION</SectionHeader>
        <br />
        <Link to={link}>View Details ></Link>
      </StyledDiv>
    );
  }
}

export default ListingListItemAction;
