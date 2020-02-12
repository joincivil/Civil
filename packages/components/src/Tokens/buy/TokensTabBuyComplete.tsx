import * as React from "react";
import { TokenBuySellComplete } from "../TokensStyledComponents";
import { TokenBuyCompleteText } from "../TokensTextComponents";
import { HollowGreenCheck } from "../../icons";

export const TokensTabBuyComplete = () => {
  return (
    <>
      <TokenBuySellComplete>
        <HollowGreenCheck width={48} height={48} />
        <TokenBuyCompleteText />
      </TokenBuySellComplete>
    </>
  );
};
