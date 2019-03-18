import * as React from "react";
import { TokenBuySellComplete } from "./TokensStyledComponents";
import { TokenSellCompleteText } from "./TokensTextComponents";
import { HollowGreenCheck } from "../icons";

export const TokensTabSellComplete: React.StatelessComponent = props => {
  return (
    <TokenBuySellComplete>
      <HollowGreenCheck width={48} height={48} />
      <TokenSellCompleteText />
    </TokenBuySellComplete>
  );
};
