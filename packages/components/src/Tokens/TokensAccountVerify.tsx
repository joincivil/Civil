import * as React from "react";
import { UserTokenAccountRequirement } from "./TokensAccountRequirement";
import { TokenBtns, TokenRequirementIcon, TokenAccountSectionHeader } from "./TokensStyledComponents";
import {
  TokenVerifySectionText,
  TokenQuizSectionText,
  TokenQuizBtnText,
  TokenVerifyText,
  TokenVerifyBtnText,
} from "./TokensTextComponents";
import { VerifyIdentityIcon } from "../icons/VerifyIdentityIcon";
import { CivilTutorialIcon } from "../icons/CivilTutorialIcon";

export const UserTokenAccountVerify: React.StatelessComponent = props => {
  return (
    <>
      <TokenAccountSectionHeader>
        <TokenVerifySectionText />
      </TokenAccountSectionHeader>
      <UserTokenAccountRequirement>
        <TokenRequirementIcon>
          <CivilTutorialIcon />
        </TokenRequirementIcon>
        <TokenQuizSectionText />
        <TokenBtns>
          <TokenQuizBtnText />
        </TokenBtns>
      </UserTokenAccountRequirement>
      <UserTokenAccountRequirement>
        <TokenRequirementIcon>
          <VerifyIdentityIcon />
        </TokenRequirementIcon>
        <TokenVerifyText />
        <TokenBtns>
          <TokenVerifyBtnText />
        </TokenBtns>
      </UserTokenAccountRequirement>
    </>
  );
};
