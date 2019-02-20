import * as React from "react";
import { UserTokenAccountRequirement } from "./TokensAccountRequirement";
import { FlexColumnsPrimaryModule, TokenBtns, TokenRequirementIcon } from "./TokensStyledComponents";
import { TokenConnectWalletText, TokenConnectWalletBtnText } from "./TokensTextComponents";
import { TokenWalletIcon } from "../icons/TokenWalletIcon";
import { TOKEN_PROGRESS } from "./Tokens";

export interface TokenRequirementProps {
  step?: string;
  addWalletPath?: string;
}

export const UserTokenAccountSignup: React.StatelessComponent<TokenRequirementProps> = props => {
  const { addWalletPath, step } = props;

  if (step === TOKEN_PROGRESS.ACTIVE) {
    return (
      <FlexColumnsPrimaryModule padding={true}>
        <UserTokenAccountRequirement>
          <TokenRequirementIcon step={step}>
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
