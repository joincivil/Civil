import * as React from "react";
import { UserTokenAccountRequirement } from "./TokensAccountRequirement";
import { FlexColumnsPrimaryModule, TokenBtns, TokenRequirementIcon } from "./TokensStyledComponents";
import {
  TokenConnectWalletText,
  TokenConnectWalletBtnText,
  TokenAuthBtnText,
  TokenAuthText,
} from "./TokensTextComponents";
import { TokenWalletIcon } from "../icons/TokenWalletIcon";
import { TOKEN_PROGRESS } from "./Tokens";

export interface TokenRequirementProps {
  step?: string;
  user: any;
  addWalletPath: string;
  signupPath: string;
}

export const UserTokenAccountSignup: React.StatelessComponent<TokenRequirementProps> = props => {
  const { addWalletPath, signupPath, step, user } = props;

  const renderConnectWallet = (): JSX.Element => (
    <>
      <TokenRequirementIcon step={step}>
        <TokenWalletIcon />
      </TokenRequirementIcon>
      <TokenConnectWalletText />
      <TokenBtns to={addWalletPath}>
        <TokenConnectWalletBtnText />
      </TokenBtns>
    </>
  );

  const renderNotLoggedIn = (): JSX.Element => (
    <>
      <TokenRequirementIcon step={step}>
        <TokenWalletIcon />
      </TokenRequirementIcon>
      <TokenAuthText />
      <TokenBtns to={signupPath}>
        <TokenAuthBtnText />
      </TokenBtns>
    </>
  );

  const renderAuthCard = (): JSX.Element => {
    if (!user) {
      return renderNotLoggedIn();
    }

    return renderConnectWallet();
  };

  if (step === TOKEN_PROGRESS.ACTIVE) {
    return (
      <FlexColumnsPrimaryModule padding={true}>
        <UserTokenAccountRequirement>{renderAuthCard()}</UserTokenAccountRequirement>
      </FlexColumnsPrimaryModule>
    );
  }

  return <></>;
};
