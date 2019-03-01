import * as React from "react";
import { TokenBuySellComplete } from "./TokensStyledComponents";
import { TokenSellCompleteText } from "./TokensTextComponents";
import { HollowGreenCheck } from "../icons";

export interface TokensTabSellCompleteProps {
  faqUrl: string;
}

export const TokensTabSellComplete: React.StatelessComponent<TokensTabSellCompleteProps> = props => {
  const { faqUrl } = props;

  return (
    <TokenBuySellComplete>
      <HollowGreenCheck width={48} height={48} />
      <TokenSellCompleteText faqUrl={faqUrl} />
    </TokenBuySellComplete>
  );
};
