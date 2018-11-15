import * as React from "react";
import styled from "styled-components";
import * as metamaskSideLogoUrl from "../images/img-metamask-small@2x.png";
import * as metamaskFrontLogoUrl from "../images/img-metamask-small-front@2x.png";

const Img = styled.img`
  width: 16px;
  height: 16px;
`;

export interface MetaMaskIconProps {
  className?: string;
}

export const MetaMaskSideIcon = (props: MetaMaskIconProps): JSX.Element => {
  return <Img src={metamaskSideLogoUrl} className={props.className} />;
};

export const MetaMaskFrontIcon = (props: MetaMaskIconProps): JSX.Element => {
  return <Img src={metamaskFrontLogoUrl} className={props.className} />;
};
