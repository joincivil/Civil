import * as React from "react";
import { TokenBtns, TokenRequirementFooter } from "./TokensStyledComponents";
import { TokenBuyBtnText } from "./TokensTextComponents";

export const UserTokenAccountBuy: React.StatelessComponent = props => {
  return (
    <>
      <TokenRequirementFooter>
        <TokenBtns>
          <TokenBuyBtnText />
        </TokenBtns>
      </TokenRequirementFooter>
    </>
  );
};
