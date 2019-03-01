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
import { TokensTabBuy } from "./TokensTabBuy";
import { TokensTabSell } from "./TokensTabSell";

export interface TokenAccountBuyProps {
  foundationAddress: string;
  network: string;
  faqUrl: string;
  step: string;
}

export const UserTokenAccountBuy: React.StatelessComponent<TokenAccountBuyProps> = props => {
  const { foundationAddress, network, faqUrl, step } = props;

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
            <TokensTabBuy foundationAddress={foundationAddress} faqUrl={faqUrl} network={network} />
          </TokenBuySection>
        </Tab>
        <Tab title="Sell">
          <TokenBuySection>
            <TokensTabSell network={network} faqUrl={faqUrl} />
          </TokenBuySection>
        </Tab>
      </Tabs>
    </FlexColumnsPrimaryModule>
  );
};
