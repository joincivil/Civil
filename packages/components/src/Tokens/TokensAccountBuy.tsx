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
          <TokenBuySection>
            <TokensTabBuyActive foundationAddress={foundationAddress} network={network} onBuyComplete={onBuyComplete} />
          </TokenBuySection>
        </Tab>
        <Tab title="Sell">
          <TokenBuySection>
            <TokensTabSellActive onSellComplete={onSellComplete} />
          </TokenBuySection>
        </Tab>
      </Tabs>
    );
  } else {
    tokenSection = (
      <Tabs TabComponent={TokenBuySellTab} TabsNavComponent={TokenBuySellTabsNav}>
        <Tab title="Buy">
          <TokenBuySection>
            <TokensTabBuyComplete faqUrl={faqUrl} />
          </TokenBuySection>
        </Tab>
        <Tab title="Sell">
          <TokenBuySection>
            <TokensTabSellComplete />
          </TokenBuySection>
        </Tab>
      </Tabs>
    );
  }

  return <FlexColumnsPrimaryModule padding={true}>{tokenSection}</FlexColumnsPrimaryModule>;
};
