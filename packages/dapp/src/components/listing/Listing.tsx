import * as React from "react";
import styled from "styled-components";

import ListingHistory from "./ListingHistory";

const StyledDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%
  color: black;
`;

export interface ListingProps {
  match: any;
}

class Listing extends React.Component<ListingProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <StyledDiv>
        <ListingHistory match={this.props.match} />
      </StyledDiv>
    );
  }
}

export default Listing;
