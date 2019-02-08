import * as React from "react";
import { TokenQuestionsHeaderText, TokenFAQText } from "./TokensTextComponents";
import { FlexColumnsSecondaryModule } from "./TokensStyledComponents";
import { Collapsable } from "../Collapsable";

export interface UserTokenAccountHelpProps {
  supportEmailAddress: string;
  faqUrl: string;
}

export const UserTokenAccountHelp: React.StatelessComponent<UserTokenAccountHelpProps> = props => {
  return (
    <FlexColumnsSecondaryModule>
      <Collapsable header={<TokenQuestionsHeaderText />} open={true}>
        <TokenFAQText supportEmailAddress={props.supportEmailAddress} faqUrl={props.faqUrl} />
      </Collapsable>
    </FlexColumnsSecondaryModule>
  );
};
