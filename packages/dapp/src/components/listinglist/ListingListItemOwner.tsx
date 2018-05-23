import * as React from "react";
import styled from "styled-components";
import { NewsroomWrapper } from "@joincivil/core";
import { SectionHeader } from "./ListItemStyle";
import EllipsisText from "react-ellipsis-text";

const StyledDiv = styled.div`
  width: 18%;
  padding: 5px;
`;

export interface ListingListItemOwnerProps {
  newsroom: NewsroomWrapper;
}

class ListingListItemOwner extends React.Component<ListingListItemOwnerProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    let owners: any[] = [];
    if (this.props.newsroom && this.props.newsroom.data) {
      owners = this.props.newsroom.data.owners;
    }
    return (
      <StyledDiv>
        <SectionHeader>OWNER</SectionHeader>
        <br />
        {owners.map((owner, i) => {
          return (
            <div key={i}>
              <EllipsisText text={owner} length={12} />
              <br />
            </div>
          );
        })}
      </StyledDiv>
    );
  }
}

export default ListingListItemOwner;
