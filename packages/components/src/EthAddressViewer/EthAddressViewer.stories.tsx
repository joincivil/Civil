import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { EthAddressViewer } from "./EthAddressViewer";

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 690px;
`;

const Container: React.FunctionComponent = ({ children }) => <StyledDiv>{children}</StyledDiv>;

storiesOf("EthAddress Viewer", module).add("EthAddress Viewer", () => {
  return (
    <Container>
      <EthAddressViewer
        address="0x 3e39 fa98 3abc d349 d95a ed60 8e79 8817 397c f0d1"
        displayName="CVL Token Contract Address"
        etherscanBaseURL="https://rinkeby.etherscan.io"
      />
    </Container>
  );
});
