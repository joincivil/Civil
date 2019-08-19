import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import * as metamaskSideLogoUrl from "../images/img-metamask-small@2x.png";
import * as metamaskFrontLogoUrl from "../images/img-metamask-small-front@2x.png";

export interface MetaMaskImgProps {
  className?: string;
  height?: string;
  src?: string;
  width?: string;
}

const Img: StyledComponentClass<MetaMaskImgProps, "img"> = styled<MetaMaskImgProps, "img">("img")`
  height: ${props => props.width || "16px"};
  width: ${props => props.height || "16px"};
`;

export interface MetaMaskIconProps extends Partial<MetaMaskImgProps> {
  className?: string;
}

export const MetaMaskSideIcon = (props: MetaMaskIconProps): JSX.Element => {
  return <Img src={metamaskSideLogoUrl} className={props.className} height={props.height} width={props.width} />;
};

export const MetaMaskFrontIcon = (props: MetaMaskIconProps): JSX.Element => {
  return <Img src={metamaskFrontLogoUrl} className={props.className} height={props.height} width={props.width} />;
};
