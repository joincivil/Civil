import * as React from "react";
import { TokenSideModule, SideModuleContent } from "./TokensStyledComponents";
import { TokenQuestionsHeaderText, TokenAskQuestionText, TokenFAQText } from "./TokensTextComponents";
import { Collapsable } from "../Collapsable";

export const UserTokenAccountHelp: React.StatelessComponent = props => {
  return (
    <TokenSideModule>
      <Collapsable header={<TokenQuestionsHeaderText />} open={true}>
        <SideModuleContent>
          <TokenAskQuestionText />
        </SideModuleContent>
        <SideModuleContent>
          <TokenFAQText />
        </SideModuleContent>
      </Collapsable>
    </TokenSideModule>
  );
};
