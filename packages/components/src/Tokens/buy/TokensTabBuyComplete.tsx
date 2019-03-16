import * as React from "react";
import { TokenBuySellComplete } from "../TokensStyledComponents";
import { TokenBuyCompleteText } from "../TokensTextComponents";
import { TokensUnlockMessage } from "../TokensUnlockMessage";
import { HollowGreenCheck } from "../../icons";

export const TokensTabBuyComplete: React.StatelessComponent = props => {
  return (
    <>
      <TokenBuySellComplete>
        <HollowGreenCheck width={48} height={48} />
        <TokenBuyCompleteText />
      </TokenBuySellComplete>
      <TokensUnlockMessage />
    </>
  );
};
