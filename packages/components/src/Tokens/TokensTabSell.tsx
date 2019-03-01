import * as React from "react";
import { TokensTabSellActive } from "./TokensTabSellActive";
import { TokensTabSellComplete } from "./TokensTabSellComplete";
import { TokensTabSellUnlock } from "./TokensTabSellUnlock";
import { ComingSoon } from "./TokensStyledComponents";

export interface TokensTabSellProps {
  faqUrl: string;
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
    const { faqUrl, network } = this.props;
    const { isSellComplete } = this.state;

    // TODO(sarah): temporary messaging while waiting on market maker
    const urlParams = new URLSearchParams(window.location.search);
    const testParam = urlParams.get("test-sell");
    const comingSoon = testParam === null ? true : false;
    if (comingSoon) {
      return (
        <ComingSoon>
          <h3>Coming Soon...</h3>
          <p>
            We appreciate your patience while we are testing this feature.<br />If you need help or have questions,
            please contact our support team at <a href="mailto:support@civil.co">support@civil.co</a>.
          </p>
        </ComingSoon>
      );
    }

    // TODO(sarah): check token controller.
    const isTokenUnlocked = true;

    if (!isTokenUnlocked) {
      return <TokensTabSellUnlock />;
    } else if (isSellComplete) {
      return <TokensTabSellComplete faqUrl={faqUrl} />;
    }

    return <TokensTabSellActive network={network} onSellComplete={this.onSellComplete} />;
  }

  private onSellComplete = () => {
    this.setState({ isSellComplete: true });
  };
}
