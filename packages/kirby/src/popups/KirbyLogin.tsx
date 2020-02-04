import React from "react";
import { CoreContext } from "@kirby-web3/child-react";
import { TrustedWebChildPlugin } from "@kirby-web3/plugin-trustedweb";

import { Login } from "../views/trustedweb/Login";
import { KirbyContainer, KirbyAppProps } from "../KirbyContainer";

export const KirbyLogin: React.FunctionComponent<KirbyAppProps> = ({ config }) => {
  return (
    <KirbyContainer config={config}>
      <KirbyLoginBody />
    </KirbyContainer>
  );
};

export const KirbyLoginBody: React.FunctionComponent = () => {
  const ctx = React.useContext(CoreContext);

  function onSuccess(): void {
    window.close();
  }

  return (
    <Login
      plugin={ctx.core.plugins.trustedweb as TrustedWebChildPlugin}
      requirePopup={false}
      onBackClicked={() => ({})}
      onSuccess={onSuccess}
    />
  );
};
