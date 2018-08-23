import * as React from "react";
import styled from "styled-components";
import * as metamaskLogoUrl from "../images/img-metamask-small@2x.png";

const Img = styled.img`
  width: 16px;
  height: 16px;
  vertical-align: text-bottom;
`;

export const MetaMaskSideIcon = (): JSX.Element => {
  return <Img src={metamaskLogoUrl} />;
};
