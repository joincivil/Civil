import * as React from "react";
import styled from "styled-components";
import { ListingWrapper } from "@joincivil/core";
import { SectionHeader } from "./ListItemStyle";

const StyledDiv = styled.div`
  width: 18%;
  padding: 5px;
`;

export interface ListingListItemStatusProps {
  listing: ListingWrapper;
}

class ListingListItemStatus extends React.Component<ListingListItemStatusProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    const status = "none";

    return (
      <StyledDiv>
        <SectionHeader>STATUS</SectionHeader>
        <br />
        {status}
      </StyledDiv>
    );
  }
}

export default ListingListItemStatus;
