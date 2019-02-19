import * as React from "react";
import { UserTokenAccountRequirement } from "./TokensAccountRequirement";
import { FlexColumnsPrimaryModule, TokenBtns, TokenRequirementIcon } from "./TokensStyledComponents";
import { TokenConnectWalletText, TokenConnectWalletBtnText } from "./TokensTextComponents";
import { TokenWalletIcon } from "../icons/TokenWalletIcon";

export interface TokenRequirementProps {
  step?: string;
  addWalletPath: string;
}

export const UserTokenAccountSignup: React.StatelessComponent<TokenRequirementProps> = props => {
  const { addWalletPath } = props;

  if (props.step === "active") {
    return (
      <FlexColumnsPrimaryModule padding={true}>
        <UserTokenAccountRequirement>
          <TokenRequirementIcon step={props.step}>
            <TokenWalletIcon />
          </TokenRequirementIcon>
          <TokenConnectWalletText />
          <TokenBtns to={addWalletPath}>
            <TokenConnectWalletBtnText />
          </TokenBtns>
        </UserTokenAccountRequirement>
      </FlexColumnsPrimaryModule>
    );
  }

  return <></>;
};
