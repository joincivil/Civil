import * as React from "react";
import { TokenBuySellComplete } from "./TokensStyledComponents";
import { TokenBuyCompleteText } from "./TokensTextComponents";
import { TokensUnlockMessage } from "./TokensUnlockMessage";
import { HollowGreenCheck } from "../icons";

export interface TokensTabBuyCompleteProps {
  faqUrl: string;
}

export const TokensTabBuyComplete: React.StatelessComponent<TokensTabBuyCompleteProps> = props => {
  const { faqUrl } = props;

  return (
    <>
      <TokenBuySellComplete>
        <HollowGreenCheck width={48} height={48} />
        <TokenBuyCompleteText faqUrl={faqUrl} />
      </TokenBuySellComplete>
      <TokensUnlockMessage />
    </>
  );
};
