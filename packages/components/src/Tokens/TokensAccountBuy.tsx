import * as React from "react";
import {
  FlexColumnsPrimaryModule,
  TokenBtns,
  TokenBuySection,
  TokenBuySellTab,
  TokenBuySellTabsNav,
} from "./TokensStyledComponents";
import { TokenBuyTextDisabled, TokenBuyBtnDisabledText } from "./TokensTextComponents";
import { TOKEN_PROGRESS } from "./Tokens";
import { Tabs, Tab } from "../Tabs";
import { TokensTabBuy } from "./buy/TokensTabBuy";
import { TokensTabSell } from "./sell/TokensTabSell";

export interface TokenAccountBuyProps {
  foundationAddress: string;
  network: string;
  step: string;
}

export const UserTokenAccountBuy: React.FunctionComponent<TokenAccountBuyProps> = props => {
  const { foundationAddress, network, step } = props;

  if (step === TOKEN_PROGRESS.DISABLED) {
    return (
      <FlexColumnsPrimaryModule padding={true}>
        <TokenBuySection>
          <TokenBuyTextDisabled />
          <TokenBtns disabled={true}>
            <TokenBuyBtnDisabledText />
          </TokenBtns>
        </TokenBuySection>
      </FlexColumnsPrimaryModule>
    );
  }

  return (
    <FlexColumnsPrimaryModule padding={true}>
      <Tabs TabComponent={TokenBuySellTab} TabsNavComponent={TokenBuySellTabsNav}>
        <Tab title="Buy">
          <TokenBuySection>
            <TokensTabBuy foundationAddress={foundationAddress} network={network} />
          </TokenBuySection>
        </Tab>
        <Tab title="Sell">
          <TokenBuySection>
            <TokensTabSell network={network} />
          </TokenBuySection>
        </Tab>
      </Tabs>
    </FlexColumnsPrimaryModule>
  );
};
