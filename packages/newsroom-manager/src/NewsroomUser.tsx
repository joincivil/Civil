import * as React from "react";
import { AddressWithCopyButton } from "@joincivil/components";
import { EthAddress } from "@joincivil/core";
import styled, { StyledComponentClass } from "styled-components";

export interface NewsroomUserProps {
  address: EthAddress;
  name?: string;
}

export const Wrapper: StyledComponentClass<{}, "div"> = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

export interface AddressComponentProps {
  name?: string;
}

export const AddressComponent: StyledComponentClass<any, "div"> = styled.div`
  width: ${(props: AddressComponentProps): string => (props.name ? "50%" : "100%")};
`;

export const NameComponent: StyledComponentClass<{}, "div"> = styled.div`
  color: #000;
  font-weight: 600;
  font-size: 13px;
  width: 38%;
  text-align: left;
`;

export class NewsroomUser extends React.Component<NewsroomUserProps> {
  public render(): JSX.Element {
    const nameComponent = this.props.name ? <NameComponent>{this.props.name}</NameComponent> : undefined;
    return (
      <Wrapper>
        <AddressComponent name={this.props.name}>
          <AddressWithCopyButton address={this.props.address} />
        </AddressComponent>
        {nameComponent}
      </Wrapper>
    );
  }
}
