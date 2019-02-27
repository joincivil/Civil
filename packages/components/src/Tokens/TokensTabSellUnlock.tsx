import * as React from "react";
import { TokenThanksPurchase } from "./TokensStyledComponents";
import { TokenUnlockSellText } from "./TokensTextComponents";
import { TokensUnlockMessage } from "./TokensUnlockMessage";

export const TokensTabSellUnlock: React.StatelessComponent = props => {
  return (
    <>
      <TokenThanksPurchase>
        <TokenUnlockSellText />
      </TokenThanksPurchase>
      <TokensUnlockMessage />
    </>
  );
};
