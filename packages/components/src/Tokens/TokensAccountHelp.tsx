import * as React from "react";
import { TokenQuestionsHeaderText, TokenFAQText } from "./TokensTextComponents";
import { FlexColumnsSecondaryModule } from "./TokensStyledComponents";
import { Collapsable } from "../Collapsable";

export const UserTokenAccountHelp: React.StatelessComponent = props => {
  return (
    <FlexColumnsSecondaryModule>
      <Collapsable header={<TokenQuestionsHeaderText />} open={true}>
        <TokenFAQText />
      </Collapsable>
    </FlexColumnsSecondaryModule>
  );
};
