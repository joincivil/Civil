import * as React from "react";
import { TokenBtns, TokenBuySection } from "./TokensStyledComponents";
import { TokenBuyText, TokenBuyBtnText } from "./TokensTextComponents";

export const UserTokenAccountBuy: React.StatelessComponent = props => {
  return (
    <>
      <TokenBuySection>
        <TokenBuyText />
        <TokenBtns disabled={true}>
          <TokenBuyBtnText />
        </TokenBtns>
      </TokenBuySection>
    </>
  );
};
