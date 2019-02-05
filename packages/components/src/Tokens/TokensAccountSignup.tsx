import * as React from "react";
import { UserTokenAccountRequirement } from "./TokensAccountRequirement";
import { FlexColumnsPrimaryModule, TokenBtns, TokenRequirementIcon } from "./TokensStyledComponents";
import { TokenConnectWalletText, TokenConnectWalletBtnText } from "./TokensTextComponents";
import { TokenWalletIcon } from "../icons/TokenWalletIcon";

export interface TokenRequirementProps {
  step?: string;
}

export const UserTokenAccountSignup: React.StatelessComponent<TokenRequirementProps> = props => {
  if (props.step === "active") {
    return (
      <FlexColumnsPrimaryModule padding={true}>
        <UserTokenAccountRequirement>
          <TokenRequirementIcon step={props.step}>
            <TokenWalletIcon />
          </TokenRequirementIcon>
          <TokenConnectWalletText />
          <TokenBtns>
            <TokenConnectWalletBtnText />
          </TokenBtns>
        </UserTokenAccountRequirement>
      </FlexColumnsPrimaryModule>
    );
  }

  return <></>;
};
