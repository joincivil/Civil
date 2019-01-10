import * as React from "react";
import { UserTokenAccountRequirement } from "./TokensAccountRequirement";
import { TokenBtns, TokenRequirementIcon } from "./TokensStyledComponents";
import {
  TokenQuizHeaderText,
  TokenQuizInfoText,
  TokenQuizBtnText,
  TokenVerifyHeaderText,
  TokenVerifyInfoText,
  TokenVerifyBtnText,
} from "./TokensTextComponents";
import { TokenIdentityIcon } from "../icons/TokenIdentityIcon";
import { TokenTutorialIcon } from "../icons/TokenTutorialIcon";

export const UserTokenAccountVerify: React.StatelessComponent = props => {
  return (
    <>
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
    </>
  );
};
