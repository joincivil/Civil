import * as React from "react";
import styled from "styled-components";
import { MetaMaskFrontIcon } from "./";
import { fonts } from "./styleConstants";

export interface AddressWithMetaMaskIconProps {
  address?: string;
}

const Wrapper = styled.div`
  display: inline-block;
  margin-bottom: 16px;
`;

const Box = styled.div`
  display: flex;
  position: relative;
  top: 4px;
  margin-top: -4px;
  align-items: center
  font-family: ${fonts.MONOSPACE};
  padding: 8px 12px 4px 8px;
  border: 1px solid #dddddd;
  word-break: break-word;

  img {
    position: relative;
    top: -2px;
    margin-right: 12px;
  }
`;

export class AddressWithMetaMaskIcon extends React.Component<AddressWithMetaMaskIconProps> {
  public render(): JSX.Element {
    return (
      <Wrapper>
        <Box>
          <MetaMaskFrontIcon />
          {this.props.address}
        </Box>
      </Wrapper>
    );
  }
}
