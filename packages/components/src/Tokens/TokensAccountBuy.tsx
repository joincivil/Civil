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
import { TokensTabBuyActive } from "./TokensTabBuyActive";
import { TokensTabSellActive } from "./TokensTabSellActive";
import { TokensTabBuyComplete } from "./TokensTabBuyComplete";
import { TokensTabSellComplete } from "./TokensTabSellComplete";

export interface TokenAccountBuyProps {
  foundationAddress: string;
  network: string;
  faqUrl: string;
  step?: string;
  onBuyComplete(): void;
  onSellComplete(): void;
}

export const UserTokenAccountBuy: React.StatelessComponent<TokenAccountBuyProps> = props => {
  const { foundationAddress, network, faqUrl, step, onBuyComplete, onSellComplete } = props;
  let tokenSection;

  if (step === TOKEN_PROGRESS.DISABLED) {
    tokenSection = (
      <TokenBuySection>
        <TokenBuyTextDisabled />
        <TokenBtns disabled={true}>
          <TokenBuyBtnDisabledText />
        </TokenBtns>
      </TokenBuySection>
    );
  } else if (step === TOKEN_PROGRESS.ACTIVE) {
    tokenSection = (
      <Tabs TabComponent={TokenBuySellTab} TabsNavComponent={TokenBuySellTabsNav}>
        <Tab title="Buy">
          <TokensTabBuyActive foundationAddress={foundationAddress} network={network} onBuyComplete={onBuyComplete} />
        </Tab>
        <Tab title="Sell">
          <TokensTabSellActive onSellComplete={onSellComplete} />
        </Tab>
      </Tabs>
    );
  } else {
    tokenSection = (
      <Tabs TabComponent={TokenBuySellTab} TabsNavComponent={TokenBuySellTabsNav}>
        <Tab title="Buy">
          <TokensTabBuyComplete faqUrl={faqUrl} />
        </Tab>
        <Tab title="Sell">
          <TokensTabSellComplete />
        </Tab>
      </Tabs>
    );
  }

  return <FlexColumnsPrimaryModule padding={true}>{tokenSection}</FlexColumnsPrimaryModule>;
};
