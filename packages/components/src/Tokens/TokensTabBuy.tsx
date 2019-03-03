import * as React from "react";
import { TokensTabBuyActive } from "./TokensTabBuyActive";
import { TokensTabBuyComplete } from "./TokensTabBuyComplete";

export interface TokensTabBuyProps {
  foundationAddress: string;
  faqUrl: string;
  network: string;
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
    const { foundationAddress, network, faqUrl } = this.props;
    const { isBuyComplete } = this.state;

    if (isBuyComplete) {
      return <TokensTabBuyComplete faqUrl={faqUrl} />;
    }

    return (
      <TokensTabBuyActive foundationAddress={foundationAddress} network={network} onBuyComplete={this.onBuyComplete} />
    );
  }

  private onBuyComplete = () => {
    this.setState({ isBuyComplete: true });
  };
}
