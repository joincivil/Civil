import * as React from "react";
import styled from "styled-components";
import metamaskSideLogoUrl from "../images/img-metamask-small@2x.png";
import metamaskFrontLogoUrl from "../images/img-metamask-small-front@2x.png";

export interface MetaMaskImgProps {
  className?: string;
  height?: string;
  src?: string;
  width?: string;
}

const Img = styled.img<MetaMaskImgProps>`
  height: ${props => props.width || "16px"};
  width: ${props => props.height || "16px"};
`;

export interface MetaMaskIconProps extends Partial<MetaMaskImgProps> {
  className?: string;
}

export const MetaMaskSideIcon = (props: MetaMaskIconProps) => {
  return <Img src={metamaskSideLogoUrl} className={props.className} height={props.height} width={props.width} />;
};

export const MetaMaskFrontIcon = (props: MetaMaskIconProps) => {
  return <Img src={metamaskFrontLogoUrl} className={props.className} height={props.height} width={props.width} />;
};
