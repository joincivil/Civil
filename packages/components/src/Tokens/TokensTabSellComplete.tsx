import * as React from "react";
import { TokenBuySection } from "./TokensStyledComponents";
import { AirswapSellCVL } from "../Airswap";

export const TokensTabSellComplete: React.StatelessComponent = props => {
  return (
    <TokenBuySection>
      <AirswapSellCVL />
    </TokenBuySection>
  );
};
