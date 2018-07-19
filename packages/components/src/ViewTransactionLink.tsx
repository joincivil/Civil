import * as React from "react";
import { TxHash } from "@joincivil/core";
import styled from "styled-components";
import { colors, fonts } from "./styleConstants";
import { NorthEastArrow } from "./icons";

export interface ViewTransactionLinkProps {
  txHash: TxHash;
  network: string;
}

export interface LinkTheme {
  linkColor: string;
}

const StyledLink = styled.a`
  text-decoration: none;
  font-family: ${fonts.SANS_SERIF};
  color: ${props => props.theme.linkColor};
`;

StyledLink.defaultProps = {
  theme: {
    linkColor: colors.accent.CIVIL_BLUE,
  },
};

export const ViewTransactionLink = (props: ViewTransactionLinkProps): JSX.Element => {
  const baseUrl = props.network === "rinkeby" ? "https://rinkeby.etherscan.io/tx/" : "https://etherscan.io/tx/";
  return (
    <StyledLink target="_blank" href={`${baseUrl}${props.txHash}`}>
      view transaction <NorthEastArrow />
    </StyledLink>
  );
};
