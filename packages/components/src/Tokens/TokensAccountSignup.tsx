import * as React from "react";
import { UserTokenAccountRequirement } from "./TokensAccountRequirement";
import { TokenBtns, TokenRequirementIcon, TokenCheckIcon } from "./TokensStyledComponents";
import {
  TokenConnectWalletText,
  TokenConnectWalletBtnText,
  TokenConnectWalletCompletedText,
} from "./TokensTextComponents";
import { TokenWalletIcon } from "../icons/TokenWalletIcon";
import { HollowGreenCheck } from "../icons/HollowGreenCheck";

export type TokenAccountStep = "completed" | "incomplete";

export interface TokenRequirementProps {
  step?: TokenAccountStep;
}

export const UserTokenAccountSignup: React.StatelessComponent<TokenRequirementProps> = props => {
  if (props.step === "completed") {
    return (
      <UserTokenAccountRequirement step={props.step}>
        <TokenCheckIcon>
          <HollowGreenCheck width={42} height={42} />
        </TokenCheckIcon>
        <TokenConnectWalletCompletedText />
      </UserTokenAccountRequirement>
    );
  }
  return (
    <UserTokenAccountRequirement>
      <TokenRequirementIcon step={props.step}>
        <TokenWalletIcon />
      </TokenRequirementIcon>
      <TokenConnectWalletText />
      {/* TODO(jorgelo): The login url should probably be a global constant. */}
      <TokenBtns to="/account/eth">
        <TokenConnectWalletBtnText />
      </TokenBtns>
    </UserTokenAccountRequirement>
  );
};
