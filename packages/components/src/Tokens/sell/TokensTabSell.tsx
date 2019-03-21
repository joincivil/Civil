import * as React from "react";
import { TokensTabSellActive } from "./TokensTabSellActive";
import { TokensTabSellComplete } from "./TokensTabSellComplete";
import { TokensTabSellUnlock } from "./TokensTabSellUnlock";
import { ComingSoon } from "../TokensStyledComponents";
import { FeatureFlag } from "../../features/FeatureFlag";

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
    const { isSellComplete } = this.state;
    // TODO(sarah): check token controller.
    const isTokenUnlocked = true;

    const uniswapComingSoon = (
      <ComingSoon>
        <h3>Coming soon!</h3>
        <p>
          Civil members who have completed the tutorial and unlocked their tokens may now send their tokens to anyone,
          and soon will be able to sell their tokens on the open market via this page on civil.co. If you need help or
          have questions, please contact us at <a href="mailto:support@civil.co">support@civil.co</a>.
        </p>
      </ComingSoon>
    );

    let componentToDisplay;
    if (!isTokenUnlocked) {
      componentToDisplay = <TokensTabSellUnlock />;
    } else if (isSellComplete) {
      componentToDisplay = <TokensTabSellComplete />;
    } else {
      componentToDisplay = <TokensTabSellActive onSellComplete={this.onSellComplete} />;
    }

    return (
      <FeatureFlag feature="uniswap" replacement={uniswapComingSoon}>
        {componentToDisplay}
      </FeatureFlag>
    );
  }

  private onSellComplete = () => {
    this.setState({ isSellComplete: true });
  };
}
