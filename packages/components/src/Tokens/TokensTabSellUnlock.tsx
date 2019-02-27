import * as React from "react";
import { TokenBuySection, TokenThanksPurchase } from "./TokensStyledComponents";
import { TokenThanksText } from "./TokensTextComponents";
import { TokensUnlockMessage } from "./TokensUnlockMessage";

export interface TokensBuyTabProps {
  faqUrl: string;
}

export const TokensTabSellUnlock: React.StatelessComponent<TokensBuyTabProps> = props => {
  const { faqUrl } = props;

  return (
    <TokenBuySection>
      <TokenThanksPurchase>
        <TokenThanksText faqUrl={faqUrl} />
      </TokenThanksPurchase>
      <TokensUnlockMessage />
    </TokenBuySection>
  );
};
