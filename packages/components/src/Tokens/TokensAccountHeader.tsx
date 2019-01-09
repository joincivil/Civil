import * as React from "react";
import { TokenHeaderOuter, TokenHeader, TokenSetup, TokenHelp } from "./TokensStyledComponents";
import { TokenWelcomeText, TokenSetupText, TokenCompleteStepsHelpText } from "./TokensTextComponents";

export const UserTokenAccountHeader: React.StatelessComponent = props => {
  return (
    <TokenHeaderOuter>
      <TokenHeader>
        <TokenWelcomeText />
      </TokenHeader>
      <TokenSetup>
        <TokenSetupText />
      </TokenSetup>
      <TokenHelp>
        <TokenCompleteStepsHelpText />
      </TokenHelp>
    </TokenHeaderOuter>
  );
};
