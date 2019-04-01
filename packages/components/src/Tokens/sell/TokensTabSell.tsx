import * as React from "react";
import { getFormattedTokenBalance } from "@joincivil/utils";
import { TokensTabSellActive } from "./TokensTabSellActive";
import { TokensTabSellComplete } from "./TokensTabSellComplete";
import { TokensTabSellUnlock } from "./TokensTabSellUnlock";
import { ICivilContext, CivilContext } from "../../context";

export interface TokensTabSellProps {
  network: string;
}

export interface TokensTabSellStates {
  isSellComplete: boolean;
  isTokenUnlocked: boolean | null;
  balance: any | null;
}

export class TokensTabSell extends React.Component<TokensTabSellProps, TokensTabSellStates> {
  public static contextType: React.Context<ICivilContext> = CivilContext;
  public constructor(props: TokensTabSellProps) {
    super(props);
    this.state = {
      isSellComplete: false,
      isTokenUnlocked: null,
      balance: null,
    };
  }

  public async componentDidMount(): Promise<void> {
    await this.setUnlockedStatus();
  }

  public render(): JSX.Element | null {
    const { isSellComplete, isTokenUnlocked } = this.state;

    if (isTokenUnlocked === null) {
      return null;
    } else if (!isTokenUnlocked) {
      return <TokensTabSellUnlock />;
    } else if (isSellComplete) {
      return <TokensTabSellComplete />;
    } else {
      return (
        <TokensTabSellActive
          balance={getFormattedTokenBalance(this.state.balance)}
          onSellComplete={this.onSellComplete}
        />
      );
    }
  }
  private async setUnlockedStatus(): Promise<void> {
    const civil = this.context.civil;
    const account = await civil.accountStream.first().toPromise();
    if (!account) {
      return this.setState({ ...this.state, isTokenUnlocked: false });
    }
    const tcr = await civil.tcrSingletonTrusted();
    const token = await tcr.getToken();
    const unlocked = await token.isUnlocked(account);
    const balance = await token.instance.balanceOf.callAsync(account);
    this.setState({ ...this.state, isTokenUnlocked: unlocked, balance });
  }

  private onSellComplete = () => {
    this.setState({ isSellComplete: true });
  };
}
