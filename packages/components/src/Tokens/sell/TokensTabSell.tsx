import * as React from "react";
import { getFormattedTokenBalance } from "@joincivil/utils";
import { TokensTabSellActive } from "./TokensTabSellActive";
import { TokensTabSellComplete } from "./TokensTabSellComplete";
import { ICivilContext, CivilContext } from "../../context";
import { FeatureFlag } from "../../features/FeatureFlag";
import { ComingSoon } from "../TokensStyledComponents";

export interface TokensTabSellProps {
  network: string;
}

export interface TokensTabSellStates {
  isSellComplete: boolean;
  balance: any | null;
}

export class TokensTabSell extends React.Component<TokensTabSellProps, TokensTabSellStates> {
  public static contextType = CivilContext;
  public static context: ICivilContext;
  public constructor(props: TokensTabSellProps) {
    super(props);
    this.state = {
      isSellComplete: false,
      balance: null,
    };
  }

  public async componentDidMount(): Promise<void> {
    await this.setTokenBalance();
  }

  public render(): JSX.Element | null {
    const { isSellComplete, balance } = this.state;

    const comingSoon = (
      <ComingSoon>
        <h3>Coming Soon...</h3>
        <p>
          We appreciate your patience while we are testing this feature.
          <br />
          If you need help or have questions, please contact our support team at{" "}
          <a href="mailto:support@civil.co">support@civil.co</a>.
        </p>
      </ComingSoon>
    );

    let content: JSX.Element;
    if (balance === null) {
      return null;
    } else if (isSellComplete) {
      content = <TokensTabSellComplete />;
    } else {
      content = (
        <TokensTabSellActive balance={getFormattedTokenBalance(balance)} onSellComplete={this.onSellComplete} />
      );
    }

    return (
      <FeatureFlag feature="uniswap" replacement={comingSoon}>
        {content}
      </FeatureFlag>
    );
  }
  private async setTokenBalance(): Promise<void> {
    const civil = this.context.civil;
    const account = await civil.accountStream.first().toPromise();
    if (account) {
      const tcr = await civil.tcrSingletonTrusted();
      const token = await tcr.getToken();
      const balance = await token.instance.balanceOf.callAsync(account);
      this.setState({ ...this.state, balance });
    }
  }

  private onSellComplete = () => {
    this.setState({ isSellComplete: true });
  };
}
