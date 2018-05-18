import * as React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { ListingWrapper, NewsroomWrapper } from "@joincivil/core";

const StyledDiv = styled.div`
  height: 100px;
  width: 46%;
  padding: 5px;
`;

const NewsroomName = styled.span`
  font-family: spectral;
  font-size: 24pt;
`;

export interface ListingListItemDescriptionProps {
  listing: ListingWrapper;
  newsroom: NewsroomWrapper;
}

class ListingListItemDescription extends React.Component<ListingListItemDescriptionProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    let address = "";
    if (this.props.listing) {
      address = this.props.listing.address;
    }
    let name = "";
    if (this.props.newsroom && this.props.newsroom.data) {
      name = this.props.newsroom.data.name;
    }
    const link = "/newsroom/" + address;
    return (
      <StyledDiv>
        <NewsroomName>{name}</NewsroomName>
        <br />
        <Link to={link}>Go to Newsroom</Link>
      </StyledDiv>
    );
  }
}

export default ListingListItemDescription;
