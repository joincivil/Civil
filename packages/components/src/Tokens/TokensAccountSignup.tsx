import * as React from "react";
import { UserTokenAccountRequirement } from "./TokensAccountRequirement";
import { TokenBtns, TokenRequirementIcon } from "./TokensStyledComponents";
import {
  TokenConnectWalletText,
  TokenConnectWalletBtnText,
  TokenConnectWalletCompletedText,
} from "./TokensTextComponents";
import { TokenWalletIcon } from "../icons/TokenWalletIcon";
import { HollowGreenCheck } from "../icons/HollowGreenCheck";

export const UserTokenAccountSignup: React.StatelessComponent = props => {
  const completed = false;

  if (completed) {
    return (
      <UserTokenAccountRequirement>
        <TokenRequirementIcon>
          <HollowGreenCheck width={42} height={42} />
        </TokenRequirementIcon>
        <TokenConnectWalletCompletedText />
      </UserTokenAccountRequirement>
    );
  } else {
    return (
      <UserTokenAccountRequirement >
        <TokenRequirementIcon>
          <TokenWalletIcon />
        </TokenRequirementIcon>
        <TokenConnectWalletText />
        <TokenBtns>
          <TokenConnectWalletBtnText />
        </TokenBtns>
      </UserTokenAccountRequirement>
    );
  }
};
