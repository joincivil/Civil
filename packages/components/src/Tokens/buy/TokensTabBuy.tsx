import * as React from "react";
import * as qs from "querystring";
import { Redirect } from "react-router-dom";
import { TokensTabBuyActive } from "./TokensTabBuyActive";
import { TokensTabBuyComplete } from "./TokensTabBuyComplete";
import Eth from "@ledgerhq/hw-app-eth";

export interface TokensTabBuyProps {
  foundationAddress: string;
  network: string;
  onBuyComplete(isFromFoundation: boolean, eth: number): void;
}

export interface TokensTabBuyStates {
  isBuyComplete: boolean;
}

export class TokensTabBuy extends React.Component<TokensTabBuyProps, TokensTabBuyStates> {
  public constructor(props: TokensTabBuyProps) {
    super(props);
    this.state = {
      isBuyComplete: false,
    };
  }

  public render(): JSX.Element | null {
    const { foundationAddress, network } = this.props;
    const { isBuyComplete } = this.state;

    if (isBuyComplete) {
      const redirect = qs.parse(document.location.search.substr(1)).redirect as string;
      if (redirect) {
        return <Redirect to={redirect} />;
      }
      return <TokensTabBuyComplete />;
    }

    return (
      <TokensTabBuyActive foundationAddress={foundationAddress} network={network} onBuyComplete={this.onBuyComplete} />
    );
  }

  private onBuyComplete = (isFromFoundation: boolean, eth: number) => {
    alert({ eth });
    if (this.props.onBuyComplete) {
      this.props.onBuyComplete(isFromFoundation, eth);
    }
    this.setState({ isBuyComplete: true });
  };
}
