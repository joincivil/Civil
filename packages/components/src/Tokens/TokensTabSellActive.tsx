import * as React from "react";
import { TokenBuySection } from "./TokensStyledComponents";
import { AirswapSellCVL } from "../Airswap";

export interface TokensTabSellActiveProps {
  onSellComplete(): void;
}

export const TokensTabSellActive: React.StatelessComponent<TokensTabSellActiveProps> = props => {
  const { onSellComplete } = props;

  return (
    <TokenBuySection>
      <AirswapSellCVL onComplete={onSellComplete} />
    </TokenBuySection>
  );
};
