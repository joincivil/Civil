import * as React from "react";
import { CenteredPage, CoreContext } from "@kirby-web3/child-react";
import { DarkButton, buttonSizes } from "@joincivil/elements";
import { TrustedWebChildPlugin } from "@kirby-web3/plugin-trustedweb";

export const LoggedOut: React.FunctionComponent = () => {
  const ctx = React.useContext(CoreContext);
  const trustedweb = ctx.core.plugins.trustedweb as TrustedWebChildPlugin;

  return (
    <CenteredPage>
      <span>You are currently logged out. Click to create a new guest account.</span>
      <DarkButton size={buttonSizes.SMALL} onClick={() => trustedweb.startup()}>
        Begin
      </DarkButton>
    </CenteredPage>
  );
};
