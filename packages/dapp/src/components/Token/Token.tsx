import * as React from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";

import ScrollToTopOnMount from "../utility/ScrollToTop";

const StyledTokenActivityContainer = styled.div`
  box-sizing: border-box;
  padding: 0 0 200px 396px;
  margin: -318px auto 0;
  width: 1200px;
`;

export interface TokenProps {
  match?: any;
  history: any;
}

export const Account: React.SFC<TokenProps> = props => {
  return (
    <>
      <Helmet>
        <title>Token Account - The Civil Registry</title>
      </Helmet>
      <ScrollToTopOnMount />
      <StyledTokenActivityContainer>User Tokens</StyledTokenActivityContainer>
    </>
  );
};
