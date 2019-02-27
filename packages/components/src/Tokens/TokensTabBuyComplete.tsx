import * as React from "react";
import { TokenThanksPurchase } from "./TokensStyledComponents";
import { TokenThanksText } from "./TokensTextComponents";
import { TokensUnlockMessage } from "./TokensUnlockMessage";

export interface TokensBuyTabProps {
  faqUrl: string;
}

export const TokensTabBuyComplete: React.StatelessComponent<TokensBuyTabProps> = props => {
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
