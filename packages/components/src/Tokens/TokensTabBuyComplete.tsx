import * as React from "react";
import { TokenThanksPurchase } from "./TokensStyledComponents";
import { TokenThanksText } from "./TokensTextComponents";
import { TokensUnlockMessage } from "./TokensUnlockMessage";

export interface TokensTabBuyCompleteProps {
  faqUrl: string;
}

export const TokensTabBuyComplete: React.StatelessComponent<TokensTabBuyCompleteProps> = props => {
  const { faqUrl } = props;

  return (
    <>
      <TokenThanksPurchase>
        <TokenThanksText faqUrl={faqUrl} />
      </TokenThanksPurchase>
      <TokensUnlockMessage />
    </>
  );
};
