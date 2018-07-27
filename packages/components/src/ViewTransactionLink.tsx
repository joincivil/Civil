import * as React from "react";
import { TxHash } from "@joincivil/core";
import styled, {withTheme} from "styled-components";
import { colors, fonts } from "./styleConstants";
import { NorthEastArrow } from "./icons";

export interface ViewTransactionLinkProps {
  txHash: TxHash;
  network: string;
  text?: string;
  theme: LinkTheme;
}

export interface ViewTransactionLinkState {
  hovered: boolean;
}

export interface LinkTheme {
  linkColorHover: string;
  linkColor: string;
}

const defaultProps = {
  theme: {
    linkColor: colors.accent.CIVIL_BLUE,
    linkColorHover: colors.accent.CIVIL_BLUE_FADED,
    sanserifFont: fonts.SANS_SERIF,
  },
};

const StyledLink = styled.a`
  text-decoration: none;
  font-family: ${props => props.theme.sanserifFont};
  color: ${props => props.theme.linkColor};
`;

StyledLink.defaultProps = defaultProps;

class ViewTransactionLinkComponent extends React.Component<ViewTransactionLinkProps, ViewTransactionLinkState> {
  constructor(props: ViewTransactionLinkProps) {
    super(props);
    this.state = {
      hovered: false,
    };
  }
  public render(): JSX.Element {
    const baseUrl = this.props.network === "rinkeby" ? "https://rinkeby.etherscan.io/tx/" : "https://etherscan.io/tx/";
    return (
      <StyledLink onMouseOver={() => this.setState({hovered: true})} onMouseLeave={() => this.setState({hovered: false})} target="_blank" href={`${baseUrl}${this.props.txHash}`}>
        {this.props.text || "view transaction"} <NorthEastArrow color={this.state.hovered ? this.props.theme.linkColorHover : this.props.theme.linkColor} />
      </StyledLink>
    );
  }

}

export const ViewTransactionLink = withTheme(ViewTransactionLinkComponent);

ViewTransactionLink.defaultProps = defaultProps;
