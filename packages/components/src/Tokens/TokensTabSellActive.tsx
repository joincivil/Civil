import * as React from "react";
import { TokenBuyIntro, TokenAirswapSection, TokenSellSection } from "./TokensStyledComponents";
import { TokenSellInstructionsText, TokenSellAirswapText } from "./TokensTextComponents";
import { AirswapSellCVL } from "../Airswap";

export interface TokensTabSellActiveProps {
  onSellComplete(): void;
}

export const TokensTabSellActive: React.StatelessComponent<TokensTabSellActiveProps> = props => {
  const { onSellComplete } = props;

  return (
    <>
      <TokenBuyIntro>
        <TokenSellInstructionsText />
      </TokenBuyIntro>

      <TokenAirswapSection>
        <TokenSellAirswapText />
        <TokenSellSection>
          <AirswapSellCVL onComplete={onSellComplete} sellCVLBtnText={"Sell CVL in Airswap"} />
        </TokenSellSection>
      </TokenAirswapSection>
    </>
  );
};
