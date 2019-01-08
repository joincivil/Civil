import * as React from "react";
import {
  StyledTokenHeaderOuter,
  StyledTokenHeader,
  StyledTokenSetupText,
  StyledTokenHelpText,
} from "./TokensStyledComponents";
import { TokenWelcomeText, TokenSetupText, TokenCompleteStepsHelpText } from "./TokensTextComponents";

export const UserTokenAccountHeader: React.StatelessComponent = props => {
  return (
    <StyledTokenHeaderOuter>
      <StyledTokenHeader>
        <TokenWelcomeText />
      </StyledTokenHeader>
      <StyledTokenSetupText>
        <TokenSetupText />
      </StyledTokenSetupText>
      <StyledTokenHelpText>
        <TokenCompleteStepsHelpText />
      </StyledTokenHelpText>
    </StyledTokenHeaderOuter>
  );
};
