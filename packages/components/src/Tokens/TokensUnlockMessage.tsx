import * as React from "react";
import { TokenUnlock, TokenBtnsInverted } from "./TokensStyledComponents";
import { TokenUnlockText, TokenUnlockBtnText } from "./TokensTextComponents";

export const TokensUnlockMessage: React.FunctionComponent = props => {
  return (
    <TokenUnlock>
      <TokenUnlockText />
      <TokenBtnsInverted to="/dashboard/tasks/transfer-voting-tokens">
        <TokenUnlockBtnText />
      </TokenBtnsInverted>
    </TokenUnlock>
  );
};
