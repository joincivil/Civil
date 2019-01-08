import * as React from "react";
import { StyledTokenSideModule, StyledSideModuleText } from "./TokensStyledComponents";
import { TokenQuestionsHeaderText, TokenAskQuestionText, TokenFAQText } from "./TokensTextComponents";
import { Collapsable } from "../Collapsable";

export const UserTokenAccountHelp: React.StatelessComponent = props => {
  return (
    <StyledTokenSideModule>
      <Collapsable header={<TokenQuestionsHeaderText />} open={true}>
        <StyledSideModuleText>
          <TokenAskQuestionText />
        </StyledSideModuleText>
        <StyledSideModuleText>
          <TokenFAQText />
        </StyledSideModuleText>
      </Collapsable>
    </StyledTokenSideModule>
  );
};
