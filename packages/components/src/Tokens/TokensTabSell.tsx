import * as React from "react";
import { TokensTabSellActive } from "./TokensTabSellActive";
import { TokensTabSellComplete } from "./TokensTabSellComplete";
import { TokensTabSellUnlock } from "./TokensTabSellUnlock";

export interface TokensTabSellProps {
  network: string;
}

export interface TokensTabSellStates {
  isSellComplete: boolean;
}

export class TokensTabSell extends React.Component<TokensTabSellProps, TokensTabSellStates> {
  public constructor(props: TokensTabSellProps) {
    super(props);
    this.state = {
      isSellComplete: false,
    };
  }

  public render(): JSX.Element | null {
    const { network } = this.props;
    const { isSellComplete } = this.state;

    // TODO(sarah): check token controller.
    const isTokenUnlocked = true;

    if (!isTokenUnlocked) {
      return <TokensTabSellUnlock />;
    } else if (isSellComplete) {
      return <TokensTabSellComplete />;
    }

    return <TokensTabSellActive network={network} onSellComplete={this.onSellComplete} />;
  }

  private onSellComplete = () => {
    this.setState({ isSellComplete: true });
  };
}
