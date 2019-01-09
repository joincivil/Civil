import * as React from "react";
import { UserTokenAccountRequirement } from "./TokensAccountRequirement";
import { TokenBtns, TokenRequirementIcon, TokenRequirementFooter } from "./TokensStyledComponents";
import {
  TokenConnectWalletHeaderText,
  TokenConnectWalletInfoText,
  TokenConnectWalletBtnText,
  TokenQuizHeaderText,
  TokenQuizInfoText,
  TokenQuizBtnText,
  TokenVerifyHeaderText,
  TokenVerifyInfoText,
  TokenVerifyBtnText,
  TokenBuyBtnText,
} from "./TokensTextComponents";
import { TokenAddWalletIcon } from "../icons/TokenAddWalletIcon";
import { TokenIdentityIcon } from "../icons/TokenIdentityIcon";
import { TokenTutorialIcon } from "../icons/TokenTutorialIcon";

export const UserTokenAccountRequirements: React.StatelessComponent = props => {
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
      <UserTokenAccountRequirement>
        <TokenRequirementIcon>
          <TokenTutorialIcon />
        </TokenRequirementIcon>
        <TokenQuizHeaderText />
        <TokenQuizInfoText />
        <TokenBtns>
          <TokenQuizBtnText />
        </TokenBtns>
      </UserTokenAccountRequirement>
      <UserTokenAccountRequirement>
        <TokenRequirementIcon>
          <TokenIdentityIcon />
        </TokenRequirementIcon>
        <TokenVerifyHeaderText />
        <TokenVerifyInfoText />
        <TokenBtns>
          <TokenVerifyBtnText />
        </TokenBtns>
      </UserTokenAccountRequirement>
      <TokenRequirementFooter>
        <TokenBtns>
          <TokenBuyBtnText />
        </TokenBtns>
      </TokenRequirementFooter>
    </>
  );
};
