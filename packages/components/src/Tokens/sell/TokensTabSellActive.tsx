import * as React from "react";
import { TokenBuyIntro } from "../TokensStyledComponents";
import { TokenSellInstructionsText } from "../TokensTextComponents";
import { UniswapSellSection } from "./UniswapSellSection";

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

      <UniswapSellSection onComplete={onSellComplete} />
    </>
  );
};
