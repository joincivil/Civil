import * as React from "react";
import { colors } from "@joincivil/components";
import { EthAddress } from "@joincivil/core";
import styled, { StyledComponentClass } from "styled-components";

export interface NewsroomUserProps {
  address: EthAddress;
  name?: string;
}

const Wrapper: StyledComponentClass<{}, "div"> = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
`;

const NameSection = styled.div`
  margin-right: 80px;
  width: 120px;
`;

const StyledHeader = styled.h4`
  margin-bottom: 10px;
`;

export interface AddressComponentProps {
  name?: string;
}

export class NewsroomUser extends React.Component<NewsroomUserProps> {
  public render(): JSX.Element {
    return (
      <Wrapper>
        <NameSection>
          <StyledHeader>Name</StyledHeader>
          <p>{this.props.name}</p>
        </NameSection>
        <div>
          <StyledHeader>Wallet Address</StyledHeader>
          <p>{this.props.address}</p>
        </div>
      </Wrapper>
    );
  }
}
