import * as React from "react";
import { TokenHeaderOuter, TokenHeader, TokenSetup } from "./TokensStyledComponents";
import { TokenWelcomeText, TokenSetupText } from "./TokensTextComponents";

export const UserTokenAccountHeader: React.StatelessComponent = props => {
  return (
    <TokenHeaderOuter>
      <TokenHeader>
        <TokenWelcomeText />
      </TokenHeader>
      <TokenSetup>
        <TokenSetupText />
      </TokenSetup>
    </TokenHeaderOuter>
  );
};
