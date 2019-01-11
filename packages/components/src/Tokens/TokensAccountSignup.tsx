import * as React from "react";
import { UserTokenAccountRequirement } from "./TokensAccountRequirement";
import { TokenBtns, TokenRequirementIcon } from "./TokensStyledComponents";
import {
  TokenConnectWalletHeaderText,
  TokenConnectWalletInfoText,
  TokenConnectWalletBtnText,
} from "./TokensTextComponents";
import { TokenWalletIcon } from "../icons/TokenWalletIcon";

export const UserTokenAccountSignup: React.StatelessComponent = props => {
  return (
    <>
      <UserTokenAccountRequirement>
        <TokenRequirementIcon>
          <TokenWalletIcon />
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
