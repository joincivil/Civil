import * as React from "react";
import { UserTokenAccountRequirement } from "./TokensAccountRequirement";
import { TokenBtns, TokenRequirementIcon, TokenAccountSectionHeader } from "./TokensStyledComponents";
import {
  TokenVerifySectionHeaderText,
  TokenVerifySectionInfoText,
  TokenQuizHeaderText,
  TokenQuizInfoText,
  TokenQuizBtnText,
  TokenVerifyHeaderText,
  TokenVerifyInfoText,
  TokenVerifyBtnText,
} from "./TokensTextComponents";
import { VerifyIdentityIcon } from "../icons/VerifyIdentityIcon";
import { CivilTutorialIcon } from "../icons/CivilTutorialIcon";

export const UserTokenAccountVerify: React.StatelessComponent = props => {
  return (
    <>
      <TokenAccountSectionHeader>
        <TokenVerifySectionHeaderText />
        <TokenVerifySectionInfoText />
      </TokenAccountSectionHeader>
      <UserTokenAccountRequirement>
        <TokenRequirementIcon>
          <CivilTutorialIcon />
        </TokenRequirementIcon>
        <TokenQuizHeaderText />
        <TokenQuizInfoText />
        <TokenBtns>
          <TokenQuizBtnText />
        </TokenBtns>
      </UserTokenAccountRequirement>
      <UserTokenAccountRequirement>
        <TokenRequirementIcon>
          <VerifyIdentityIcon />
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
