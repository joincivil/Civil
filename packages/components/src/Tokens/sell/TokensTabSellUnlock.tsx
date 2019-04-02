import * as React from "react";
import { TokenUnlockSellText } from "../TokensTextComponents";
import { TokensUnlockMessage } from "../TokensUnlockMessage";

export const TokensTabSellUnlock: React.FunctionComponent = props => {
  return (
    <>
      <TokenUnlockSellText />
      <TokensUnlockMessage />
    </>
  );
};
