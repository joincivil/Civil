import * as React from "react";
import { UserTokenAccountRequirement } from "./TokensAccountRequirement";
import { TokenBtns, TokenRequirementIcon } from "./TokensStyledComponents";
import {
  TokenConnectWalletHeaderText,
  TokenConnectWalletInfoText,
  TokenConnectWalletBtnText,
} from "./TokensTextComponents";
import { TokenAddWalletIcon } from "../icons/TokenAddWalletIcon";

export const UserTokenAccountSignup: React.StatelessComponent = props => {
  return (
    <>
      <UserTokenAccountRequirement>
        <TokenRequirementIcon>
          <TokenAddWalletIcon />
        </TokenRequirementIcon>
        <TokenConnectWalletHeaderText />
        <TokenConnectWalletInfoText />
        <TokenBtns>
          <TokenConnectWalletBtnText />
        </TokenBtns>
      </UserTokenAccountRequirement>
    </>
  );
};
