import * as React from "react";
import { TrustedWebChildPlugin } from "@kirby-web3/plugin-trustedweb";
import { AccountForm } from "./AccountForm";

import { WindowContainer, WindowHeader, SmallerText, StrongText } from "./common";
import { CoreContext } from "@kirby-web3/child-react";
import { ViewPlugin } from "@kirby-web3/child-core";

export interface SignupProps {
  plugin: TrustedWebChildPlugin;
  onBackClicked(): void;
  onSuccess(): void;
}

export const Signup: React.FunctionComponent<SignupProps> = ({ plugin, onBackClicked, onSuccess }) => {
  const ctx = React.useContext(CoreContext);
  const viewPlugin = ctx.core.plugins.view as ViewPlugin;

  async function onSubmit(email: string, password: string): Promise<void> {
    const result = await plugin.upgradeEphemeral(email, password);
    console.log({ result });
  }

  return (
    <WindowContainer>
      <WindowHeader title="Create account" onCloseSelected={() => viewPlugin.completeView()} />
      <div>
        <StrongText>Control your transactions, identity, and more on any device.</StrongText>
      </div>
      <div>
        <SmallerText>
          {" "}
          Finish by creating an account to authenticate and sync this decentralized identity. You can customize your
          profile settings once you create an account.
        </SmallerText>
      </div>
      <AccountForm
        cta="Sign Up"
        onBackClicked={onBackClicked}
        checkPassword={onSubmit}
        confirmPassword
        onSuccess={onSuccess}
      />
    </WindowContainer>
  );
};
