import * as React from "react";
import { TxHash } from "@joincivil/core";
import styled from "styled-components";
import { colors, fonts } from "./styleConstants";
import { NorthEastArrow } from "./icons";

export interface ViewTransactionLinkProps {
  txHash: TxHash;
  network: string;
  text?: string;
}

export interface LinkTheme {
  linkColorHover: string;
  linkColor: string;
}

const defaultProps = {
  theme: {
    linkColor: colors.accent.CIVIL_BLUE,
    linkColorHover: colors.accent.CIVIL_BLUE_FADED,
    sansSerifFont: fonts.SANS_SERIF,
  },
};

const StyledLink = styled.a`
  text-decoration: none;
  font-family: ${props => props.theme.sansSerifFont};
  color: ${props => props.theme.linkColor};
  &:hover {
    color: ${props => props.theme.linkColorHover};
  }
  & path {
    fill: ${props => props.theme.linkColor};
  }
  &:hover path {
    fill: ${props => props.theme.linkColorHover};
  }
`;

StyledLink.defaultProps = defaultProps;

export const ViewTransactionLink = (props: ViewTransactionLinkProps) => {
  const baseUrl = props.network === "rinkeby" ? "https://rinkeby.etherscan.io/tx/" : "https://etherscan.io/tx/";
  return (
    <StyledLink target="_blank" href={`${baseUrl}${props.txHash}`}>
      {props.text || "view transaction"} <NorthEastArrow />
    </StyledLink>
  );
};
